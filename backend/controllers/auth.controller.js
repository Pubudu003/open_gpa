import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { redis } from "../lib/redis.js";
import transporter from "../config/mail.js";
import crypto from "crypto";

const generateTokens = async (userId) => {
  const accessToken = await jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const generateSecreteCode = async () => {
  const secretCode = Math.floor(100000 + Math.random() * 900000);
  return { secretCode };
};

const storeSecretCode = async (keyValue, storingValue, keyName) => {
  try {
    await redis.set(`${keyName}:${keyValue}`, storingValue, "EX", 600); // 10 min
    return true;
  } catch (error) {
    console.log(`Secret code storing failed in redis: ${error}`);
    return false;
  }
};

const sendEmail = async (receiver, secretCode, subject, body) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: receiver,
      subject,
      html: `${body}: ${secretCode}`,
    });

    return true;
  } catch (error) {
    console.log("Verification email sending failed", error);
    return false;
  }
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60,
  ); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent xss attacks
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15min
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevent xss attacks
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
  });
};

export const signup = async (req, res) => {
  let isEmailSent = false;

  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        errorCode: "USER_ALREADY_EXISTS",
        message: "User already exists",
      });
    }

    const user = await User.create({ userName, email, password });

    // authenticate
    const { accessToken, refreshToken } = await generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    // send verification code
    try {
      const { secretCode } = await generateSecreteCode();
      const isCodeStored = await storeSecretCode(
        user._id,
        secretCode,
        "verification",
      );

      if (isCodeStored) {
        const subject = "Verify your account";
        const body = "Your verification code is";
        isEmailSent = await sendEmail(email, secretCode, subject, body);
      } else {
        return res.status(201).json({
          success: true,
          user: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            role: user.role,
          },
          isEmailSent: false,
          errorCode: "CODE_NOT_STORED",
          message:
            "User created, but verification code storing failed, please try again",
        });
      }
    } catch (error) {
      console.log("Error in sending verification code", error);
      return res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
        },
        isEmailSent: false,
        errorCode: "VERIFICATION_CODE_SENDING_FAILED",
        message:
          "User created, but verification code sending failed, please try resend the code",
      });
    }

    return res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
      isEmailSent,
      message: "You have successfully signed up",
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error",
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email }).populate(
      "degree courses.course",
    );

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        errorCode: "INVALID_EMAIL_OR_PASSWORD",
        message: "Invalid email or Password",
      });
    }

    const finalUser = user.toObject();
    delete finalUser.password;

    const { accessToken, refreshToken } = await generateTokens(user._id);

    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      user: finalUser,
      message: user.isVerified
        ? "You have successfully logged in"
        : "Check your email to verify your account",
    });
  } catch (error) {
    console.log("Error in login controller: ", error);
    return res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal sever error",
    });
  }
};

export const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error",
    });
  }
};

// this will refresh the access token
export const refreshToken = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        errorCode: "NO_REFRESH_TOKEN",
        message: "No refresh token provided",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        errorCode: "INVALID_REFRESH_TOKEN",
        message: "Invalid refresh token",
      });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15min
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.log("Error in refreshToken controller: ", error);
    res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error",
    });
  }
};

// verify email
export const verifyEmail = async (req, res) => {
  try {
    const secretCode = req.body.verificationCode;
    const userId = req.user._id;

    if (!secretCode) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_VERIFICATION_CODE",
        message: "Please provide a verification code",
      });
    }

    const storedSecretCode = await redis.get(`verification:${userId}`);
    if (!storedSecretCode) {
      return res.status(400).json({
        success: false,
        errorCode: "VERIFICATION_CODE_NOT_FOUND",
        message: "Your verification code has expired, please request a new one",
      });
    }

    if (storedSecretCode !== secretCode) {
      return res.status(400).json({
        success: false,
        errorCode: "INVALID_VERIFICATION_CODE",
        message: "Your verification code is invalid",
      });
    }

    const verifiedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { isVerified: true } },
      { returnDocument: "after" },
    )
      .populate("degree courses.course")
      .select("-password");

    await redis.del(`verification:${userId}`);

    return res.status(200).json({
      success: true,
      user: verifiedUser,
      message: "User verified successfully",
    });
  } catch (error) {
    console.log("Error in verifyEmail controller: ", error);
    return res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal Server Error",
    });
  }
};

