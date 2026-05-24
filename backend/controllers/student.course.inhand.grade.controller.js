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
      .populate("courses.course")
      .populate("degree");

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

    // DEGREE DEBUGGING - TEMP
    /*let gpaResults;
    console.log("=== DEBUGGING DEGREE BUG ===");
    console.log("Checking degreeType: ", updatedUser.degree?.degreeType);

    if (updatedUser.degree?.degreeType === "general") {
      console.log("👉 Executing GENERAL GPA calculation");
      gpaResults = calculateGeneralGPA(updatedUser.courses);
    } else {
      console.log("👉 Executing SPECIAL GPA calculation");
      gpaResults = calculateSpecialGPA(updatedUser.courses);
    }
    console.log("===========================================");*/

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
      .populate("courses.course")
      .populate("degree");

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

// modified updateGrade controller =========================================
export const updateGrade_test = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;
    const grade = req.body.grade;

    // check the courseId is valid object id
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_OR_INVALID_COURSE_ID",
        message: "Something went wrong, cannot update grade",
      });
    }

    // check is the grade is provided
    if (!grade) {
      return res.status(400).json({
        success: false,
        errorCode: "GRADE_NOT_PROVIDED",
        message: "Something went wrong, cannot update grade",
      });
    }

    // fetch the user from the database
    let user = await User.findById(userId)
      .select("-password")
      .populate("courses.course") // populate the course field
      .populate("degree"); // populate the degree field

    // check if the user is found
    if (!user) {
      return res.status(404).json({
        success: false,
        errorCode: "USER_NOT_FOUND",
        message: "User not found, update failed",
      });
    }

    const gpv = getGPV(grade);

    // find the course in the user's courses array
    // and update the grade and gpv
    const courseEnrollment = user.courses.find(
      (item) => item.course._id.toString() === courseId,
    );

    if (courseEnrollment) {
      courseEnrollment.grade = grade;
      courseEnrollment.gpv = gpv;
    } else {
      return res.status(404).json({
        success: false,
        errorCode: "COURSE_NOT_FOUND",
        message: "Course not found, update failed",
      });
    }

    //calculate the current gpa and total credits
    const gpaResults =
      user.degree?.degreeType === "general"
        ? calculateGeneralGPA(user.courses)
        : calculateSpecialGPA(user.courses);

    // Store the gpa and total credits in the user object
    user = user.set({
      gpa: gpaResults.gpa,
      totalCredits: gpaResults.totalCredits,
    });

    const updatedUser = await user.save();

    console.log("Updated user:", updatedUser);

    return res.status(200).json({
      success: true,
      updatedUser,
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

// optimized controller
export const updateGrade_optimized = async (req, res) => {
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
      updatedUser,
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
