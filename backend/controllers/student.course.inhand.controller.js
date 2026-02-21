import mongoose from "mongoose";
import User from "../models/user.model.js";

export const getAllCoursesInHand = async (req, res) => {
  try {
    const userId = req.user._id;

    const courses = await User.findById(userId)
      .select("courses -_id")
      .populate("courses.course");

    if (courses.length === 0) {
      return res.status(200).json({
        success: true,
        courses: [],
        message: "You have not selected any course"
      });
    }

    return res.status(200).json({ 
      success: true, 
      courses: courses,
      message: "Courses fetched successfully."
    });

  } catch (error) {
    console.log("Error in getAllCoursesInHand(student.controller) controller", error);
    return res.status(500).json({ 
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error" 
    });
  }
}

export const getCourseInHand = async (req, res) => {
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

    const course = await User.findById(userId)
      .select({ 
        courses: {  $elemMatch: { course: courseId } } 
      })
      .populate("courses.course");

    if (course.courses.length === 0) {
      return res.status(200).json({ 
        success: false,
        errorCode: "COURSE_NOT_FOUND",
        message: "Course not found" 
      });
    }

    return res.status(200).json({ 
      success: true, 
      course: course, 
      message: "Course fetched successfully."
    });
  } catch (error) {
    console.log("Error in getCourseInHand(student.controller) controller", error);
    return res.status(500).json({  
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error" 
    });
  }
}