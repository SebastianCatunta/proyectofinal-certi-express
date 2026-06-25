import {
    getEvaluations,
    createEvaluationInDB,
    getEvaluationById,
    deleteEvaluationInDB,
    updateEvaluationInDB
} from "../services/evaluationService.js";
export async function replaceEvaluation(req, res, next) {
    const { courseId, title, description, type, date, status } = req.body;

    const evaluationId = req.params.id;

    const evaluationFound = await getEvaluationById(evaluationId);
    if(!evaluationFound){
        const error = Error("Evaluation not found");
        error.statusCode = 404;
        return next(error);
    }  

    const updatedEvaluation = await updateEvaluationInDB(
        evaluationId,
        courseId,
        title,
        description,
        type,
        date,
        status
    );
    if (updatedEvaluation === -1) {
        const error = Error("Invalid courseId, course does not exist");
        error.statusCode = 400;
        return next(error);
    }

    if (updatedEvaluation === -2) {
        const error = Error("Cannot create evaluation in an inactive course");
        error.statusCode = 400;
        return next(error);
    }
    return res.success(200, "Evaluation updated successfully", updatedEvaluation);

}

export async function findEvaluations(req, res, next) {
    const evaluationsList = await getEvaluations();
    return res.success(200, "Evaluations found", evaluationsList);
}

export async function saveEvaluation(req, res, next) {
    const { courseId, title, description, type, date, status } = req.body;

    const newEvaluation = await createEvaluationInDB(
        courseId,
        title,
        description,
        type,
        date,
        status
    );

    if (newEvaluation === -1) {
        const error = Error("Invalid courseId, course does not exist");
        error.statusCode = 400;
        return next(error);
    }

    if (newEvaluation === -2) {
        const error = Error("Cannot create evaluation in an inactive course");
        error.statusCode = 400;
        return next(error);
    }

    return res.success(200, "Evaluation created successfully", newEvaluation);
}

export async function findEvaluationById(req, res, next) {
    const evaluationId = req.params.id;

    const evaluation = await getEvaluationById(evaluationId);

    if (!evaluation) {
        const error = Error("Evaluation not found");
        error.statusCode = 404;
        return next(error);
    }

    return res.success(200, "Evaluation found", evaluation);
}

export async function deleteEvaluationById(req, res, next) {
    const evaluationId = req.params.id;

    const evaluationFound = await getEvaluationById(evaluationId);

    if (!evaluationFound) {
        const error = Error("Evaluation not found");
        error.statusCode = 404;
        return next(error);
    }

    const deletedEvaluationResponse = await deleteEvaluationInDB(evaluationId);

    if (deletedEvaluationResponse.type === "deactivated") {
        return res.success(
            200,
            "Evaluation has grades, it was deactivated successfully",
            deletedEvaluationResponse.evaluation
        );
    }

    return res.success(
        200,
        "Evaluation deleted successfully",
        deletedEvaluationResponse.evaluation
    );
}