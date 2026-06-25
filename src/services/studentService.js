import { Student } from "../data/students.js";
import { User } from "../data/users.js";
import { Course } from "../data/courses.js";
import { Evaluation } from "../data/evaluations.js";
import { Grade } from "../data/grades.js";

export async function getStudents() {
    const studentsInDB = await Student.find();
    return studentsInDB;
}

export async function getStudentById(studentId) {
    const studentInDB = await Student.findById(studentId);
    return studentInDB;
}

export async function getEvaluationsByStudentAndCourse(studentId, courseId) {
    const courseFound = await Course.findById(courseId);

    if (!courseFound) {
        return -1;
    }

    const isStudentInCourse = courseFound.studentIds.some((id) => {
        return id.toString() === studentId.toString();
    });

    if (!isStudentInCourse) {
        return -2;
    }

    const evaluationsInCourse = await Evaluation.find({ courseId });

    return evaluationsInCourse;
}

export async function createStudentInDB(userId, studentCode, career, semester) {
    const userFound = await User.findById(userId);

    if (!userFound) {
        return -1;
    }

    if (userFound.role !== "student") {
        return -2;
    }

    const studentFound = await Student.find({ userId });

    if (studentFound.length > 0) {
        return null;
    }

    const newStudent = await Student.create({ 
        userId, 
        studentCode, 
        career, 
        semester 
    });

    const responseStudent = {
        id: newStudent._id,
        userId: newStudent.userId,
        studentCode: newStudent.studentCode,
        career: newStudent.career,
        semester: newStudent.semester
    };

    return responseStudent;
}

export async function updateStudentInDB(studentId, userId, studentCode, career, semester) {
    const userFound = await User.findById(userId);

    if (!userFound) {
        return -1;
    }

    const studentFound = await Student.findOne({ userId });

    if (studentFound && studentFound._id.toString() !== studentId) {
        return null;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        { userId, studentCode, career, semester },
        { new: true }
    );

    return updatedStudent;
}

export async function deleteStudentInDB(studentId) {
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    return deletedStudent;
}

export async function getCoursesByStudentId(studentId) {
    const coursesInDB = await Course.find({ studentIds: studentId });
    return coursesInDB;
}

export async function getGradesByStudentId(studentId) {
    const gradesInDB = await Grade.find({ studentId });
    return gradesInDB;
}

export async function getAverageByStudentAndCourse(studentId, courseId) {
    const courseFound = await Course.findById(courseId);

    if (!courseFound) {
        return -1;
    }

    const isStudentInCourse = courseFound.studentIds.includes(studentId);

    if (!isStudentInCourse) {
        return -2;
    }

    const evaluationsInCourse = await Evaluation.find({ courseId });

    const evaluationIds = evaluationsInCourse.map((evaluation) => {
        return evaluation._id.toString();
    });

    const gradesInCourse = await Grade.find({
        studentId,
        evaluationId: { $in: evaluationIds }
    });

    if (gradesInCourse.length === 0) {
        return {
            studentId,
            courseId,
            average: 0,
            totalGrades: 0,
            grades: []
        };
    }

    let totalScore = 0;

    gradesInCourse.forEach((grade) => {
        totalScore += grade.score;
    });

    const average = totalScore / gradesInCourse.length;

    return {
        studentId,
        courseId,
        average,
        totalGrades: gradesInCourse.length,
        grades: gradesInCourse
    };
}

export async function getGradesByStudentAndCourse(studentId, courseId) {
    const courseFound = await Course.findById(courseId);

    if (!courseFound) {
        return -1;
    }

    const isStudentInCourse = courseFound.studentIds.includes(studentId);

    if (!isStudentInCourse) {
        return -2;
    }

    const evaluationsInCourse = await Evaluation.find({ courseId });

    const evaluationIds = evaluationsInCourse.map((evaluation) => {
        return evaluation._id.toString();
    });

    const gradesInCourse = await Grade.find({
        studentId,
        evaluationId: { $in: evaluationIds }
    });
    
    return gradesInCourse;

}