import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { redis } from "../lib/redis.js";
import transporter from "../config/mail.js";

const generateTokens = async (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const generateVerificationCode = () => {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  return { verificationCode };
};

const storeVerificationCode = async (userId, verificationCode) => {
  try {
    await redis.set(`verification:${userId}`, verificationCode, "EX", 600); // 10 min
    return true;
  } catch (error) {
    console.log("Verification code storing failed in redis", error);
    return false;
  }
};

const sendVerificationEmail = async (receiver, verificationCode) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: receiver,
      subject: "Verify your Email",
      html: `This is your verification code: ${verificationCode}`,
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
      const { verificationCode } = await generateVerificationCode();
      const isCodeStored = await storeVerificationCode(
        user._id,
        verificationCode,
      );

      if (isCodeStored) {
        isEmailSent = await sendVerificationEmail(email, verificationCode);
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
      message: "You have successfully signed in",
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
    const { verificationCode } = req.body;
    const userId = req.user._id;

    if (!verificationCode) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_VERIFICATION_CODE",
        message: "Please provide a verification code",
      });
    }

    const savedVerificationCode = await redis.get(`verification:${userId}`);

    if (!savedVerificationCode) {
      return res.status(400).json({
        success: false,
        errorCode: "VERIFICATION_CODE_NOT_FOUND",
        message: "Your verification code has expired, please request a new one",
      });
    }

    if (savedVerificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        errorCode: "INVALID_VERIFICATION_CODE",
        message: "Invalid verification code",
      });
    }

    const verifiedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { isVerified: true } },
      { returnDocument: "after" },
    ).select("-password");

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
    const { verificationCode } = await generateVerificationCode();
    const isCodeStored = await storeVerificationCode(
      user._id,
      verificationCode,
    );
    if (!isCodeStored) {
      return res.status(400).json({
        success: false,
        errorCode: "CODE_NOT_STORED",
        message: "Verification code storing failed, please try again",
      });
    }

    const isEmailSent = await sendVerificationEmail(
      user.email,
      verificationCode,
    );
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
