import express from "express";

import { protectedRoute } from "../middleware/auth.middleware.js";
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
import {
  updateGrade,
  updateGrade_test,
  updateGrade_optimized,
} from "../controllers/student.course.inhand.grade.controller.js";
import { getGPA } from "../controllers/student.gpa.controller.js";
import { getAllDegrees } from "../controllers/student.degree.controller.js";

const router = express.Router();

// Profile routes
router.get("/profile", protectedRoute, getProfile);
router.patch("/profile", protectedRoute, updateProfile);

// Degree routes
router.get("/degrees", protectedRoute, getAllDegrees);

// Course routes
router.get("/courses", protectedRoute, getAllCourses);
router.get("/courses/:id", protectedRoute, getCourse);
router.patch("/courses/:id/select", protectedRoute, selectCourse);
router.delete("/courses/:id/deselect", protectedRoute, deselectCourse);

// Selected course in hand routes
router.get("/courses-in-hand", protectedRoute, getAllCoursesInHand);
router.get("/courses-in-hand/:id", protectedRoute, getCourseInHand);

// Grade routes
router.patch(
  "/courses-in-hand/:id/grade",
  protectedRoute,
  updateGrade_optimized,
);
//router.get("/courses-in-hand/grade", protectedRoute, getGrade);

// GPA routes
router.get("/gpa", protectedRoute, getGPA);

export default router;
