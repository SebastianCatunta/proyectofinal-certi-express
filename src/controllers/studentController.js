import { 
    getStudents, 
    createStudentInDB, 
    getStudentById,
    updateStudentInDB,
    deleteStudentInDB,
    getCoursesByStudentId,
    getGradesByStudentId,
    getAverageByStudentAndCourse,
    getGradesByStudentAndCourse,
    getEvaluationsByStudentAndCourse
} from "../services/studentService.js";

export async function findStudents(req, res, next) {
    let studentsList = await getStudents();
    return res.success(200, "Students found", studentsList);
}

export async function saveStudent(req, res, next) {
    const { userId, studentCode, career, semester } = req.body;

    const newStudent = await createStudentInDB(userId, studentCode, career, semester);

    if (newStudent == null) { 
        const error = Error("Student with the same userId already exists");
        error.statusCode = 400;
        return next(error);
    }

    if (newStudent == -1) {
        const error = Error("Invalid userId, user does not exist");
        error.statusCode = 400;
        return next(error);
    }

    if (newStudent === -2) {
        const error = Error("The user must have student role");
        error.statusCode = 400;
        return next(error);
    }
    return res.success(200, "Student created successfully", newStudent);
}

export async function findEvaluationsByStudentAndCourse(req, res, next) {
    const studentId = req.params.id;
    const courseId = req.params.courseId;

    const studentFound = await getStudentById(studentId);

    if (!studentFound) {
        const error = Error("Student not found");
        error.statusCode = 404;
        return next(error);
    }

    const evaluationsInCourse = await getEvaluationsByStudentAndCourse(studentId, courseId);

    if (evaluationsInCourse === -1) {
        const error = Error("Course not found");
        error.statusCode = 404;
        return next(error);
    }

    if (evaluationsInCourse === -2) {
        const error = Error("Student is not enrolled in this course");
        error.statusCode = 400;
        return next(error);
    }

    return res.success(200, "Student course evaluations found", evaluationsInCourse);
}

export async function findStudentsById(req, res, next) {
    const studentId = req.params.id;

    const student = await getStudentById(studentId);

    if (student == null) {
        const error = Error("Student not found");
        error.statusCode = 404;
        return next(error);
    }

    return res.success(200, "Student found", student);
}

export async function replaceStudentById(req, res, next) {
    const studentId = req.params.id;

    const studentFound = await getStudentById(studentId);

    if (!studentFound) {
        const error = Error("Student not found");
        error.statusCode = 404;
        return next(error);
    }

    const { userId, studentCode, career, semester } = req.body;

    const updatedStudent = await updateStudentInDB(
        studentId,
        userId,
        studentCode,
        career,
        semester
    );

    if (updatedStudent == null) {
        const error = Error("Student with the same userId already exists");
        error.statusCode = 400;
        return next(error);
    }

    if (updatedStudent == -1) {
        const error = Error("Invalid userId, user does not exist");
        error.statusCode = 400;
        return next(error);
    }

    return res.success(200, "Student updated successfully", updatedStudent);
}

export async function deleteStudentById(req, res, next) {
    const studentId = req.params.id;

    const deletedStudent = await deleteStudentInDB(studentId);

    if (!deletedStudent) {
        const error = Error("Student not found");
        error.statusCode = 404;
        return next(error);
    }

    return res.success(200, "Student deleted successfully", deletedStudent);
}

export async function findCoursesByStudent(req, res, next) {
    const studentId = req.params.id;

    const studentFound = await getStudentById(studentId);

    if (!studentFound) {
        const error = Error("Student not found");
        error.statusCode = 404;
        return next(error);
    }

    const courses = await getCoursesByStudentId(studentId);

    return res.success(200, "Student courses found", courses);
}

export async function findGradesByStudent(req, res, next) {
    const studentId = req.params.id;

    const studentFound = await getStudentById(studentId);

    if (!studentFound) {
        const error = Error("Student not found");
        error.statusCode = 404;
        return next(error);
    }

    const grades = await getGradesByStudentId(studentId);

    return res.success(200, "Student grades found", grades);
}

export async function findAverageByStudentAndCourse(req, res, next) {
    const studentId = req.params.id;
    const courseId = req.params.courseId;

    const studentFound = await getStudentById(studentId);

    if (!studentFound) {
        const error = Error("Student not found");
        error.statusCode = 404;
        return next(error);
    }

    const averageResponse = await getAverageByStudentAndCourse(studentId, courseId);

    if (averageResponse == -1) {
        const error = Error("Course not found");
        error.statusCode = 404;
        return next(error);
    }

    if (averageResponse == -2) {
        const error = Error("Student is not enrolled in this course");
        error.statusCode = 400;
        return next(error);
    }

    return res.success(200, "Student course average found", averageResponse);
}

export async function findGradesByStudentAndCourse(req, res, next) {
    const studentId = req.params.id;
    const courseId = req.params.courseId;

    const studentFound = await getStudentById(studentId);

    if (!studentFound) {
        const error = Error("Student not found");
        error.statusCode = 404;
        return next(error);
    }

    const gradesInCourse = await getGradesByStudentAndCourse(studentId, courseId);

    if (gradesInCourse === -1) {
        const error = Error("Course not found");
        error.statusCode = 404;
        return next(error);
    }

    if (gradesInCourse === -2) {
        const error = Error("Student is not enrolled in this course");
        error.statusCode = 400;
        return next(error);
    }

    return res.success(200, "Student course grades found", gradesInCourse);
}