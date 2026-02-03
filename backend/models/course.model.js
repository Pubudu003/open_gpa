import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseId:{
    type: String,
    required: [true, "Course ID is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  courseName: {
    type: String,
    required: [true, "Course name is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  courseCredit: {
    type: Number,
    required: [true, "Course credit is required"],
    min: [0, "Course credit must be greater than or equal to 0"],
  },
  courseDescription: {
    type: String,
    required: false,
    default: "",
    trim: true
  },
  faculty: {
    type: String,
    required: [true, "Faculty is required"],
    lowercase: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    lowercase: true,
    trim: true
  },
  degreeCode: {
    type: String,
    required: [true, "Degree code is required"],
    lowercase: true,
    trim: true
  },
  degreeName: {
    type: String,
    required: [true, "Degree name is required"],
    lowercase: true,
    trim: true
  },
  degreeType: {
    type: String,
    enum: ["general", "special"],
    default: "general",
    required: [true, "Degree type is required"],
    lowercase: true,
    trim: true
  },
  year: {
    type: String,
    enum: ["1st", "2nd", "3rd", "4th"],
    default: "1st",
    required: [true, "Year is required"],
    lowercase: true,
    trim: true
  },
  semester: {
    type: String,
    enum: ["1st", "2nd"],
    default: "1st",
    required: [true, "Semester is required"],
    lowercase: true,
    trim: true
  }
})

const Course = mongoose.model("Course", courseSchema);

export default Course;