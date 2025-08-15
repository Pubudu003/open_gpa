import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    // User's name, must be required
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    // User's email, must be unique and required
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [
            // regex to validate email
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ]
    },
    // User's password, must be required
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minLength: [6, "Password must be at least 6 characters"],
        select: false // to not return password in response
    },
    // User's role (e.g., student, admin), default is student
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    },
    // Field to track if the user's email has been verified
    isVerified: {
        type: Boolean,
        default: false
    },
    // Field to store the user's batch year
    batchYear: {
        type: String,
        required: [true, "Your batch year is required"]
    },
    // Field for storing a verification token (e.g., for email verification)
    verificationToken: String,
    // Field for storing the expiry of the verification token
    verificationTokenExpiry: Date,
    // Field for storing the reset password token
    resetPasswordToken: String,
    // Field for storing the expiry of the reset password token
    resetPasswordTokenExpiry: Date,
},
{
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
    // Only hash if the password is modified or new
    if (!this.isModified("password")) {
        return next();
    }
    // Generate the salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare the password with the hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;