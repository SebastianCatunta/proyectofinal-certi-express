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
        name: "Admin Error Test",
        email: "admin.error@example.com",
        password: "Password123",
        role: "admin",
        status: "active"
    });

    const adminToken = await login("admin.error@example.com");

    const teacherUser = await registerUser({
        name: "Teacher Error Test",
        email: "teacher.error@example.com",
        password: "Password123",
        role: "teacher",
        status: "active"
    });

    const studentUser = await registerUser({
        name: "Student Error Test",
        email: "student.error@example.com",
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
            teacherCode: 3001,
            subjectsCanTeach: ["Backend", "Testing"]
        });

    const studentResponse = await request(app)
        .post("/api/students")
        .set("Authorization", auth(adminToken))
        .send({
            userId: studentUserId,
            studentCode: 4001,
            career: "Ingeniería de Sistemas",
            semester: 5
        });

    const teacherId = getId(teacherResponse);
    const studentId = getId(studentResponse);

    const courseResponse = await request(app)
        .post("/api/courses")
        .set("Authorization", auth(adminToken))
        .send({
            name: "Curso Error Branches",
            description: "Curso para probar ramas de error",
            code: 9001,
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
            title: "Evaluación Error Test",
            description: "Evaluación para ramas de error",
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
            score: 80,
            observation: "Nota inicial",
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

const fakeId = "507f1f77bcf86cd799439011";

describe("Error branches and negative endpoint coverage", () => {
    test("should cover user error branches", async () => {
        const { adminToken, studentUserId } = await createBaseData();

        const invalidLogin = await request(app)
            .post("/api/users/login")
            .send({
                email: "student.error@example.com",
                password: "WrongPassword"
            });

        expect(invalidLogin.statusCode).toBeGreaterThanOrEqual(400);

        const getMissingUser = await request(app)
            .get(`/api/users/${fakeId}`)
            .set("Authorization", auth(adminToken));

        expect(getMissingUser.statusCode).toBeGreaterThanOrEqual(400);

        const updateMissingUser = await request(app)
            .put(`/api/users/${fakeId}`)
            .set("Authorization", auth(adminToken))
            .send({
                name: "Missing User",
                email: "missing@example.com",
                password: "Password123",
                role: "student",
                status: "active"
            });

        expect(updateMissingUser.statusCode).toBeGreaterThanOrEqual(400);

        const updateRoleMissingUser = await request(app)
            .patch(`/api/users/${fakeId}/role`)
            .set("Authorization", auth(adminToken))
            .send({
                role: "teacher"
            });

        expect(updateRoleMissingUser.statusCode).toBeGreaterThanOrEqual(400);

        const deleteMissingUser = await request(app)
            .delete(`/api/users/${fakeId}`)
            .set("Authorization", auth(adminToken));

        expect(deleteMissingUser.statusCode).toBeGreaterThanOrEqual(400);

        const updateUserDuplicateEmail = await request(app)
            .put(`/api/users/${studentUserId}`)
            .set("Authorization", auth(adminToken))
            .send({
                name: "Student Duplicate Email",
                email: "admin.error@example.com",
                password: "Password123",
                role: "student",
                status: "active"
            });

        expect(updateUserDuplicateEmail.statusCode).toBeGreaterThanOrEqual(400);
    });

    test("should cover teacher error branches and delete", async () => {
        const { adminToken, teacherId } = await createBaseData();

        const getMissingTeacher = await request(app)
            .get(`/api/teachers/${fakeId}`)
            .set("Authorization", auth(adminToken));

        expect(getMissingTeacher.statusCode).toBeGreaterThanOrEqual(400);

        const updateMissingTeacher = await request(app)
            .put(`/api/teachers/${fakeId}`)
            .set("Authorization", auth(adminToken))
            .send({
                userId: fakeId,
                teacherCode: 9991,
                subjectsCanTeach: ["Testing"]
            });

        expect(updateMissingTeacher.statusCode).toBeGreaterThanOrEqual(400);

        const deleteMissingTeacher = await request(app)
            .delete(`/api/teachers/${fakeId}`)
            .set("Authorization", auth(adminToken));

        expect(deleteMissingTeacher.statusCode).toBeGreaterThanOrEqual(400);

        const deleteTeacher = await request(app)
            .delete(`/api/teachers/${teacherId}`)
            .set("Authorization", auth(adminToken));

        expect(deleteTeacher.statusCode).toBeGreaterThanOrEqual(200);
        expect(deleteTeacher.statusCode).toBeLessThan(500);
    });

    test("should cover student error branches and delete", async () => {
        const { adminToken, studentId, studentUserId } = await createBaseData();

        const getMissingStudent = await request(app)
            .get(`/api/students/${fakeId}`)
            .set("Authorization", auth(adminToken));

        expect(getMissingStudent.statusCode).toBeGreaterThanOrEqual(400);

        const updateMissingStudent = await request(app)
            .put(`/api/students/${fakeId}`)
            .set("Authorization", auth(adminToken))
            .send({
                userId: studentUserId,
                studentCode: 8888,
                career: "Ingeniería de Sistemas",
                semester: 6
            });

        expect(updateMissingStudent.statusCode).toBeGreaterThanOrEqual(400);

        const missingStudentCourses = await request(app)
            .get(`/api/students/${fakeId}/courses`)
            .set("Authorization", auth(adminToken));

        expect(missingStudentCourses.statusCode).toBeGreaterThanOrEqual(400);

        const missingStudentGrades = await request(app)
            .get(`/api/students/${fakeId}/grades`)
            .set("Authorization", auth(adminToken));

        expect(missingStudentGrades.statusCode).toBeGreaterThanOrEqual(400);

        const deleteMissingStudent = await request(app)
            .delete(`/api/students/${fakeId}`)
            .set("Authorization", auth(adminToken));

        expect(deleteMissingStudent.statusCode).toBeGreaterThanOrEqual(400);

        const deleteStudent = await request(app)
            .delete(`/api/students/${studentId}`)
            .set("Authorization", auth(adminToken));

        expect(deleteStudent.statusCode).toBeGreaterThanOrEqual(200);
        expect(deleteStudent.statusCode).toBeLessThan(500);
    });

    test("should cover course error branches", async () => {
        const { adminToken, courseId, teacherId, studentId } = await createBaseData();

        const getMissingCourse = await request(app)
            .get(`/api/courses/${fakeId}`)
            .set("Authorization", auth(adminToken));

        expect(getMissingCourse.statusCode).toBeGreaterThanOrEqual(400);

        const updateMissingCourse = await request(app)
            .put(`/api/courses/${fakeId}`)
            .set("Authorization", auth(adminToken))
            .send({
                name: "Curso Inexistente",
                description: "No existe",
                code: 1111,
                teacherId,
                studentIds: [],
                status: "active"
            });

        expect(updateMissingCourse.statusCode).toBeGreaterThanOrEqual(400);

        const replaceTeacherMissingCourse = await request(app)
            .patch(`/api/courses/${fakeId}/teacher`)
            .set("Authorization", auth(adminToken))
            .send({
                teacherId
            });

        expect(replaceTeacherMissingCourse.statusCode).toBeGreaterThanOrEqual(400);

        const replaceMissingTeacher = await request(app)
            .patch(`/api/courses/${courseId}/teacher`)
            .set("Authorization", auth(adminToken))
            .send({
                teacherId: fakeId
            });

        expect(replaceMissingTeacher.statusCode).toBeGreaterThanOrEqual(400);

        const enrollMissingStudent = await request(app)
            .post(`/api/courses/${courseId}/students`)
            .set("Authorization", auth(adminToken))
            .send({
                studentId: fakeId
            });

        expect(enrollMissingStudent.statusCode).toBeGreaterThanOrEqual(400);

        const enrollInMissingCourse = await request(app)
            .post(`/api/courses/${fakeId}/students`)
            .set("Authorization", auth(adminToken))
            .send({
                studentId
            });

        expect(enrollInMissingCourse.statusCode).toBeGreaterThanOrEqual(400);

        const courseAveragesMissing = await request(app)
            .get(`/api/courses/${fakeId}/averages`)
            .set("Authorization", auth(adminToken));

        expect(courseAveragesMissing.statusCode).toBeGreaterThanOrEqual(400);

        const courseReportMissing = await request(app)
            .get(`/api/courses/${fakeId}/report`)
            .set("Authorization", auth(adminToken));

        expect(courseReportMissing.statusCode).toBeGreaterThanOrEqual(400);
    });

    test("should cover evaluation error branches and delete", async () => {
        const { adminToken, evaluationId } = await createBaseData();

        const getMissingEvaluation = await request(app)
            .get(`/api/evaluations/${fakeId}`)
            .set("Authorization", auth(adminToken));

        expect(getMissingEvaluation.statusCode).toBeGreaterThanOrEqual(400);

        const createEvaluationMissingCourse = await request(app)
            .post("/api/evaluations")
            .set("Authorization", auth(adminToken))
            .send({
                courseId: fakeId,
                title: "Evaluación sin curso",
                description: "Debe fallar",
                type: "project",
                date: "2026-06-26",
                status: "active"
            });

        expect(createEvaluationMissingCourse.statusCode).toBeGreaterThanOrEqual(400);

        const updateMissingEvaluation = await request(app)
            .put(`/api/evaluations/${fakeId}`)
            .set("Authorization", auth(adminToken))
            .send({
                courseId: fakeId,
                title: "Evaluación inexistente",
                description: "No existe",
                type: "exam",
                date: "2026-06-26",
                status: "active"
            });

        expect(updateMissingEvaluation.statusCode).toBeGreaterThanOrEqual(400);

        const deleteMissingEvaluation = await request(app)
            .delete(`/api/evaluations/${fakeId}`)
            .set("Authorization", auth(adminToken));

        expect(deleteMissingEvaluation.statusCode).toBeGreaterThanOrEqual(400);

        const deleteEvaluation = await request(app)
            .delete(`/api/evaluations/${evaluationId}`)
            .set("Authorization", auth(adminToken));

        expect(deleteEvaluation.statusCode).toBeGreaterThanOrEqual(200);
        expect(deleteEvaluation.statusCode).toBeLessThan(500);
    });

    test("should cover grade error branches", async () => {
        const { adminToken, gradeId, studentId, evaluationId } = await createBaseData();

        const getMissingGrade = await request(app)
            .get(`/api/grades/${fakeId}`)
            .set("Authorization", auth(adminToken));

        expect(getMissingGrade.statusCode).toBeGreaterThanOrEqual(400);

        const createGradeMissingStudent = await request(app)
            .post("/api/grades")
            .set("Authorization", auth(adminToken))
            .send({
                studentId: fakeId,
                evaluationId,
                score: 70,
                observation: "Debe fallar por estudiante",
                dateRegistered: "2026-06-26",
                status: "active"
            });

        expect(createGradeMissingStudent.statusCode).toBeGreaterThanOrEqual(400);

        const createGradeMissingEvaluation = await request(app)
            .post("/api/grades")
            .set("Authorization", auth(adminToken))
            .send({
                studentId,
                evaluationId: fakeId,
                score: 70,
                observation: "Debe fallar por evaluación",
                dateRegistered: "2026-06-26",
                status: "active"
            });

        expect(createGradeMissingEvaluation.statusCode).toBeGreaterThanOrEqual(400);

        const updateMissingGrade = await request(app)
            .put(`/api/grades/${fakeId}`)
            .set("Authorization", auth(adminToken))
            .send({
                studentId,
                evaluationId,
                score: 90,
                observation: "Grade inexistente",
                dateRegistered: "2026-06-26",
                status: "active"
            });

        expect(updateMissingGrade.statusCode).toBeGreaterThanOrEqual(400);

        const updateMissingObservation = await request(app)
            .patch(`/api/grades/${fakeId}/observation`)
            .set("Authorization", auth(adminToken))
            .send({
                observation: "No existe"
            });

        expect(updateMissingObservation.statusCode).toBeGreaterThanOrEqual(400);

        const updateObservation = await request(app)
            .patch(`/api/grades/${gradeId}/observation`)
            .set("Authorization", auth(adminToken))
            .send({
                observation: "Observación final desde error branches"
            });

        expect(updateObservation.statusCode).toBe(200);
    });

    test("should cover ownership denied branches for student", async () => {
        const { adminToken, studentId, courseId } = await createBaseData();

        const otherStudentUser = await registerUser({
            name: "Other Student",
            email: "other.student@example.com",
            password: "Password123",
            role: "student",
            status: "active"
        });

        const otherStudentUserId = getId(otherStudentUser);

        const otherStudentResponse = await request(app)
            .post("/api/students")
            .set("Authorization", auth(adminToken))
            .send({
                userId: otherStudentUserId,
                studentCode: 4444,
                career: "Ingeniería de Sistemas",
                semester: 3
            });

        const otherStudentId = getId(otherStudentResponse);
        const otherStudentToken = await login("other.student@example.com");

        const forbiddenCourses = await request(app)
            .get(`/api/students/${studentId}/courses`)
            .set("Authorization", auth(otherStudentToken));

        expect(forbiddenCourses.statusCode).toBeGreaterThanOrEqual(400);

        const forbiddenGrades = await request(app)
            .get(`/api/students/${studentId}/courses/${courseId}/grades`)
            .set("Authorization", auth(otherStudentToken));

        expect(forbiddenGrades.statusCode).toBeGreaterThanOrEqual(400);

        const ownEmptyCourses = await request(app)
            .get(`/api/students/${otherStudentId}/courses`)
            .set("Authorization", auth(otherStudentToken));

        expect(ownEmptyCourses.statusCode).toBe(200);
    });

    test("should cover ownership denied branches for teacher", async () => {
        const { adminToken, courseId, gradeId } = await createBaseData();

        const otherTeacherUser = await registerUser({
            name: "Other Teacher",
            email: "other.teacher@example.com",
            password: "Password123",
            role: "teacher",
            status: "active"
        });

        const otherTeacherUserId = getId(otherTeacherUser);

        await request(app)
            .post("/api/teachers")
            .set("Authorization", auth(adminToken))
            .send({
                userId: otherTeacherUserId,
                teacherCode: 5555,
                subjectsCanTeach: ["Frontend"]
            });

        const otherTeacherToken = await login("other.teacher@example.com");

        const forbiddenEvaluation = await request(app)
            .post("/api/evaluations")
            .set("Authorization", auth(otherTeacherToken))
            .send({
                courseId,
                title: "Evaluación no permitida",
                description: "Otro docente no debería crearla",
                type: "project",
                date: "2026-06-28",
                status: "active"
            });

        expect(forbiddenEvaluation.statusCode).toBeGreaterThanOrEqual(400);

        const forbiddenObservation = await request(app)
            .patch(`/api/grades/${gradeId}/observation`)
            .set("Authorization", auth(otherTeacherToken))
            .send({
                observation: "No debería poder editar"
            });

        expect(forbiddenObservation.statusCode).toBeGreaterThanOrEqual(400);
    });
});