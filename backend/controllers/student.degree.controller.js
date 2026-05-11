import Degree from "../models/degree.model.js";

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
    return res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error",
    });
  }
};
