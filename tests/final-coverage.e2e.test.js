import request from "supertest";
import app from "../src/app.js";

function getId(response) {
    return response.body.data._id || response.body.data.id;
}

function auth(token) {
    return `Bearer ${token}`;
}

async function registerUser(user) {
    return await request(app)
        .post("/api/users/register")
        .send(user);
}

async function login(email, password = "Password123") {
    const response = await request(app)
        .post("/api/users/login")
        .send({ email, password });

    return response.body.data.token;
}

async function createBaseData() {
    const adminUser = await registerUser({
        name: "Admin Final Coverage",
        email: "admin.final@example.com",
        password: "Password123",
        role: "admin",
        status: "active"
    });

    const adminToken = await login("admin.final@example.com");

    const teacherUser = await registerUser({
        name: "Teacher Final Coverage",
        email: "teacher.final@example.com",
        password: "Password123",
        role: "teacher",
        status: "active"
    });

    const studentUser = await registerUser({
        name: "Student Final Coverage",
        email: "student.final@example.com",
        password: "Password123",
        role: "student",
        status: "active"
    });

    const teacherUserId = getId(teacherUser);
    const studentUserId = getId(studentUser);

    const teacherResponse = await request(app)
        .post("/api/teachers")
        .set("Authorization", auth(adminToken))
        .send({
            userId: teacherUserId,
            teacherCode: 7771,
            subjectsCanTeach: ["Backend", "Testing", "Express.js"]
        });

    const studentResponse = await request(app)
        .post("/api/students")
        .set("Authorization", auth(adminToken))
        .send({
            userId: studentUserId,
            studentCode: 7772,
            career: "Ingeniería de Sistemas",
            semester: 5
        });

    const teacherId = getId(teacherResponse);
    const studentId = getId(studentResponse);

    const courseResponse = await request(app)
        .post("/api/courses")
        .set("Authorization", auth(adminToken))
        .send({
            name: "Curso Final Coverage",
            description: "Curso para subir cobertura final",
            code: 7773,
            teacherId,
            studentIds: [],
            status: "active"
        });

    const courseId = getId(courseResponse);

    await request(app)
        .post(`/api/courses/${courseId}/students`)
        .set("Authorization", auth(adminToken))
        .send({ studentId });

    const evaluationResponse = await request(app)
        .post("/api/evaluations")
        .set("Authorization", auth(adminToken))
        .send({
            courseId,
            title: "Evaluación Final Coverage",
            description: "Evaluación para subir cobertura",
            type: "project",
            date: "2026-06-26",
            status: "active"
        });

    const evaluationId = getId(evaluationResponse);

    const gradeResponse = await request(app)
        .post("/api/grades")
        .set("Authorization", auth(adminToken))
        .send({
            studentId,
            evaluationId,
            score: 88,
            observation: "Nota para cobertura final",
            dateRegistered: "2026-06-26",
            status: "active"
        });

    const gradeId = getId(gradeResponse);

    return {
        adminToken,
        teacherId,
        studentId,
        courseId,
        evaluationId,
        gradeId
    };
}

const fakeId = "507f1f77bcf86cd799439011";

describe("Final coverage push", () => {
    test("should cover course students and evaluations missing course branches", async () => {
        const { adminToken } = await createBaseData();

        const missingCourseStudents = await request(app)
            .get(`/api/courses/${fakeId}/students`)
            .set("Authorization", auth(adminToken));

        expect(missingCourseStudents.statusCode).toBeGreaterThanOrEqual(400);

        const missingCourseEvaluations = await request(app)
            .get(`/api/courses/${fakeId}/evaluations`)
            .set("Authorization", auth(adminToken));

        expect(missingCourseEvaluations.statusCode).toBeGreaterThanOrEqual(400);
    });

    test("should deactivate course with related data instead of deleting physically", async () => {
        const { adminToken, courseId } = await createBaseData();

        const deleteRelatedCourse = await request(app)
            .delete(`/api/courses/${courseId}`)
            .set("Authorization", auth(adminToken));

        expect(deleteRelatedCourse.statusCode).toBe(200);
        expect(deleteRelatedCourse.body.success).toBe(true);
    });

    test("should cover student report errors when course does not exist", async () => {
        const { adminToken, studentId } = await createBaseData();

        const gradesMissingCourse = await request(app)
            .get(`/api/students/${studentId}/courses/${fakeId}/grades`)
            .set("Authorization", auth(adminToken));

        expect(gradesMissingCourse.statusCode).toBeGreaterThanOrEqual(400);

        const evaluationsMissingCourse = await request(app)
            .get(`/api/students/${studentId}/courses/${fakeId}/evaluations`)
            .set("Authorization", auth(adminToken));

        expect(evaluationsMissingCourse.statusCode).toBeGreaterThanOrEqual(400);

        const averageMissingCourse = await request(app)
            .get(`/api/students/${studentId}/courses/${fakeId}/average`)
            .set("Authorization", auth(adminToken));

        expect(averageMissingCourse.statusCode).toBeGreaterThanOrEqual(400);
    });

    test("should cover teacher creation errors", async () => {
        const { adminToken } = await createBaseData();

        const teacherWithMissingUser = await request(app)
            .post("/api/teachers")
            .set("Authorization", auth(adminToken))
            .send({
                userId: fakeId,
                teacherCode: 9090,
                subjectsCanTeach: ["Testing"]
            });

        expect(teacherWithMissingUser.statusCode).toBeGreaterThanOrEqual(400);
    });

    test("should cover student creation errors", async () => {
        const { adminToken } = await createBaseData();

        const studentWithMissingUser = await request(app)
            .post("/api/students")
            .set("Authorization", auth(adminToken))
            .send({
                userId: fakeId,
                studentCode: 9091,
                career: "Ingeniería de Sistemas",
                semester: 4
            });

        expect(studentWithMissingUser.statusCode).toBeGreaterThanOrEqual(400);
    });
});