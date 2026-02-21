import mongoose from "mongoose";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const getAllCourses = async (req, res) => {
  try {
    const userDegreeId = req.user?.degree._id;

    if (!userDegreeId) {
      const errorMessage = req.user
        ? "User not enrolled in any degree"
        : "Authentication required";
      
      return res.status(req.user ? 400 : 401).json({ 
        success: false,
        errorCode: req.user ? "USER_NOT_ENROLLED" : "AUTHENTICATION_REQUIRED",
        message: errorMessage 
      });
    }

    const courses = await Course.find({ 
      degree: userDegreeId 
    })
    .populate("degree");

    if (!courses || courses.length === 0) {
      return res.status(200).json({
        success: true,
        courses: [],
        errorCode: "NO_COURSES_FOUND",
        message: "No courses found",
      });
    }

    return res.status(200).json({
      success: true,
      courses: courses,
      message: "Courses fetched successfully",
    });

  } catch (error) {
    console.log("Error in getAllCourses(student.controller) controller", error);
    res.status(500).json({ 
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error" });
  }
};

export const getCourse = async (req, res) => {
   try {
    const userDegreeId = req.user?.degree._id;
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ 
        success: false,
        errorCode: "MISSING_OR_INVALID_COURSE_ID",
        message: "Course id is not provided" 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userDegreeId)) {
      const errorMessage = req.user
        ? "User not enrolled in any degree"
        : "Authentication required";
      
      return res.status(req.user ? 400 : 401).json({ 
        success: false,
        errorCode: req.user ? "USER_NOT_ENROLLED" : "AUTHENTICATION_REQUIRED",
        message: errorMessage 
      });
    }

    const course = await Course.findOne({ 
      degree: userDegreeId, 
      _id: courseId 
    })
    .populate("degree");

    if (!course) {
      return res.status(200).json({ 
        success: false,
        errorCode: "COURSE_NOT_FOUND",
        message: "Course not found" 
      });
    }

    return res.status(200).json({
      success: true,
      course: course,
      message: "Course fetched successfully",
    });

  } catch (error) {
    console.log("Error in getCourses(student.controller) controller", error);
    res.status(500).json({ 
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error" });
  }
};

export const selectCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_OR_INVALID_COURSE_ID",
        message: "Something went wrong, cannot select course"
      });
    }

    const courseExist = await User.findOne({ _id: userId, "courses.course": courseId });

    if (courseExist) {
      return res.status(400).json({ 
        success: false,
        errorCode: "COURSE_ALREADY_SELECTED",
        message: "Course already selected" 
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(400).json({ 
        success: false,
        errorCode: "COURSE_NOT_FOUND",
        message: "Course not found" 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { courses: { course: courseId } } },
      { new: true, runValidators: true }
    )
    .select("-password")
    .populate("courses.course");

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        errorCode: "USER_NOT_FOUND",
        message: "User not found, update failed" 
      });
    }

    return res.status(200).json({ 
      success: true,
      user: updatedUser,
      message: "Course selected successfully"
    });
    
  } catch (error) {
    console.error("Error in selectCourse(student.controller) controller", error);
    res.status(500).json({ 
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error" 
    });
  }
};

export const deselectCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ 
        success: false,
        errorCode: "MISSING_OR_INVALID_COURSE_ID",
        message: "Invalid or missing course id" 
      });
    }

    const courseExist = await User.findOne({ _id: userId, "courses.course": courseId });

    if (!courseExist) {
      return res.status(400).json({ 
        success: false,
        errorCode: "COURSE_NOT_SELECTED",
        message: "Course already removed" 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { courses: { course: courseId } } },
      { new: true, runValidators: true }
    )
    .select("-password")
    .populate("courses.course");

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        errorCode: "USER_NOT_FOUND",
        message: "User not found, update failed" 
      });
    }

    return res.status(200).json({ 
      success: true,
      user: updatedUser,
      message: "Course removed successfully"
    });
    
  } catch (error) {
    console.error("Error in selectCourse(student.controller) controller", error);
    res.status(500).json({ 
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error" 
    });
  }
};
