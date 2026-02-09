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

// Calculate current gpa and total credits in General degree
const calculateGeneralGPA = (courses) => {

  if (courses.length === 0) {
    return {gpa: 0.00, totalCredits: 0};
  } 

  let totalCredits = 0;
  let totalCreditWeightedGPV = 0.00;

  for (const course of courses) {
    const courseCredit = course.courseId.courseCredit;
    const courseGPV = course.gpv;
    const creditWeightedGPV = courseCredit * courseGPV;

    if (courseGPV === 0) {
      continue;
    }

    totalCredits += courseCredit;
    totalCreditWeightedGPV += creditWeightedGPV;
  }

  const gpa = totalCreditWeightedGPV / totalCredits;
  const gpaFormatted = parseFloat(gpa.toFixed(2));
  
  return {gpaFormatted, totalCredits};
};

// Calculate current gpa and total credits in Special degree
const calculateSpecialGPA = (courses) => {

  if (courses.length === 0) {
    return {gpa: 0.00, totalCredits: 0};
  } 

  let totalCredits = 0;
  let totalCreditWeightedGPV = 0.00;
  let cumulativeWeightedCredit = 0.00;


  for (const course of courses) {
    const courseCredit = course.courseId.courseCredit;
    const courseGPV = course.gpv;

    const creditWeightedGPV = course.courseId.level === "3" || course.courseId.level === "4" ? 
      courseCredit * courseGPV * 2 :
      courseCredit * courseGPV * 3;
    const weightedCourseCredit = courseCredit * (course.courseId.level === "3" || course.courseId.level === "4" ? 2 : 3);


    if (courseGPV === 0) {
      continue;
    }

    totalCredits += courseCredit;
    cumulativeWeightedCredit += weightedCourseCredit;
    totalCreditWeightedGPV += creditWeightedGPV;
  }

  const gpa = totalCreditWeightedGPV / cumulativeWeightedCredit;
  const gpaFormatted = parseFloat(gpa.toFixed(2));
  
  return {gpaFormatted, totalCredits};
};


// Update the grades, gpv, gpa and total credit
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

    // update the grade and gpv
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

    // calculate the current gpa and total credits
    const gpaResults = updatedUser.degreeCode === "bsc_it" ? 
      calculateGeneralGPA(updatedUser.courses) :
      calculateSpecialGPA(updatedUser.courses);
    
    // Store the gpa and total credits in the user object
    const finalUser = await User.findByIdAndUpdate(
      userId,
      { $set: {gpa: gpaResults.gpaFormatted, totalCredits: gpaResults.totalCredits} },
      { new: true, runValidators: true }
    )
    .select("-password")
    .populate("courses.courseId");

    if (!finalUser) {
      return res.status(404).json({ message: "User gpa and total credit update failed" });
    }
    
    return res.status(200).json({ success: true, updatedUser: finalUser });
  } catch (error) {
    console.log("Error in updateGrade(student.course.inhand.grade) controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/*export const updateGrade = async (req, res) => {
  res.json({ message: "updateGrade controller called" });
}*/