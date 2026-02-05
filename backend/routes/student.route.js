import express from "express";

import { protectedRoute } from "../middleware/auth.middleware.js";
import { getAllCourses, getCourse, selectCourse } from "../controllers/student.course.controller.js";
import { getProfile, updateProfile } from "../controllers/student.profile.controller.js";

const router = express.Router();

// Profile routes
router.get("/profile", protectedRoute, getProfile);
router.patch("/profile", protectedRoute, updateProfile);

// Course routes
router.get("/courses", protectedRoute, getAllCourses);
router.get("/courses/:id", protectedRoute, getCourse);
router.patch("/courses/:id/select", protectedRoute, selectCourse);

export default router;