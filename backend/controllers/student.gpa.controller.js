import User from "../models/user.model.js";

export const getGPA = async (req, res) => {
  try {
    const userId = req.user._id;

    const userCurrentGPA = await User.findById(
      userId
    )
    .select("gpa totalCredits");

    if (!userCurrentGPA) {
      return res.status(400).json({ 
        success: false,
        errorCode: "USER_NOT_FOUND",
        message: "User not found" 
      });
    }

    return res.status(200).json({ 
      success: true, 
      userGPA: userCurrentGPA,
      message: "GPA fetched successfully."
    });

  } catch (error) {
    console.log("Error in getGPA(student.controller) controller", error);
    return res.status(500).json({ 
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error" 
    });
  }
};