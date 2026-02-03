import express from "express";

import { getAllCourses, getCourse, addNewCourse, updateCourse, deleteCourse } from "../controllers/admin.controller.js";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/courses", protectedRoute, adminRoute, getAllCourses);
router.get("/courses/:id", protectedRoute, adminRoute, getCourse);
router.post("/courses", protectedRoute, adminRoute, addNewCourse);
router.put("/courses/:id", protectedRoute, adminRoute, updateCourse);
router.delete("/courses/:id", protectedRoute, adminRoute, deleteCourse);

export default router;