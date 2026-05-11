import mongoose from "mongoose";
import Course from "../models/course.model.js";
import Degree from "../models/degree.model.js";
import User from "../models/user.model.js";

// Profile controllers
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        errorCode: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      userProfile: user,
      message: "Profile fetched successfully.",
    });
  } catch (error) {
    console.log("Error in getProfile controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/*export const updateProfile = async (req, res) => {
  try {
    return res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully." 
    });
  } catch (error) {
    console.log("Error in updateProfile controller", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}*/

// Course controllers
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate("degree");

    if (courses.length === 0) {
      return res.status(200).json({
        success: true,
        degrees: [],
        message: "No courses have been created yet.",
      });
    }

    return res.status(200).json({
      success: true,
      courses: courses,
      message: "Courses fetched successfully.",
    });
  } catch (error) {
    console.log("Error in getAllCourses controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_OR_INVALID_COURSE_ID",
        message: "Unable to fetch course details right now",
      });
    }

    const course = await Course.findById(courseId).populate("degree");

    if (!course) {
      return res.status(404).json({
        success: false,
        errorCode: "COURSE_NOT_FOUND",
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course: course,
      message: "Course fetched successfully",
    });
  } catch (error) {
    console.log("Error in getCourse controller", error);
    return res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error",
    });
  }
};

export const addNewCourse = async (req, res) => {
  try {
    const {
      courseCode,
      courseName,
      courseCredit,
      courseDescription,
      level,
      semester,
      degree,
    } = req.body;

    if (
      !courseCode ||
      !courseName ||
      !courseCredit ||
      !courseDescription ||
      !level ||
      !semester ||
      !degree
    ) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_SOME_FIELDS",
        message: "Some required fields are missing!",
      });
    }

    const courseExists = await Course.findOne({ courseCode });

    if (courseExists) {
      return res.status(400).json({
        success: false,
        errorCode: "COURSE_EXISTS",
        message: `Course already exists with course code: ${courseCode}`,
      });
    }

    const newCourse = await Course.create({
      courseCode,
      courseName,
      courseCredit,
      courseDescription,
      level,
      semester,
      degree,
    });

    return res.status(201).json({
      success: true,
      course: newCourse,
      message: "New course created successfully",
    });
  } catch (error) {
    console.log("Error in addNewCourse controller", error);
    res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error",
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_OR_INVALID_DEGREE_ID",
        message: "Unable to update degree right now.",
      });
    }

    const {
      courseCode,
      courseName,
      courseCredit,
      courseDescription,
      level,
      semester,
      degree,
    } = req.body;

    if (
      !courseCode ||
      !courseName ||
      !courseCredit ||
      !courseDescription ||
      !level ||
      !semester ||
      !degree
    ) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_SOME_FIELDS",
        message: "Some required fields are missing!",
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        courseCode,
        courseName,
        courseCredit,
        courseDescription,
        level,
        semester,
        degree,
      },
      { new: true, runValidators: true },
    ).populate("degree");

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        errorCode: "COURSE_NOT_EXISTS",
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      updatedCourse: updatedCourse,
      message: "Course has been updated successfully.",
    });
  } catch (error) {
    console.log("Error in updateCourse controller", error);
    return res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error",
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_OR_INVALID_COURSE_ID",
        message: "Unable to delete course right now.",
      });
    }

    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        errorCode: "COURSE_NOT_EXISTS",
        message: "Course not exists",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteCourse controller ", error);
    return res.status(500).json({
      success: false,
      errorCode: "CONTROLLER ERROR",
      message: "Internal server error",
    });
  }
};

// Degree controllers

export const getAllDegrees = async (req, res) => {
  try {
    const degrees = await Degree.find({});

    if (degrees.length === 0) {
      return res.status(200).json({
        success: true,
        degrees: [],
        message: "No degrees have been created yet.",
      });
    }

    return res.status(200).json({
      success: true,
      degrees: degrees,
      message: "Degrees fetched successfully.",
    });
  } catch (error) {
    console.log("Error in getAllDegrees controller", error);
    return res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error",
    });
  }
};

export const getDegree = async (req, res) => {
  try {
    const degreeId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(degreeId)) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_OR_INVALID_DEGREE_ID",
        message: "Unable to fetch degree details right now.",
      });
    }

    const degree = await Degree.findById(degreeId);

    if (!degree) {
      return res.status(404).json({
        success: false,
        errorCode: "DEGREE_NOT_FOUND",
        message: "Degree not found.",
      });
    }

    return res.status(200).json({
      success: true,
      degree: degree,
      message: "Degree fetched successfully.",
    });
  } catch (error) {
    console.log("Error in getDegree controller", error);
    return res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal Server Error.",
    });
  }
};

export const addNewDegree = async (req, res) => {
  try {
    const { degreeCode, degreeName, degreeType, faculty, department } =
      req.body;

    if (!degreeCode || !degreeName || !degreeType || !faculty || !department) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_SOME_FIELDS",
        message: "Some required fields are missing!",
      });
    }

    const degreeExists = await Degree.findOne({
      degreeCode: degreeCode.trim().toLowerCase().replace(/-/g, "_"),
    });

    if (degreeExists) {
      return res.status(400).json({
        success: false,
        errorCode: "DEGREE_EXISTS",
        message: `Degree already exists with id: ${degreeCode}`,
      });
    }

    const newDegree = await Degree.create({
      degreeCode: degreeCode.trim().toLowerCase().replace(/-/g, "_"),
      degreeName,
      degreeType,
      faculty,
      department,
    });

    return res.status(200).json({
      success: true,
      newDegree: newDegree,
      message: "New degree created successfully.",
    });
  } catch (error) {
    console.log("Error in addNewDegree controller", error);
    return res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error",
    });
  }
};

export const updateDegree = async (req, res) => {
  try {
    const degreeId = req.params.id;
    const { degreeCode, degreeName, degreeType, faculty, department } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(degreeId)) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_OR_INVALID_DEGREE_ID",
        message: "Unable to update degree right now.",
      });
    }

    if (!degreeCode || !degreeName || !degreeType || !faculty || !department) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_SOME_FIELDS",
        message: "Some fields are missing!",
      });
    }

    const updatedDegree = await Degree.findByIdAndUpdate(
      degreeId,
      {
        degreeCode,
        degreeName,
        degreeType,
        faculty,
        department,
      },
      { new: true, runValidators: true },
    );

    if (!updatedDegree) {
      return res.status(404).json({
        success: false,
        errorCode: "DEGREE_NOT_EXIST",
        message:
          "Something went wrong, the degree you trying to update is not exists.",
      });
    }

    return res.status(200).json({
      success: true,
      updatedDegree: updatedDegree,
      message: "Degree has been updated successfully",
    });
  } catch (error) {
    console.log("Error in updateDegree controller: ", error);
    return res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal Server Error",
    });
  }
};
export const deleteDegree = async (req, res) => {
  try {
    const degreeId = req.params.id;

    if (!degreeId) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_OR_INVALID_DEGREE_ID",
        message: "Unable to delete degree right now.",
      });
    }

    const degree = await Degree.findByIdAndDelete(degreeId);

    if (!degree) {
      return res.status(404).json({
        success: false,
        errorCode: "DEGREE_NOT_EXISTS",
        message: "degree not exists",
      });
    }

    return res.status(200).json({
      success: true,
      message: "degree deleted successfully.",
    });
  } catch (error) {
    console.log("Error in deleteDegree controller.", error);
    return res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal Server Error.",
    });
  }
};
