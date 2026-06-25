import { Router } from "express";
import { 
    findStudents, 
    saveStudent, 
    findStudentsById,
    replaceStudentById,
    deleteStudentById,
    findCoursesByStudent,
    findGradesByStudent,
    findAverageByStudentAndCourse,
    findGradesByStudentAndCourse,
    findEvaluationsByStudentAndCourse
} from "../controllers/studentController.js";

import { authenticate } from "../middlewares/authenticationMiddleware.js";
import { authorize } from "../middlewares/authorizationMiddleware.js";
import { ownStudentResource } from "../middlewares/ownershipMiddleware.js";
const studentRoutes = Router();

studentRoutes.get("/", authenticate, authorize("admin", "teacher"), findStudents);
studentRoutes.post("/", authenticate, authorize("admin"), saveStudent);

studentRoutes.get("/:id/courses/:courseId/average", authenticate,authorize("admin", "student"), ownStudentResource, findAverageByStudentAndCourse);
studentRoutes.get("/:id/courses/:courseId/grades", authenticate, authorize("admin", "student"), ownStudentResource, findGradesByStudentAndCourse);
studentRoutes.get("/:id/courses/:courseId/evaluations", authenticate, authorize("admin", "student"), ownStudentResource, findEvaluationsByStudentAndCourse);
studentRoutes.get("/:id/courses", authenticate, authorize("admin", "student"), ownStudentResource, findCoursesByStudent);
studentRoutes.get("/:id/grades", authenticate, authorize("admin", "student"), ownStudentResource, findGradesByStudent);

studentRoutes.get("/:id", authenticate, authorize("admin", "teacher", "student"), ownStudentResource, findStudentsById);
studentRoutes.put("/:id", authenticate, authorize("admin", "student"), ownStudentResource, replaceStudentById);
studentRoutes.delete("/:id", authenticate, authorize("admin"), deleteStudentById);

export default studentRoutes;
