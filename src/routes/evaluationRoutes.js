import { Router } from "express";
import { 
    replaceEvaluation,
    findEvaluations,
    saveEvaluation,
    findEvaluationById,
    deleteEvaluationById
 } from "../controllers/evaluationController.js";
import { authenticate } from "../middlewares/authenticationMiddleware.js";
import { authorize } from "../middlewares/authorizationMiddleware.js";
import { ownCourseTeacher, ownEvaluationTeacher, ownCourseFromBody} from "../middlewares/ownershipMiddleware.js";
const evaluationRoutes = Router();

evaluationRoutes.put("/:id", authenticate, authorize("teacher"), ownEvaluationTeacher, replaceEvaluation);

evaluationRoutes.get("/", authenticate, authorize("admin", "teacher"), findEvaluations);
evaluationRoutes.post("/", authenticate, authorize("teacher"), ownCourseFromBody, saveEvaluation);
evaluationRoutes.get("/:id", authenticate, authorize("admin", "teacher", "student"), findEvaluationById);
evaluationRoutes.delete("/:id", authenticate, authorize("admin", "teacher"), ownEvaluationTeacher, deleteEvaluationById);

export default evaluationRoutes;