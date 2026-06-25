import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import * as OpenApiValidator from "express-openapi-validator";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import evaluationRoutes from "./routes/evaluationRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";

import { requestLogger } from "./middlewares/loggingMiddleware.js";
import { errorHandler, responseFormatter } from "./middlewares/formatingMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

const openApiPath = path.join(__dirname, "../docs/openapi.yaml");
const openApiDocument = YAML.load(openApiPath);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(OpenApiValidator.middleware({
    apiSpec: openApiPath,
    validateRequests: true,
    validateResponses: false,
}));

app.use(requestLogger);
app.use(responseFormatter);

app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/evaluations", evaluationRoutes);

app.use(errorHandler);

export default app;