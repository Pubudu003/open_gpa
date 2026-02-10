import mongoose from "mongoose";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const getAllCourses = async (req, res) => {
  try {
    const degreeCode = req.user?.degreeCode;

    if (!degreeCode) {
      const errorMessage = req.user
        ? "User not enrolled in any degree"
        : "Authentication required";
      
      return res.status(req.user ? 400 : 401).json({ message: errorMessage });
    }

    const courses = await Course.find({ degreeCode });

    if (!courses || courses.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(courses);
  } catch (error) {
    console.log("Error in getAllCourses(student.controller) controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCourse = async (req, res) => {
   try {
    const degreeCode = req.user?.degreeCode;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Course id is not provided" });
    }

    if (!degreeCode) {
      const errorMessage = req.user
        ? "User not enrolled in any degree"
        : "Authentication required";
      
      return res.status(req.user ? 400 : 4001).json({ message: errorMessage });
    }

    const course = await Course.findOne({ degreeCode, _id: id });

    if (!course) {
      return res.status(200).json({ message: "Course not found" });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.log("Error in getCourses(student.controller) controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const selectCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    const courseExist = await User.findOne({ _id: userId, "courses.courseId": courseId });

    if (courseExist) {
      return res.status(400).json({ message: "Course already selected" });
    }

    const course = await Course.findOne({ _id: courseId });

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId) || !course) {
      return res.status(400).json({ message: "Invalid or missing course id" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { courses: { courseId } } },
      { new: true, runValidators: true }
    )
    .select("-password")
    .populate("courses.courseId");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found, update failed" });
    }

    return res.status(200).json({ 
      success: true,
      message: "Course selected successfully", 
      user: updatedUser });
    
  } catch (error) {
    console.error("Error in selectCourse(student.controller) controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deselectCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid or missing course id" });
    }

    const courseExist = await User.findOne({ _id: userId, "courses.courseId": courseId });

    if (!courseExist) {
      return res.status(400).json({ message: "Course already removed" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { courses: { courseId } } },
      { new: true, runValidators: true }
    )
    .select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found, update failed" });
    }

    return res.status(200).json({ 
      success: true,
      message: "Course removed successfully", 
      user: updatedUser });
    
  } catch (error) {
    console.error("Error in selectCourse(student.controller) controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
