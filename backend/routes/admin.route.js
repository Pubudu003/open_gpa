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
  getProfile
} from "../controllers/admin.controller.js";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Profile routes
router.get("/profile", protectedRoute, adminRoute, getProfile);
//router.patch("/profile", protectedRoute, adminRoute, updateProfile);

// Course routes
router.get("/courses", protectedRoute, adminRoute, getAllCourses);
router.get("/courses/:id", protectedRoute, adminRoute, getCourse);
router.post("/courses", protectedRoute, adminRoute, addNewCourse);
router.put("/courses/:id", protectedRoute, adminRoute, updateCourse);
router.delete("/courses/:id", protectedRoute, adminRoute, deleteCourse);

// Degree routes
router.get("/degrees", protectedRoute, adminRoute, getAllDegrees);
router.get("/degrees/:id", protectedRoute, adminRoute, getDegree);
router.post("/degrees", protectedRoute, adminRoute, addNewDegree);
router.put("/degrees/:id", protectedRoute, adminRoute, updateDegree);
router.delete("/degrees/:id", protectedRoute, adminRoute, deleteDegree);



export default router;