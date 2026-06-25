import request from "supertest";
import app from "../src/app.js";

function getId(response) {
    return response.body.data.id || response.body.data._id;
}

function auth(token) {
    return `Bearer ${token}`;
}

describe("Academic Evaluation API - main endpoints", () => {
    test("should complete the main academic flow successfully", async () => {
        const adminRegister = await request(app)
            .post("/api/users/register")
            .send({
                name: "Admin Principal",
                email: "admin@example.com",
                password: "Password123",
                role: "admin",
                status: "active"
            });

        expect(adminRegister.statusCode).toBe(200);
        expect(adminRegister.body.success).toBe(true);

        const adminLogin = await request(app)
            .post("/api/users/login")
            .send({
                email: "admin@example.com",
                password: "Password123"
            });

        expect(adminLogin.statusCode).toBe(200);
        expect(adminLogin.body.data.token).toBeDefined();

        const adminToken = adminLogin.body.data.token;

        const teacherUserResponse = await request(app)
            .post("/api/users/register")
            .send({
                name: "Carlos Mendoza",
                email: "carlos.teacher@example.com",
                password: "Password123",
                role: "teacher",
                status: "active"
            });

        expect(teacherUserResponse.statusCode).toBe(200);
        const teacherUserId = getId(teacherUserResponse);

        const studentUserResponse = await request(app)
            .post("/api/users/register")
            .send({
                name: "Sebastian Rojas",
                email: "sebastian.student@example.com",
                password: "Password123",
                role: "student",
                status: "active"
            });

        expect(studentUserResponse.statusCode).toBe(200);
        const studentUserId = getId(studentUserResponse);

        const usersList = await request(app)
            .get("/api/users")
            .set("Authorization", auth(adminToken));

        expect(usersList.statusCode).toBe(200);
        expect(Array.isArray(usersList.body.data)).toBe(true);

        const teacherResponse = await request(app)
            .post("/api/teachers")
            .set("Authorization", auth(adminToken))
            .send({
                userId: teacherUserId,
                teacherCode: 1001,
                subjectsCanTeach: ["Backend", "Express.js", "MongoDB"]
            });

        expect(teacherResponse.statusCode).toBe(200);
        const teacherId = getId(teacherResponse);

        const studentResponse = await request(app)
            .post("/api/students")
            .set("Authorization", auth(adminToken))
            .send({
                userId: studentUserId,
                studentCode: 2026001,
                career: "Ingeniería de Sistemas",
                semester: 5
            });

        expect(studentResponse.statusCode).toBe(200);
        const studentId = getId(studentResponse);

        const courseResponse = await request(app)
            .post("/api/courses")
            .set("Authorization", auth(adminToken))
            .send({
                name: "Certificación Backend con Express.js",
                description: "Curso orientado al desarrollo de APIs REST.",
                code: 5001,
                teacherId,
                studentIds: [],
                status: "active"
            });

        expect(courseResponse.statusCode).toBe(200);
        const courseId = getId(courseResponse);

        const enrollResponse = await request(app)
            .post(`/api/courses/${courseId}/students`)
            .set("Authorization", auth(adminToken))
            .send({
                studentId
            });

        expect(enrollResponse.statusCode).toBe(200);
        expect(enrollResponse.body.data.studentIds).toContain(studentId);

        const evaluationResponse = await request(app)
            .post("/api/evaluations")
            .set("Authorization", auth(adminToken))
            .send({
                courseId,
                title: "Proyecto Final Backend",
                description: "Evaluación final del sistema académico.",
                type: "project",
                date: "2026-06-26",
                status: "active"
            });

        expect(evaluationResponse.statusCode).toBe(200);
        const evaluationId = getId(evaluationResponse);

        const gradeResponse = await request(app)
            .post("/api/grades")
            .set("Authorization", auth(adminToken))
            .send({
                studentId,
                evaluationId,
                score: 92,
                observation: "Buen desarrollo del proyecto final.",
                dateRegistered: "2026-06-26",
                status: "active"
            });

        expect(gradeResponse.statusCode).toBe(200);
        const gradeId = getId(gradeResponse);

        const gradesList = await request(app)
            .get("/api/grades")
            .set("Authorization", auth(adminToken));

        expect(gradesList.statusCode).toBe(200);
        expect(Array.isArray(gradesList.body.data)).toBe(true);

        const gradeById = await request(app)
            .get(`/api/grades/${gradeId}`)
            .set("Authorization", auth(adminToken));

        expect(gradeById.statusCode).toBe(200);
        expect(gradeById.body.data._id).toBe(gradeId);

        const updateObservation = await request(app)
            .patch(`/api/grades/${gradeId}/observation`)
            .set("Authorization", auth(adminToken))
            .send({
                observation: "Excelente implementación de endpoints."
            });

        expect(updateObservation.statusCode).toBe(200);
        expect(updateObservation.body.data.observation).toBe("Excelente implementación de endpoints.");

        const coursesList = await request(app)
            .get("/api/courses")
            .set("Authorization", auth(adminToken));

        expect(coursesList.statusCode).toBe(200);
        expect(Array.isArray(coursesList.body.data)).toBe(true);

        const courseById = await request(app)
            .get(`/api/courses/${courseId}`)
            .set("Authorization", auth(adminToken));

        expect(courseById.statusCode).toBe(200);
        expect(courseById.body.data._id).toBe(courseId);

        const courseStudents = await request(app)
            .get(`/api/courses/${courseId}/students`)
            .set("Authorization", auth(adminToken));

        expect(courseStudents.statusCode).toBe(200);
        expect(Array.isArray(courseStudents.body.data.students)).toBe(true);

        const courseEvaluations = await request(app)
            .get(`/api/courses/${courseId}/evaluations`)
            .set("Authorization", auth(adminToken));

        expect(courseEvaluations.statusCode).toBe(200);
        expect(Array.isArray(courseEvaluations.body.data)).toBe(true);

        const studentCourses = await request(app)
            .get(`/api/students/${studentId}/courses`)
            .set("Authorization", auth(adminToken));

        expect(studentCourses.statusCode).toBe(200);
        expect(Array.isArray(studentCourses.body.data)).toBe(true);

        const studentGrades = await request(app)
            .get(`/api/students/${studentId}/grades`)
            .set("Authorization", auth(adminToken));

        expect(studentGrades.statusCode).toBe(200);
        expect(Array.isArray(studentGrades.body.data)).toBe(true);

        const studentCourseGrades = await request(app)
            .get(`/api/students/${studentId}/courses/${courseId}/grades`)
            .set("Authorization", auth(adminToken));

        expect(studentCourseGrades.statusCode).toBe(200);
        expect(Array.isArray(studentCourseGrades.body.data)).toBe(true);

        const studentCourseEvaluations = await request(app)
            .get(`/api/students/${studentId}/courses/${courseId}/evaluations`)
            .set("Authorization", auth(adminToken));

        expect(studentCourseEvaluations.statusCode).toBe(200);
        expect(Array.isArray(studentCourseEvaluations.body.data)).toBe(true);

        const averageResponse = await request(app)
            .get(`/api/students/${studentId}/courses/${courseId}/average`)
            .set("Authorization", auth(adminToken));

        expect(averageResponse.statusCode).toBe(200);
        expect(averageResponse.body.data.average).toBe(92);

        const courseAverages = await request(app)
            .get(`/api/courses/${courseId}/averages`)
            .set("Authorization", auth(adminToken));

        expect(courseAverages.statusCode).toBe(200);

        const courseReport = await request(app)
            .get(`/api/courses/${courseId}/report`)
            .set("Authorization", auth(adminToken));

        expect(courseReport.statusCode).toBe(200);
    });

    test("should reject duplicated users, missing token and invalid roles", async () => {
        await request(app)
            .post("/api/users/register")
            .send({
                name: "Admin Principal",
                email: "admin@example.com",
                password: "Password123",
                role: "admin",
                status: "active"
            });

        const duplicateUser = await request(app)
            .post("/api/users/register")
            .send({
                name: "Admin Repetido",
                email: "admin@example.com",
                password: "Password123",
                role: "admin",
                status: "active"
            });

        expect(duplicateUser.statusCode).toBe(400);
        expect(duplicateUser.body.success).toBe(false);

        const noTokenResponse = await request(app)
            .get("/api/users");

        expect(noTokenResponse.statusCode).toBe(401);

        await request(app)
            .post("/api/users/register")
            .send({
                name: "Estudiante Sin Permiso",
                email: "student@example.com",
                password: "Password123",
                role: "student",
                status: "active"
            });

        const studentLogin = await request(app)
            .post("/api/users/login")
            .send({
                email: "student@example.com",
                password: "Password123"
            });

        const studentToken = studentLogin.body.data.token;

        const forbiddenResponse = await request(app)
            .get("/api/users")
            .set("Authorization", auth(studentToken));

        expect(forbiddenResponse.statusCode).toBe(403);
    });
});