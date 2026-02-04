import Course from "../models/course.model.js";

export const getAllCourses = async (req, res) => {
  try {
    const degreeCode = req.user?.degreeCode;

    if (!degreeCode) {
      const errorMessage = req.user
        ? "User not enrolled in any degree"
        : "Authentication required";
      
      return res.status(req.user ? 400 : 4001).json({ message: errorMessage });
    }

    const courses = await Course.find({ degreeCode });

    if (!courses || courses.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(courses);
  } catch (error) {
    console.log("Error in getAllCourses(student.controller) controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCourse = async (req, res) => {
  res.json({ message: "Student - getCourse called"});
};

export const selectCourse = async (req, res) => {
  res.json({ message: "Student - selectCourse called"});
};