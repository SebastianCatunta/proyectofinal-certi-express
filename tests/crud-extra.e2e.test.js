import request from "supertest";
import app from "../src/app.js";

function getId(response) {
    return response.body.data._id || response.body.data.id;
}

function auth(token) {
    return `Bearer ${token}`;
}

async function registerUser(user) {
    const response = await request(app)
        .post("/api/users/register")
        .send(user);

    return response;
}

async function login(email, password = "Password123") {
    const response = await request(app)
        .post("/api/users/login")
        .send({ email, password });

    return response.body.data.token;
}

async function createBaseData() {
    const adminUser = await registerUser({
        name: "Admin Test",
        email: "admin.test@example.com",
        password: "Password123",
        role: "admin",
        status: "active"
    });

    const adminToken = await login("admin.test@example.com");

    const teacherUser = await registerUser({
        name: "Teacher Test",
        email: "teacher.test@example.com",
        password: "Password123",
        role: "teacher",
        status: "active"
    });

    const studentUser = await registerUser({
        name: "Student Test",
        email: "student.test@example.com",
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
            teacherCode: 9001,
            subjectsCanTeach: ["Backend", "Express.js"]
        });

    const studentResponse = await request(app)
        .post("/api/students")
        .set("Authorization", auth(adminToken))
        .send({
            userId: studentUserId,
            studentCode: 2026999,
            career: "Ingeniería de Sistemas",
            semester: 5
        });

    const teacherId = getId(teacherResponse);
    const studentId = getId(studentResponse);

    const courseResponse = await request(app)
        .post("/api/courses")
        .set("Authorization", auth(adminToken))
        .send({
            name: "Curso Test Backend",
            description: "Curso para pruebas automatizadas",
            code: 7001,
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
            title: "Evaluación Test",
            description: "Evaluación para pruebas",
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
            score: 85,
            observation: "Buen trabajo",
            dateRegistered: "2026-06-26",
            status: "active"
        });

    const gradeId = getId(gradeResponse);

    return {
        adminToken,
        teacherUserId,
        studentUserId,
        teacherId,
        studentId,
        courseId,
        evaluationId,
        gradeId
    };
}

