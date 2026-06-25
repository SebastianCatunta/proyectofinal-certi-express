import { Evaluation } from "../data/evaluations.js";
import { Course } from "../data/courses.js";
import { Grade } from "../data/grades.js";

export async function getEvaluations() {
    const evaluationsInDB = await Evaluation.find();
    return evaluationsInDB;
}

export async function createEvaluationInDB(courseId, title, description, type, date, status) {
    const courseFound = await Course.findById(courseId);

    if (!courseFound) {
        return -1;
    }

    if (courseFound.status === "inactive") {
        return -2;
    }

    const newEvaluation = await Evaluation.create({
        courseId,
        title,
        description,
        type,
        date,
        status
    });

    const responseEvaluation = {
        id: newEvaluation._id,
        courseId: newEvaluation.courseId,
        title: newEvaluation.title,
        description: newEvaluation.description,
        type: newEvaluation.type,
        date: newEvaluation.date,
        status: newEvaluation.status
    };

    return responseEvaluation;
}

export async function getEvaluationById(evaluationId) {
    const evaluationInDB = await Evaluation.findById(evaluationId);
    return evaluationInDB;
}

export async function deleteEvaluationInDB(evaluationId) {
    const gradesFound = await Grade.find({ evaluationId });

    if (gradesFound.length > 0) {
        const updatedEvaluation = await Evaluation.findByIdAndUpdate(
            evaluationId,
            { status: "inactive" },
            { new: true }
        );

        return {
            type: "deactivated",
            evaluation: updatedEvaluation
        };
    }

    const deletedEvaluation = await Evaluation.findByIdAndDelete(evaluationId);

    return {
        type: "deleted",
        evaluation: deletedEvaluation
    };
}

export async function updateEvaluationInDB(evaluationId, courseId, title, description, type, date, status) {
    const courseFound = await Course.findById(courseId);
    if(!courseFound) {
        return -1;
    }
    if (courseFound.status === "inactive") {
        return -2;
    }

    const updatedEvaluation = await Evaluation.findByIdAndUpdate(
        evaluationId,
        {
            courseId,
            title,
            description,
            type,
            date,
            status
        },
        { new: true }
    );

    const responseEvaluation = {
        id: updatedEvaluation._id,
        courseId: updatedEvaluation.courseId,
        title: updatedEvaluation.title,
        description: updatedEvaluation.description,
        type: updatedEvaluation.type,
        date: updatedEvaluation.date,
        status: updatedEvaluation.status
    };
    return responseEvaluation;
}