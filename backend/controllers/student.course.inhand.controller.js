import mongoose from "mongoose";
import User from "../models/user.model.js";

export const getAllCoursesInHand = async (req, res) => {
  try {
    const userId = req.user._id;

    const courses = await User.findById({ _id: userId }).select("courses -_id").populate("courses.courseId");

    if (courses.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json({ success: true, courses: courses });

  } catch (error) {
    console.log("Error in getAllCoursesInHand(student.controller) controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getCourseInHand = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid or missing course id" });
    }

    const course = await User.findById(userId).select({ courses: {  $elemMatch: { courseId } } }).populate("courses.courseId");

    if (!course) {
      return res.status(200).json({ message: "Course not found" });
    }

    return res.status(200).json({ success: true, course: course });
  } catch (error) {
    console.log("Error in getCourseInHand(student.controller) controller", error);
    return res.status(500).json({  message: "Internal server error" });
  }
}