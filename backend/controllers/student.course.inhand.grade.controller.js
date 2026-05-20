import mongoose from "mongoose";
import User from "../models/user.model.js";
import {
  getGPV,
  calculateGeneralGPA,
  calculateSpecialGPA,
} from "../utils/gpaCalculator.js";

// Update the grades, gpv, gpa and total credit
export const updateGrade = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;
    const grade = req.body.grade;

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

    const gpv = getGPV(grade);

    // update the grade and gpv
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "courses.$[item].grade": grade,
          "courses.$[item].gpv": gpv,
        },
      },
      {
        new: true,
        runValidators: true,
        arrayFilters: [{ "item.course": courseId }],
      },
    )
      .select("-password")
      .populate("courses.course");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        errorCode: "USER_NOT_FOUND",
        message: "User not found, update failed",
      });
    }

    // calculate the current gpa and total credits
    const gpaResults =
      updatedUser.degree.degreeType === "General"
        ? calculateGeneralGPA(updatedUser.courses)
        : calculateSpecialGPA(updatedUser.courses);

    // Store the gpa and total credits in the user object
    const finalUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          gpa: gpaResults.gpaFormatted,
          totalCredits: gpaResults.totalCredits,
        },
      },
      { new: true, runValidators: true },
    )
      .select("-password")
      .populate("courses.course");

    if (!finalUser) {
      return res.status(404).json({
        success: false,
        errorCode: "USER_NOT_FOUND",
        message: "User gpa and total credit update failed",
      });
    }

    return res.status(200).json({
      success: true,
      updatedUser: finalUser,
      message: "Grade updated successfully.",
    });
  } catch (error) {
    console.log(
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

/*export const updateGrade = async (req, res) => {
  res.json({ message: "updateGrade controller called" });
}*/
