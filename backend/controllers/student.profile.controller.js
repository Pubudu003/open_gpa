import mongoose from "mongoose";
import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("-password")
      .populate("degree courses.course");

    if (!user) {
      return res.status(400).json({ 
        success: false,
        errorCode: "USER_NOT_FOUND",
        message: "User not found" 
      });
    }

    return res.status(200).json({ 
      success: true, 
      userProfile: user,
      message: "User profile fetched successfully."
     });

   //const { userName, email, degreeCode, degreeName, courses, gpa, totalCredits, role } = req.user;

   //return res.status(200).json({ userName, email, degreeCode, degreeName, courses, gpa, totalCredits, role });
  } catch (error) {
    console.log("Error in getProfile(student.profile) controller", error);
    res.status(500).json({ 
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error" 
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { degreeId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(degreeId)) {
      return res.status(400).json({ 
        success: false,
        errorCode: "MISSING_DEGREE_ID",
        message: "Something went wrong, cannot update profile" 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { degree: degreeId } },
      { new: true, runValidators: true }
    )
    .select("-password")
    .populate("degree courses.course");

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        errorCode: "USER_NOT_FOUND",
        message: "User not found, update failed" 
      });
    }

    return res.status(200).json({ 
      success: true,
      updatedUser: updatedUser,
      message: "Profile updated successfully" 
    });

  } catch (error) {
    console.log("Error in updateProfile(student.profile) controller", error);
    res.status(500).json({ 
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error" 
    });
  }
};