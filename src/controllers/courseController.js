import { 
    getCourses, 
    replaceTeacherInCourse, 
    enrollStudentInDB, 
    deleteCourseInDB,
    createCourseInDB,
    getCourseById,
    updateCourseInDB,
    getStudentsByCourseId,
    removeStudentFromCourse,
    getAveragesByCourseId,
    getEvaluationsByCourseId,
    getCourseReport
 } from "../services/courseService.js";
export async function findCourses(req, res, next) {
    let coursesList = await getCourses();
    return res.success(200, "Courses found", coursesList);
}
export async function reAssignTeacherToCourse(req, res, next) {
    const { id } = req.params;
    const courseFound = await getCourseById(id);
    if(!courseFound){
        const error = new Error("Course not found");
        error.status = 404;
        return next(error);
    }
    const { teacherId } = req.body;

    const updatedCourse = await replaceTeacherInCourse(id, teacherId);
    if (!updatedCourse) {
        const error = new Error("Teacher not found");
        error.status = 404;
        return next(error);
    }
    return res.success(200, "Teacher assigned to course", updatedCourse);
}

export async function enrollStudentInCourse(req, res, next) {
    const { id } = req.params;

    const courseFound = await getCourseById(id);

    if (!courseFound) {
        const error = new Error("Course not found");
        error.status = 404;
        return next(error);
    }

    const { studentId } = req.body;

    const enrolledStudent = await enrollStudentInDB(id, studentId);

    if (enrolledStudent === -1) {
        const error = new Error("Student not found");
        error.status = 404;
        return next(error);
    }

    if (enrolledStudent === -3) {
        const error = new Error("Student is already enrolled in this course");
        error.status = 400;
        return next(error);
    }

    if (enrolledStudent === -4) {
        const error = new Error("A course can have maximum 50 students");
        error.status = 400;
        return next(error);
    }

    return res.success(200, "Student enrolled in course", enrolledStudent);
}

export async function findCourseReport(req, res, next) {
    const { id } = req.params;
    const courseFound = await getCourseById(id);
    if (!courseFound) {
        const error = new Error("Course not found");
        error.status = 404;
        return next(error);
    }

    const report = await getCourseReport(id);
    return res.success(200, "Course report generated", report);
}

export async function deleteCourseById(req, res, next) {
    const { id } = req.params;

    const courseFound = await getCourseById(id);

    if (!courseFound) {
        const error = new Error("Course not found");
        error.status = 404;
        return next(error);
    }

    const deletedCourseResponse = await deleteCourseInDB(id);

    if (deletedCourseResponse.type === "deactivated") {
        return res.success(
            200,
            "Course has related data, it was deactivated successfully",
            deletedCourseResponse.course
        );
    }

    return res.success(
        200,
        "Course deleted successfully",
        deletedCourseResponse.course
    );
}

export async function findEvaluationsByCourseId(req, res, next) {
    const { id } = req.params;
    const courseFound = await getCourseById(id);
    if (!courseFound) {
        const error = new Error("Course not found");
        error.status = 404;
        return next(error);
    }
    const evaluations = await getEvaluationsByCourseId(id);
    return res.success(200, "Evaluations found for the course", evaluations);
}
export async function saveCourse(req, res, next) {
    const { name, description, code, teacherId, studentIds, status } = req.body;

    const newCourse = await createCourseInDB(
        name,
        description,
        code,
        teacherId,
        studentIds || [],
        status
    );

    if (newCourse === null) {
        const error = Error("Course with the same code already exists");
        error.statusCode = 400;
        return next(error);
    }

    if (newCourse === -1) {
        const error = Error("Invalid teacherId, teacher does not exist");
        error.statusCode = 400;
        return next(error);
    }

    if (newCourse === -2) {
        const error = Error("A course can have maximum 50 students");
        error.statusCode = 400;
        return next(error);
    }

    if (newCourse === -3) {
        const error = Error("One or more students do not exist");
        error.statusCode = 400;
        return next(error);
    }

    return res.success(200, "Course created successfully", newCourse);
}

export async function findCourseById(req, res, next) {
    const courseId = req.params.id;

    const course = await getCourseById(courseId);

    if (!course) {
        const error = Error("Course not found");
        error.statusCode = 404;
        return next(error);
    }

    return res.success(200, "Course found", course);
}

export async function replaceCourseById(req, res, next) {
    const courseId = req.params.id;

    const courseFound = await getCourseById(courseId);

    if (!courseFound) {
        const error = Error("Course not found");
        error.statusCode = 404;
        return next(error);
    }

    const { name, description, code, teacherId, studentIds, status } = req.body;

    const updatedCourse = await updateCourseInDB(
        courseId,
        name,
        description,
        code,
        teacherId,
        studentIds || [],
        status
    );

    if (updatedCourse === null) {
        const error = Error("Course with the same code already exists");
        error.statusCode = 400;
        return next(error);
    }

    if (updatedCourse === -1) {
        const error = Error("Invalid teacherId, teacher does not exist");
        error.statusCode = 400;
        return next(error);
    }

    if (updatedCourse === -2) {
        const error = Error("A course can have maximum 50 students");
        error.statusCode = 400;
        return next(error);
    }

    if (updatedCourse === -3) {
        const error = Error("One or more students do not exist");
        error.statusCode = 400;
        return next(error);
    }

    return res.success(200, "Course updated successfully", updatedCourse);
}

export async function findStudentsByCourse(req, res, next) {
    const courseId = req.params.id;

    const response = await getStudentsByCourseId(courseId);

    if (!response) {
        const error = Error("Course not found");
        error.statusCode = 404;
        return next(error);
    }

    return res.success(200, "Course students found", response);
}

export async function removeStudentByCourse(req, res, next) {
    const courseId = req.params.id;
    const studentId = req.params.studentId;

    const updatedCourse = await removeStudentFromCourse(courseId, studentId);

    if (updatedCourse === -1) {
        const error = Error("Course not found");
        error.statusCode = 404;
        return next(error);
    }

    if (updatedCourse === -2) {
        const error = Error("Student is not enrolled in this course");
        error.statusCode = 400;
        return next(error);
    }

    return res.success(200, "Student removed from course successfully", updatedCourse);
}

export async function findAveragesByCourse(req, res, next) {
    const courseId = req.params.id;

    const response = await getAveragesByCourseId(courseId);

    if (!response) {
        const error = Error("Course not found");
        error.statusCode = 404;
        return next(error);
    }

    return res.success(200, "Course averages found", response);
}
