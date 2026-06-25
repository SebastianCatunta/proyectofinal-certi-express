import { Grade } from "../data/grades.js";
import { Student } from "../data/students.js";
import { Evaluation } from "../data/evaluations.js";
import { Course } from "../data/courses.js";

export async function createGradeInDB(studentId, evaluationId, score, observation, dateRegistered, status) {
    const studentFound = await Student.findById(studentId);

    if (!studentFound) {
        return -1;
    }

    const evaluationFound = await Evaluation.findById(evaluationId);

    if (!evaluationFound) {
        return -2;
    }

    const courseFound = await Course.findById(evaluationFound.courseId);

    if (!courseFound) {
        return -3;
    }

    const isStudentInCourse = courseFound.studentIds.includes(studentId);

    if (!isStudentInCourse) {
        return -4;
    }

    const gradeFound = await Grade.find({
        studentId,
        evaluationId
    });

    if (gradeFound.length > 0) {
        return null;
    }

    if (score < 0 || score > 100) {
        return -5;
    }

    const newGrade = await Grade.create({
        studentId,
        evaluationId,
        score,
        observation,
        dateRegistered,
        status
    });

    const responseGrade = {
        id: newGrade._id,
        studentId: newGrade.studentId,
        evaluationId: newGrade.evaluationId,
        score: newGrade.score,
        observation: newGrade.observation,
        dateRegistered: newGrade.dateRegistered,
        status: newGrade.status
    };

    return responseGrade;
}

export async function getGrades() {
    const gradesInDB = await Grade.find();
    return gradesInDB;
}

export async function getGradeById(gradeId) {
    const gradeInDB = await Grade.findById(gradeId);
    return gradeInDB;
}

export async function updateGradeInDB(gradeId, studentId, evaluationId, score, observation, dateRegistered, status) {
    const studentFound = await Student.findById(studentId);

    if (!studentFound) {
        return -1;
    }

    const evaluationFound = await Evaluation.findById(evaluationId);

    if (!evaluationFound) {
        return -2;
    }

    const courseFound = await Course.findById(evaluationFound.courseId);

    if (!courseFound) {
        return -3;
    }

    const isStudentInCourse = courseFound.studentIds.includes(studentId);

    if (!isStudentInCourse) {
        return -4;
    }

    const gradeFound = await Grade.findOne({
        studentId,
        evaluationId
    });

    if (gradeFound && gradeFound._id.toString() !== gradeId) {
        return null;
    }

    if (score < 0 || score > 100) {
        return -5;
    }

    const updatedGrade = await Grade.findByIdAndUpdate(
        gradeId,
        {
            studentId,
            evaluationId,
            score,
            observation,
            dateRegistered,
            status
        },
        { new: true }
    );

    return updatedGrade;
}

export async function updateGradeObservationInDB(gradeId, observation) {
    const updatedGrade = await Grade.findByIdAndUpdate(
        gradeId,
        { observation },
        { new: true }
    );

    return updatedGrade;
}