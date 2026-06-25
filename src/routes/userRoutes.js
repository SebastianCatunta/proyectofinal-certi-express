import { Router } from "express";
import { registerUser, loginUser, findUsers, findUserById, replaceUserById, deleteUserById, updateRoleById } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticationMiddleware.js";
import { authorize } from "../middlewares/authorizationMiddleware.js";
const userRoutes = Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/", authenticate, authorize("admin"), findUsers);
userRoutes.get("/:id", authenticate, authorize("admin"), findUserById);
userRoutes.put("/:id", authenticate, authorize("admin"), replaceUserById);
userRoutes.delete("/:id", authenticate, authorize("admin"), deleteUserById);
userRoutes.patch("/:id/role", authenticate, authorize("admin"), updateRoleById);

export default userRoutes;