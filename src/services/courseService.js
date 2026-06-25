import { Course } from "../data/courses.js";
import { Teacher } from "../data/teachers.js";
import { Student } from "../data/students.js";
import { Evaluation } from "../data/evaluations.js";
import { Grade } from "../data/grades.js";
export async function getCourses() {
    const coursesInDB = await Course.find();
    return coursesInDB;
}
export async function findCourseById(id) {
    const courseFound = await Course.findById(id);
    return courseFound;
}

export async function replaceTeacherInCourse(courseId, newTeacherId) {
    const teacherFound = await Teacher.findById(newTeacherId);

    if (!teacherFound) {
        return null;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { teacherId: newTeacherId },
        { new: true }
    );

    return updatedCourse;
}

export async function enrollStudentInDB(courseId, studentId) {
    const studentFound = await Student.findById(studentId);

    if (!studentFound) {
        return -1;
    }

    const courseFound = await Course.findById(courseId);

    if (!courseFound) {
        return -2;
    }

    const isAlreadyEnrolled = courseFound.studentIds.some((id) => {
        return id.toString() === studentId.toString();
    });

    if (isAlreadyEnrolled) {
        return -3;
    }

    if (courseFound.studentIds.length >= 50) {
        return -4;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { $push: { studentIds: studentId } },
        { new: true }
    );

    return updatedCourse;
}

export async function deleteCourseInDB(courseId) {
    const courseFound = await Course.findById(courseId);

    if (!courseFound) {
        return null;
    }

    const evaluationsFound = await Evaluation.find({ courseId });

    const evaluationIds = evaluationsFound.map((evaluation) => {
        return evaluation._id.toString();
    });

    const gradesFound = await Grade.find({
        evaluationId: { $in: evaluationIds }
    });

    if (
        courseFound.studentIds.length > 0 ||
        evaluationsFound.length > 0 ||
        gradesFound.length > 0
    ) {
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { status: "inactive" },
            { new: true }
        );

        return {
            type: "deactivated",
            course: updatedCourse
        };
    }

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    return {
        type: "deleted",
        course: deletedCourse
    };
}

export async function createCourseInDB(name, description, code, teacherId, studentIds = [], status) {
    const courseFound = await Course.find({ code });

    if (courseFound.length > 0) {
        return null;
    }

    const teacherFound = await Teacher.findById(teacherId);

    if (!teacherFound) {
        return -1;
    }

    if (studentIds.length > 50) {
        return -2;
    }

    if (studentIds.length > 0) {
        const studentsFound = await Student.find({ _id: { $in: studentIds } });

        if (studentsFound.length !== studentIds.length) {
            return -3;
        }
    }

    const newCourse = await Course.create({
        name,
        description,
        code,
        teacherId,
        studentIds,
        status
    });

    const responseCourse = {
        id: newCourse._id,
        name: newCourse.name,
        description: newCourse.description,
        code: newCourse.code,
        teacherId: newCourse.teacherId,
        studentIds: newCourse.studentIds,
        status: newCourse.status
    };

    return responseCourse;
}

export async function getCourseById(courseId) {
    const courseInDB = await Course.findById(courseId);
    return courseInDB;
}

export async function updateCourseInDB(courseId, name, description, code, teacherId, studentIds = [], status) {
    const courseFound = await Course.findOne({ code });

    if (courseFound && courseFound._id.toString() !== courseId) {
        return null;
    }

    const teacherFound = await Teacher.findById(teacherId);

    if (!teacherFound) {
        return -1;
    }

    if (studentIds.length > 50) {
        return -2;
    }

    if (studentIds.length > 0) {
        const studentsFound = await Student.find({ _id: { $in: studentIds } });

        if (studentsFound.length !== studentIds.length) {
            return -3;
        }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
            name,
            description,
            code,
            teacherId,
            studentIds,
            status
        },
        { new: true }
    );

    return updatedCourse;
}

export async function getStudentsByCourseId(courseId) {
    const courseFound = await Course.findById(courseId);

    if (!courseFound) {
        return null;
    }

    const studentsInCourse = await Student.find({
        _id: { $in: courseFound.studentIds }
    });

    return {
        course: courseFound,
        students: studentsInCourse
    };
}

export async function removeStudentFromCourse(courseId, studentId) {
    const courseFound = await Course.findById(courseId);

    if (!courseFound) {
        return -1;
    }

    const isStudentInCourse = courseFound.studentIds.includes(studentId);

    if (!isStudentInCourse) {
        return -2;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentIds: studentId } },
        { new: true }
    );

    return updatedCourse;
}

export async function getAveragesByCourseId(courseId) {
    const courseFound = await Course.findById(courseId);

    if (!courseFound) {
        return null;
    }

    const evaluationsInCourse = await Evaluation.find({ courseId });

    const evaluationIds = evaluationsInCourse.map((evaluation) => {
        return evaluation._id.toString();
    });

    const studentsInCourse = await Student.find({
        _id: { $in: courseFound.studentIds }
    });

    const averages = [];

    for (const student of studentsInCourse) {
        const grades = await Grade.find({
            studentId: student._id.toString(),
            evaluationId: { $in: evaluationIds }
        });

        let totalScore = 0;

        grades.forEach((grade) => {
            totalScore += grade.score;
        });

        const average = grades.length > 0 ? totalScore / grades.length : 0;

        averages.push({
            studentId: student._id,
            studentCode: student.studentCode,
            career: student.career,
            semester: student.semester,
            average,
            totalGrades: grades.length,
            grades
        });
    }

    return {
        courseId: courseFound._id,
        courseName: courseFound.name,
        courseCode: courseFound.code,
        totalStudents: studentsInCourse.length,
        averages
    };
}

export async function getEvaluationsByCourseId(courseId) {
    const evaluationsInCourse = await Evaluation.find({ courseId });
    return evaluationsInCourse;
}

export async function getCourseReport(courseId) {
    const evaluationsInCourse = await Evaluation.find({ courseId });
    let evaluations = [];
    const report = {
        courseId: courseId,
        totalEvaluations: evaluationsInCourse.length,
    };
    for(const evaluation of evaluationsInCourse) {
        const gradesIncourse = await Grade.find({evaluationId: evaluation._id});
        evaluations.push({
            evaluationId: evaluation._id,
            title: evaluation.title,
            description: evaluation.description,
            type: evaluation.type,
            date: evaluation.date,
            status: evaluation.status,
            grades: gradesIncourse
        });
    }

    report.evaluations = evaluations;
    return report;
}