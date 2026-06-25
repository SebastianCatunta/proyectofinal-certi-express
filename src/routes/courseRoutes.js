import { Router } from "express";
import { 
    findCourses, 
    reAssignTeacherToCourse, 
    enrollStudentInCourse, 
    deleteCourseById,
    saveCourse,
    findCourseById,
    replaceCourseById,
    findStudentsByCourse,
    removeStudentByCourse,
    findAveragesByCourse,
    findEvaluationsByCourseId,
    findCourseReport
} from "../controllers/courseController.js";
import { authenticate } from "../middlewares/authenticationMiddleware.js";
import { authorize } from "../middlewares/authorizationMiddleware.js";
import { ownCourseTeacher } from "../middlewares/ownershipMiddleware.js";
import { studentEnrolledInCourse } from "../middlewares/ownershipMiddleware.js";
const courseRoutes = Router();

courseRoutes.get("/", authenticate, authorize("admin", "teacher", "student"), findCourses);
courseRoutes.patch("/:id/teacher", authenticate, authorize("admin"), reAssignTeacherToCourse);
courseRoutes.post("/:id/students", authenticate, authorize("admin", "teacher"), ownCourseTeacher,enrollStudentInCourse);
courseRoutes.get("/:id/report", authenticate, authorize("admin", "teacher"), ownCourseTeacher, findCourseReport);
courseRoutes.delete("/:id", authenticate, authorize("admin"), deleteCourseById);
courseRoutes.get("/:id/evaluations", authenticate, authorize("admin", "teacher", "student"), studentEnrolledInCourse, findEvaluationsByCourseId);

courseRoutes.post("/", authenticate, authorize("admin"), saveCourse);

courseRoutes.get("/:id/students", authenticate, authorize("admin", "teacher"), ownCourseTeacher, findStudentsByCourse);
courseRoutes.delete("/:id/students/:studentId", authenticate, authorize("admin", "teacher"), ownCourseTeacher, removeStudentByCourse);
courseRoutes.get("/:id/averages", authenticate, authorize("admin", "teacher"), ownCourseTeacher,findAveragesByCourse);

courseRoutes.get("/:id", authenticate, authorize("admin", "teacher", "student"), studentEnrolledInCourse, findCourseById);
courseRoutes.put("/:id", authenticate, authorize("admin", "teacher"), ownCourseTeacher, replaceCourseById);

export default courseRoutes;