describe("Extra CRUD endpoint coverage", () => {
    test("should test user read, update, role update and delete", async () => {
        const { adminToken, studentUserId } = await createBaseData();

        const getUser = await request(app)
            .get(`/api/users/${studentUserId}`)
            .set("Authorization", auth(adminToken));

        expect(getUser.statusCode).toBe(200);

        const updateUser = await request(app)
            .put(`/api/users/${studentUserId}`)
            .set("Authorization", auth(adminToken))
            .send({
                name: "Student Updated",
                email: "student.updated@example.com",
                password: "Password123",
                role: "student",
                status: "active"
            });

        expect(updateUser.statusCode).toBe(200);
        expect(updateUser.body.data.name).toBe("Student Updated");

        const updateRole = await request(app)
            .patch(`/api/users/${studentUserId}/role`)
            .set("Authorization", auth(adminToken))
            .send({
                role: "teacher"
            });

        expect(updateRole.statusCode).toBe(200);
        expect(updateRole.body.data.role).toBe("teacher");

        const deleteUser = await request(app)
            .delete(`/api/users/${studentUserId}`)
            .set("Authorization", auth(adminToken));

        expect(deleteUser.statusCode).toBe(200);
    });

    test("should test teacher endpoints", async () => {
        const { adminToken, teacherId, teacherUserId } = await createBaseData();

        const listTeachers = await request(app)
            .get("/api/teachers")
            .set("Authorization", auth(adminToken));

        expect(listTeachers.statusCode).toBe(200);
        expect(Array.isArray(listTeachers.body.data)).toBe(true);

        const getTeacher = await request(app)
            .get(`/api/teachers/${teacherId}`)
            .set("Authorization", auth(adminToken));

        expect(getTeacher.statusCode).toBe(200);

        const updateTeacher = await request(app)
            .put(`/api/teachers/${teacherId}`)
            .set("Authorization", auth(adminToken))
            .send({
                userId: teacherUserId,
                teacherCode: 9999,
                subjectsCanTeach: ["Backend", "Testing", "MongoDB"]
            });

        expect(updateTeacher.statusCode).toBe(200);
        expect(updateTeacher.body.data.teacherCode).toBe(9999);
    });

    test("should test student endpoints", async () => {
        const { adminToken, studentId, studentUserId } = await createBaseData();

        const listStudents = await request(app)
            .get("/api/students")
            .set("Authorization", auth(adminToken));

        expect(listStudents.statusCode).toBe(200);
        expect(Array.isArray(listStudents.body.data)).toBe(true);

        const getStudent = await request(app)
            .get(`/api/students/${studentId}`)
            .set("Authorization", auth(adminToken));

        expect(getStudent.statusCode).toBe(200);

        const updateStudent = await request(app)
            .put(`/api/students/${studentId}`)
            .set("Authorization", auth(adminToken))
            .send({
                userId: studentUserId,
                studentCode: 303030,
                career: "Ingeniería de Sistemas",
                semester: 6
            });

        expect(updateStudent.statusCode).toBe(200);
        expect(updateStudent.body.data.semester).toBe(6);
    });

    test("should test course update, teacher replacement and delete without related data", async () => {
        const { adminToken, courseId, teacherId } = await createBaseData();

        const getCourse = await request(app)
            .get(`/api/courses/${courseId}`)
            .set("Authorization", auth(adminToken));

        expect(getCourse.statusCode).toBe(200);

        const updateCourse = await request(app)
            .put(`/api/courses/${courseId}`)
            .set("Authorization", auth(adminToken))
            .send({
                name: "Curso Backend Actualizado",
                description: "Curso actualizado desde test",
                code: 7002,
                teacherId,
                studentIds: [],
                status: "active"
            });

        expect(updateCourse.statusCode).toBe(200);

        const replaceTeacher = await request(app)
            .patch(`/api/courses/${courseId}/teacher`)
            .set("Authorization", auth(adminToken))
            .send({
                teacherId
            });

        expect(replaceTeacher.statusCode).toBe(200);

        const emptyCourse = await request(app)
            .post("/api/courses")
            .set("Authorization", auth(adminToken))
            .send({
                name: "Curso Sin Relaciones",
                description: "Curso para probar delete físico",
                code: 8008,
                teacherId,
                studentIds: [],
                status: "active"
            });

        const emptyCourseId = getId(emptyCourse);

        const deleteCourse = await request(app)
            .delete(`/api/courses/${emptyCourseId}`)
            .set("Authorization", auth(adminToken));

        expect(deleteCourse.statusCode).toBe(200);
    });

    test("should test evaluation endpoints", async () => {
        const { adminToken, evaluationId, courseId } = await createBaseData();

        const listEvaluations = await request(app)
            .get("/api/evaluations")
            .set("Authorization", auth(adminToken));

        expect(listEvaluations.statusCode).toBe(200);
        expect(Array.isArray(listEvaluations.body.data)).toBe(true);

        const getEvaluation = await request(app)
            .get(`/api/evaluations/${evaluationId}`)
            .set("Authorization", auth(adminToken));

        expect(getEvaluation.statusCode).toBe(200);

        const updateEvaluation = await request(app)
            .put(`/api/evaluations/${evaluationId}`)
            .set("Authorization", auth(adminToken))
            .send({
                courseId,
                title: "Evaluación Actualizada",
                description: "Descripción actualizada",
                type: "exam",
                date: "2026-06-27",
                status: "active"
            });

        expect(updateEvaluation.statusCode).toBe(200);
        expect(updateEvaluation.body.data.title).toBe("Evaluación Actualizada");
    });

    test("should test grade update and negative validations", async () => {
        const { adminToken, gradeId, studentId, evaluationId, courseId } = await createBaseData();

        const updateGrade = await request(app)
            .put(`/api/grades/${gradeId}`)
            .set("Authorization", auth(adminToken))
            .send({
                studentId,
                evaluationId,
                score: 95,
                observation: "Nota actualizada",
                dateRegistered: "2026-06-27",
                status: "active"
            });

        expect(updateGrade.statusCode).toBe(200);
        expect(updateGrade.body.data.score).toBe(95);

        const duplicatedEnroll = await request(app)
            .post(`/api/courses/${courseId}/students`)
            .set("Authorization", auth(adminToken))
            .send({ studentId });

        expect(duplicatedEnroll.statusCode).toBeGreaterThanOrEqual(400);

        const invalidGrade = await request(app)
            .post("/api/grades")
            .set("Authorization", auth(adminToken))
            .send({
                studentId,
                evaluationId,
                score: 200,
                observation: "Nota inválida",
                dateRegistered: "2026-06-26",
                status: "active"
            });

        expect(invalidGrade.statusCode).toBeGreaterThanOrEqual(400);
    });

    test("should allow student to access own academic information", async () => {
        const { studentId, courseId } = await createBaseData();

        const studentToken = await login("student.test@example.com");

        const ownCourses = await request(app)
            .get(`/api/students/${studentId}/courses`)
            .set("Authorization", auth(studentToken));

        expect(ownCourses.statusCode).toBe(200);

        const ownGrades = await request(app)
            .get(`/api/students/${studentId}/courses/${courseId}/grades`)
            .set("Authorization", auth(studentToken));

        expect(ownGrades.statusCode).toBe(200);

        const ownAverage = await request(app)
            .get(`/api/students/${studentId}/courses/${courseId}/average`)
            .set("Authorization", auth(studentToken));

        expect(ownAverage.statusCode).toBe(200);
    });

    test("should allow teacher to manage evaluation and grade observation in own course", async () => {
        const { courseId, gradeId } = await createBaseData();

        const teacherToken = await login("teacher.test@example.com");

        const teacherEvaluation = await request(app)
            .post("/api/evaluations")
            .set("Authorization", auth(teacherToken))
            .send({
                courseId,
                title: "Evaluación creada por docente",
                description: "Prueba de ownership docente",
                type: "project",
                date: "2026-06-28",
                status: "active"
            });

        expect(teacherEvaluation.statusCode).toBe(200);

        const updateObservation = await request(app)
            .patch(`/api/grades/${gradeId}/observation`)
            .set("Authorization", auth(teacherToken))
            .send({
                observation: "Observación actualizada por docente"
            });

        expect(updateObservation.statusCode).toBe(200);
    });
});