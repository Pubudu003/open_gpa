import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseCode:{
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
  level: {
    type: String,
    enum: ["3", "4", "5", "6"],
    default: "3",
    required: [true, "level is required"],
    trim: true
  },
  semester: {
    type: String,
    enum: ["1", "2"],
    default: "1",
    required: [true, "Semester is required"],
    trim: true
  },
  degree: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Degree",
    required: [true, "Degree is required"],
  }
]
},
{
  timeseries: true
})

const Course = mongoose.model("Course", courseSchema);

export default Course;