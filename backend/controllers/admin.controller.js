import Course from "../models/course.model.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    console.log("Error in getAllCourses controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCourse = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Course id is not provided" });
  }

  try {
    const course = await Course.findOne({ _id : id });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);    
  } catch (error) {
    console.log("Error in getCourse controller", error);
  }
};

export const addNewCourse = async (req, res) => {
  const { 
    courseCode, 
    courseName, 
    courseCredit, 
    courseDescription, 
    faculty, 
    department,
    degreeCode,
    degreeName,
    degreeType,
    level,
    semester,   
  } = req.body;
  
  try {
    if (!courseCode || !courseName || !courseCredit || !faculty || !department || !degreeCode || !degreeName || !degreeType || !level || !semester) {
      return res.status(400).json({ message: "Some required fields are missing!" });
    }

    const courseExists = await Course.findOne({ courseCode });

    if (courseExists) {
      return res.status(400).json({ message: `Course already exists with id: ${courseCode}` });
    }

    const newCourse = await Course.create({
      courseCode, courseName, courseCredit, courseDescription, faculty, department, degreeCode, degreeName, degreeType, level, semester
    })

    res.status(201).json(newCourse);
  } catch (error) {
    console.log("Error in addNewCourse controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { 
    courseCode, 
    courseName, 
    courseCredit, 
    courseDescription, 
    faculty, 
    department,
    degreeCode,
    degreeName,
    degreeType,
    level,
    semester,   
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Course id is not provided" });
  }

  try {
    const updatedCourse = await Course.findOneAndUpdate(
      { _id : id }, 
      {
        courseCode, 
        courseName, 
        courseCredit, 
        courseDescription, 
        faculty, 
        department,
        degreeCode,
        degreeName,
        degreeType,
        level,
        semester,   
      },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(updatedCourse);
  } catch (error) {
    console.log("Error in updateCourse controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Course Id is not provided"});
  }

  try {
    const course = await Course.findOneAndDelete({ _id : id });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ course, message: "Course deleted successfully" });
  } catch (error) {
    console.log("Error in deleteCourse controller ", error);
    res.status(500).json({ message: "Internal server error" })
  }
};