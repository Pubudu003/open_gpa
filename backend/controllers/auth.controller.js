import User from "../models/user.model.js";
import { sendVerificationEmail } from "../nodemailer/emails.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "../nodemailer/emailTemplates.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            throw new Error("User already exists");
        }

        const verificationToken = generateVerificationCode();

        const user = new User({ 
            name, 
            email, 
            password,
            verificationToken,
            verificationTokenExpiry: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
        });
        await user.save();

        const verificationUrl = `${process.env.FRONTEND_URL}/verifyemail/${verificationToken}`;

        const message = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationUrl}", verificationUrl);

        try {
            await sendVerificationEmail({
                email: user.email,
                subject: "Verify Your Email for GPA Calculator",
                message,
            })
        } catch (sendEmailError) {
            console.log("Error sending verification email:", sendEmailError);
            user.verificationToken = undefined;
            user.verificationTokenExpiry = undefined;
            await user.save();
            throw new Error("Error sending verification email");
        }

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: { ...user._doc }
        });
    } catch (error) {
        res.status(400).json({
            success: false, message: error.message });
    }
};
export const login = async (req, res) => {
    res.send("login route called");
};
export const logout = async (req, res) => {
    res.send("logout route called");
};