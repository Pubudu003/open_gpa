import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "User name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [8, "Password must be at least 8 characters"],
    },
    isVerified: {
      type: Boolean,
      required: false,
    },
    degree: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Degree",
    },
    courses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        grade: {
          type: String,
          enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "E"],
        },
        gpv: {
          type: Number,
          enum: [4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0],
          default: 0,
        },
      },
    ],
    gpa: {
      type: Number,
      default: 0,
    },
    totalCredits: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ _id: 1, "courses.course": 1 }, { unique: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
