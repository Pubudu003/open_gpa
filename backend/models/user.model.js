import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  userName:{
    type: String,
    required: [true, "User name is required"]
  },
  email:{
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password:{
    type: String,
    required: [true, "Password is required"],
    trim: true,
    minlength: [8, "Password must be at least 8 characters"],
  },
  degree: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Degree"
    }
  ],
  courses:[
    {
      courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      },
      grade:{
        type: String,
        enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "E"]
      },
      gpv:{
        type: Number,
        enum: [4.00, 3.70, 3.30, 3.00, 2.70, 2.30, 2.00, 1.70, 1.30, 1.00, 0],
        default: 0
      }
    }
  ],
  gpa:{
    type: Number,
    default: 0
  },
  totalCredits:{
    type: Number,
    default: 0
  },
  role:{
    type: String,
    enum: ["student", "admin"],
    default: "student"
  }
}, 
{
  timestamps: true
});


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
})

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;

