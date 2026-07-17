import express from "express";

import {
  protectedRoute,
  verifiedRoute,
} from "../middleware/auth.middleware.js";
import {
  deselectCourse,
  getAllCourses,
  getCourse,
  selectCourse,
} from "../controllers/student.course.controller.js";
import {
  getProfile,
  updateProfile,
} from "../controllers/student.profile.controller.js";
import {
  getAllCoursesInHand,
  getCourseInHand,
} from "../controllers/student.course.inhand.controller.js";
import { updateGrade } from "../controllers/student.course.inhand.grade.controller.js";
import { getGPA } from "../controllers/student.gpa.controller.js";
import { getAllDegrees } from "../controllers/student.degree.controller.js";
import { sendFeedback } from "../controllers/student.feedback.controller.js";

const router = express.Router();

// Profile routes
router.get("/profile", protectedRoute, verifiedRoute, getProfile);
router.patch("/profile", protectedRoute, verifiedRoute, updateProfile);

// Degree routes
router.get("/degrees", protectedRoute, verifiedRoute, getAllDegrees);

// Course routes
router.get("/courses", protectedRoute, verifiedRoute, getAllCourses);
router.get("/courses/:id", protectedRoute, verifiedRoute, getCourse);
router.patch(
  "/courses/:id/select",
  protectedRoute,
  verifiedRoute,
  selectCourse,
);
router.delete(
  "/courses/:id/deselect",
  protectedRoute,
  verifiedRoute,
  deselectCourse,
);

// Selected course in hand routes
router.get(
  "/courses-in-hand",
  protectedRoute,
  verifiedRoute,
  getAllCoursesInHand,
);
router.get(
  "/courses-in-hand/:id",
  protectedRoute,
  verifiedRoute,
  getCourseInHand,
);

// Grade routes
router.patch(
  "/courses-in-hand/:id/grade",
  protectedRoute,
  verifiedRoute,
  updateGrade,
);
//router.get("/courses-in-hand/grade", protectedRoute, verifiedRoute, getGrade);

// GPA routes
router.get("/gpa", protectedRoute, verifiedRoute, getGPA);

// Feedback routes
router.post("/feedback", protectedRoute, verifiedRoute, sendFeedback);

export default router;