// resend code
export const resendVerificationCode = async (req, res) => {
  try {
    console.log("resendVerificationCode backend controller triggered...");
    const user = req.user;

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        errorCode: "USER_ALREADY_VERIFIED",
        message: "User is already verified",
      });
    }

    // Check if a cooldown is active in redis
    const cooldownKey = `cooldown:verification:${user._id}`;
    const isCooldownActive = await redis.get(cooldownKey);

    if (isCooldownActive) {
      return res.status(429).json({
        success: false,
        errorCode: "COOLDOWN_ACTIVE",
        message: "Pleas wait 60 seconds before requesting another code",
      });
    }

    // send verification code
    const { secretCode } = await generateSecreteCode();
    const isCodeStored = await storeSecretCode(
      user._id,
      secretCode,
      "verification",
    );
    if (!isCodeStored) {
      return res.status(400).json({
        success: false,
        errorCode: "CODE_NOT_STORED",
        message: "Verification code storing failed, please try again",
      });
    }

    const subject = "Verify your email";
    const body = "Your verification code is";
    const isEmailSent = await sendEmail(user.email, secretCode, subject, body);
    if (!isEmailSent) {
      return res.status(400).json({
        success: false,
        errorCode: "EMAIL_NOT_SENT",
        message: "Email sending failed, please try again",
      });
    }

    // Set the cooldown flag in redis for 60s
    await redis.set(cooldownKey, "true", "EX", 60);

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    console.log("Error in resendVerificationCode controller: ", error);
    return res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal Server Error",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_EMAIL",
        message: "Email address is required to reset your password.",
      });
    }

    // check if a cooldown is active in redis
    const cooldownKey = `cooldown:reset-password:${email}`;
    const isCooldownActive = await redis.get(cooldownKey);

    if (isCooldownActive) {
      return res.status(429).json({
        success: false,
        errorCode: "COOLDOWN_ACTIVE",
        message:
          "A password reset link has already been sent to this email. Please wait 60 seconds before requesting another link.",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists && !userExists.isVerified) {
      return res.status(400).json({
        success: false,
        errorCode: "USER_NOT_VERIFIED",
        message: "Please verify your email before resetting your password.",
      });
    }

    if (userExists) {
      // Generate Token
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      // store hashed token
      const isTokenStored = await storeSecretCode(
        hashedToken,
        userExists._id,
        "reset-password",
      );

      if (!isTokenStored) {
        return res.status(500).json({
          success: false,
          errorCode: "SERVER_ERROR",
          message: "Something went wrong. Please try again later.",
        });
      }

      const subject = "Reset your password";
      const body = "Your password reset link: ";
      const resetLink = `http://localhost:5173/reset-password?token=${rawToken}`;

      const isEmailSent = await sendEmail(email, resetLink, subject, body);
      if (!isEmailSent) {
        return res.status(500).json({
          success: false,
          errorCode: "SERVER_ERROR",
          message: "Something went wrong. Please try again later.",
        });
      }
    }

    // Set the cooldown flag in redis for 60s
    await redis.set(cooldownKey, "true", "EX", 60);

    return res.status(200).json({
      success: true,
      message: "A password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword controller: ", error);
    return res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal Server Error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword, token } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_NEW_PASSWORD",
        message: "New password is required to reset your password.",
      });
    }

    if (!token) {
      return res.status(400).json({
        success: false,
        errorCode: "SERVER_ERROR",
        message: "Something went wrong. Please try again later.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const userId = await redis.get(`reset-password:${hashedToken}`);

    if (!userId) {
      return res.status(400).json({
        success: false,
        errorCode: "INVALID_TOKEN",
        message: "Invalid or expired token",
      });
    }

    const user = await User.findById(userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        errorCode: "INVALID_TOKEN",
        message: "Invalid or expired token",
      });
    }

    user.password = newPassword;
    await user.save();
    await user.populate("degree courses.course");

    const safeUser = user.toObject();
    delete safeUser.password;

    await redis.del(
      `reset-password:${hashedToken}`,
      `cooldown:reset-password:${user.email}`,
      `refresh_token:${user._id}`,
    );

    // notify the user by email - password was reset. if that wasnt you, contact support.

    return res.status(200).json({
      success: true,
      user: safeUser,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error in resetPassword controller: ", error);
    return res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal Server Error",
    });
  }
};
