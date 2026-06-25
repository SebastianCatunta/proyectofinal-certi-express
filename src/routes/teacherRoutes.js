import { Router } from "express";
import { 
    findTeachers, 
    saveTeacher,
    findTeacherById,
    replaceTeacherById,
    findCoursesByTeacher,
    deleteTeacherById
} from "../controllers/teacherController.js";
import { authenticate } from "../middlewares/authenticationMiddleware.js";
import { authorize } from "../middlewares/authorizationMiddleware.js";
import { ownTeacherResource } from "../middlewares/ownershipMiddleware.js";
const teacherRoutes = Router();

teacherRoutes.get("/", authenticate, authorize("admin", "teacher"), findTeachers);
teacherRoutes.post("/", authenticate, authorize("admin"), saveTeacher);
teacherRoutes.get("/:id", authenticate, authorize("admin", "teacher"), ownTeacherResource, findTeacherById);
teacherRoutes.put("/:id", authenticate, authorize("admin", "teacher"), ownTeacherResource, replaceTeacherById);
teacherRoutes.get("/:id/courses", authenticate, authorize("admin", "teacher"), ownTeacherResource, findCoursesByTeacher);
teacherRoutes.delete("/:id", authenticate, authorize("admin"), deleteTeacherById);

export default teacherRoutes;