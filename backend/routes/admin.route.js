import express from "express";

import { getAllCourses, getCourse, addNewCourse, updateCourse, deleteCourse } from "../controllers/admin.controller.js";
import { adminRoute, courseRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/courses", courseRoute, adminRoute, getAllCourses);
router.get("/courses/:id", courseRoute, adminRoute, getCourse);
router.post("/courses", courseRoute, adminRoute, addNewCourse);
router.put("/courses/:id", courseRoute, adminRoute, updateCourse);
router.delete("/courses/:id", courseRoute, adminRoute, deleteCourse);

export default router;