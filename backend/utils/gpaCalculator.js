// Get the GPV value
export const getGPV = (grade) => {
  switch (grade) {
    case "A+":
      return 4.0;
    case "A":
      return 4.0;
    case "A-":
      return 3.7;
    case "B+":
      return 3.3;
    case "B":
      return 3.0;
    case "B-":
      return 2.7;
    case "C+":
      return 2.3;
    case "C":
      return 2.0;
    case "C-":
      return 1.7;
    case "D":
      return 1.3;
    case "E":
      return 1.0;
    default:
      return 0.0;
  }
};

// Calculate current gpa and total credits in General degree
export const calculateGeneralGPA = (courses) => {
  if (courses.length === 0) {
    return { gpa: 0.0, totalCredits: 0 };
  }

  let totalCredits = 0;
  let totalCreditWeightedGPV = 0.0;

  for (const course of courses) {
    const courseCredit = course.course.courseCredit;
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

  return { gpaFormatted, totalCredits };
};

// Calculate current gpa and total credits in Special degree
export const calculateSpecialGPA = (courses) => {
  if (courses.length === 0) {
    return { gpa: 0.0, totalCredits: 0 };
  }

  let totalCredits = 0;
  let totalCreditWeightedGPV = 0.0;
  let cumulativeWeightedCredit = 0.0;

  for (const course of courses) {
    const courseCredit = course.course.courseCredit;
    const courseGPV = course.gpv;

    const creditWeightedGPV =
      course.course.level === "3" || course.course.level === "4"
        ? courseCredit * courseGPV * 2
        : courseCredit * courseGPV * 3;
    const weightedCourseCredit =
      courseCredit *
      (course.course.level === "3" || course.course.level === "4" ? 2 : 3);

    if (courseGPV === 0) {
      continue;
    }

    totalCredits += courseCredit;
    cumulativeWeightedCredit += weightedCourseCredit;
    totalCreditWeightedGPV += creditWeightedGPV;
  }

  const gpa = totalCreditWeightedGPV / cumulativeWeightedCredit;
  const gpaFormatted = parseFloat(gpa.toFixed(2));

  return { gpaFormatted, totalCredits };
};
