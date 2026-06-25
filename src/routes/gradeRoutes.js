import { Router } from "express";
import {
    findGradeById,
    saveGrade,
    findGrades,
    replaceGradeById,
    updateObservationByGradeId
} from "../controllers/gradeController.js";
import { authenticate } from "../middlewares/authenticationMiddleware.js";
import { authorize } from "../middlewares/authorizationMiddleware.js";
import { ownGradeResource } from "../middlewares/ownershipMiddleware.js";
import { ownEvaluationCourseTeacher } from "../middlewares/ownershipMiddleware.js";
const gradeRoutes = Router();

gradeRoutes.get("/:id", authenticate, authorize("student"), ownGradeResource, findGradeById);

gradeRoutes.post("/", authenticate, authorize("teacher"), ownEvaluationCourseTeacher, saveGrade);
gradeRoutes.get("/", authenticate, authorize("admin"), findGrades);
gradeRoutes.put("/:id", authenticate, authorize("teacher"), ownEvaluationCourseTeacher, replaceGradeById);
gradeRoutes.patch("/:id/observation", authenticate, authorize("teacher"), ownEvaluationCourseTeacher, updateObservationByGradeId);

export default gradeRoutes;