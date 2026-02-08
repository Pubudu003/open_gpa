import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("-password")
      .populate("courses.courseId");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json({ success: true, userProfile: user });

   //const { userName, email, degreeCode, degreeName, courses, gpa, totalCredits, role } = req.user;

   //return res.status(200).json({ userName, email, degreeCode, degreeName, courses, gpa, totalCredits, role });
  } catch (error) {
    console.log("Error in getProfile(student.profile) controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { degreeCode, degreeName } = req.body;

    if (!degreeCode || !degreeName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { degreeCode, degreeName },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found, update failed" });
    }

    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.log("Error in updateProfile(student.profile) controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};