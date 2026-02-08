import mongoose from "mongoose";
import User from "../models/user.model.js";

// Get the GPV value
const getGPV = (grade) => {

  switch (grade) {
    case "A+": return 4.00;
    case "A":  return 4.00;
    case "A-": return 3.70;
    case "B+": return 3.30;
    case "B":  return 3.00;
    case "B-": return 2.70;
    case "C+": return 2.30;
    case "C":  return 2.00;
    case "C-": return 1.70;
    case "D":  return 1.30;
    case "E":  return 1.00;
    default:   return 0.00;

  }
};

export const updateGrade = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;
    const grade = req.body.grade;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid or missing course id" });
    }

    if (!grade) {
      return res.status(400).json({ message: "Something went wrong, grade not provided" });
    }

    const gpv = getGPV(grade);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { 
        "courses.$[course].grade": grade,
        "courses.$[course].gpv": gpv 
        } 
      },
      { 
        new: true, 
        runValidators: true,
        arrayFilters: [{ "course.courseId": courseId  }] }
    )
    .select("-password")
    .populate("courses.courseId");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found, update failed" });
    }

    return res.status(200).json({ success: true, updatedUser: updatedUser });
  } catch (error) {
    console.log("Error in updateGrade(student.course.inhand.grade) controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/*export const updateGrade = async (req, res) => {
  res.json({ message: "updateGrade controller called" });
}*/