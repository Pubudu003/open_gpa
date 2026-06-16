import mongoose from "mongoose";
import User from "../models/user.model.js";
import {
  getGPV,
  calculateGeneralGPA,
  calculateSpecialGPA,
} from "../utils/gpaCalculator.js";

// optimized controller
export const updateGrade = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;
    const grade = req.body.grade;

    // Validations ============================================
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_OR_INVALID_COURSE_ID",
        message: "Something went wrong, cannot update grade",
      });
    }

    if (!grade) {
      return res.status(400).json({
        success: false,
        errorCode: "GRADE_NOT_PROVIDED",
        message: "Something went wrong, cannot update grade",
      });
    }

    // Lightweight user read ==================================
    const user = await User.findById(userId)
      .select("courses degree")
      .populate("courses.course", "courseCredit")
      .populate("degree", "degreeType")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        errorCode: "USER_NOT_FOUND",
        message: "User not found, update failed",
      });
    }

    // Calculation in memory
    const gpv = getGPV(grade);

    const courseEnrollment = user.courses.find(
      (item) => item.course._id.toString() === courseId,
    );

    if (!courseEnrollment) {
      return res.status(404).json({
        success: false,
        errorCode: "COURSE_NOT_FOUND",
        message: "Course not found in user's enrollment",
      });
    }

    courseEnrollment.grade = grade;
    courseEnrollment.gpv = gpv;

    const gpaResults =
      user.degree?.degreeType === "general"
        ? calculateGeneralGPA(user.courses)
        : calculateSpecialGPA(user.courses);

    // One single write ====================================
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "courses.$[item].grade": grade,
          "courses.$[item].gpv": gpv,
          gpa: gpaResults.gpa,
          totalCredits: gpaResults.totalCredits,
        },
      },
      {
        new: true,
        runValidators: true,
        arrayFilters: [{ "item.course": courseId }],
      },
    )
      .select("-password")
      .populate("courses.course")
      .populate("degree");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        errorCode: "USER_NOT_FOUND",
        message: "User not found, update failed",
      });
    }

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Grade updated successfully.",
    });
  } catch (error) {
    console.error(
      "Error in updateGrade(student.course.inhand.grade) controller",
      error,
    );

    return res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error",
    });
  }
};
