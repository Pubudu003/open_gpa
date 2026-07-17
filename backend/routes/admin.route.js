import express from "express";

import {
  getAllCourses,
  getCourse,
  addNewCourse,
  updateCourse,
  deleteCourse,
  getAllDegrees,
  getDegree,
  addNewDegree,
  updateDegree,
  deleteDegree,
  getProfile,
} from "../controllers/admin.controller.js";
import {
  adminRoute,
  protectedRoute,
  verifiedRoute,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Profile routes
router.get("/profile", protectedRoute, adminRoute, verifiedRoute, getProfile);
//router.patch("/profile", protectedRoute, adminRoute, verifiedRoute, updateProfile);

// Course routes
router.get(
  "/courses",
  protectedRoute,
  adminRoute,
  verifiedRoute,
  getAllCourses,
);
router.get(
  "/courses/:id",
  protectedRoute,
  adminRoute,
  verifiedRoute,
  getCourse,
);
router.post(
  "/courses",
  protectedRoute,
  adminRoute,
  verifiedRoute,
  addNewCourse,
);
router.put(
  "/courses/:id",
  protectedRoute,
  adminRoute,
  verifiedRoute,
  updateCourse,
);
router.delete(
  "/courses/:id",
  protectedRoute,
  adminRoute,
  verifiedRoute,
  deleteCourse,
);

// Degree routes
router.get(
  "/degrees",
  protectedRoute,
  adminRoute,
  verifiedRoute,
  getAllDegrees,
);
router.get(
  "/degrees/:id",
  protectedRoute,
  adminRoute,
  verifiedRoute,
  getDegree,
);
router.post(
  "/degrees",
  protectedRoute,
  adminRoute,
  verifiedRoute,
  addNewDegree,
);
router.put(
  "/degrees/:id",
  protectedRoute,
  adminRoute,
  verifiedRoute,
  updateDegree,
);
router.delete(
  "/degrees/:id",
  protectedRoute,
  adminRoute,
  verifiedRoute,
  deleteDegree,
);

export default router;
