import { 
    getGradeById,
    createGradeInDB,
    getGrades,
    updateGradeInDB,
    updateGradeObservationInDB
 } from "../services/gradeService.js";

export async function findGradeById(req, res, next) {
    const { id } = req.params;
    const grade = await getGradeById(id);
    if(!grade){
        const error = new Error("Grade not found");
        error.status = 404;
        return next(error);
    }   
    return res.success(200, "Grade found", grade);
}

export async function saveGrade(req, res, next) {
    const { studentId, evaluationId, score, observation, dateRegistered, status } = req.body;

    const newGrade = await createGradeInDB(
        studentId,
        evaluationId,
        score,
        observation,
        dateRegistered,
        status
    );

    if (newGrade === null) {
        const error = Error("Grade for this student and evaluation already exists");
        error.statusCode = 400;
        return next(error);
    }

    if (newGrade === -1) {
        const error = Error("Invalid studentId, student does not exist");
        error.statusCode = 400;
        return next(error);
    }

    if (newGrade === -2) {
        const error = Error("Invalid evaluationId, evaluation does not exist");
        error.statusCode = 400;
        return next(error);
    }

    if (newGrade === -3) {
        const error = Error("Course related to this evaluation does not exist");
        error.statusCode = 400;
        return next(error);
    }

    if (newGrade === -4) {
        const error = Error("Student is not enrolled in the course of this evaluation");
        error.statusCode = 400;
        return next(error);
    }

    if (newGrade === -5) {
        const error = Error("Score must be between 0 and 100");
        error.statusCode = 400;
        return next(error);
    }
    
    if(newGrade.score > 50){
        return res.success(200, "Grade created successfully", newGrade);
    }
    try {
        
        const accountSid = process.env.TWILIO_ACCOUNT_SID; 
        const authToken = process.env.TWILIO_AUTH_TOKEN;   
        const from = process.env.TWILIO_PHONE_NUMBER;     

        if (!accountSid || !authToken || !from) {
            return res.success(200, "Grade created successfully. Alert because of bad grade: Twilio is not configured.", newGrade);
        }

        const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

        const bodyForm = qs.stringify({
        To: to,
        From: from,
        Body: body
        });

        const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

        const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${basicAuth}`
        },
        body: bodyForm
        });

        if (!response.ok) {
        const text = await response.text();
        return res.success(200, "Grade created successfully. Alert because of bad grade: Twilio API error.", newGrade);
        }

        const data = await response.json();
        return res.success(200, "Grade created successfully. Alert because of bad grade: SMS sent successfully.", newGrade);
    } catch (error) {
        return res.success(200, "Grade created successfully. Alert because of bad grade: Twilio API error.", newGrade);
    }
}

export async function findGrades(req, res, next) {
    const gradesList = await getGrades();
    return res.success(200, "Grades found", gradesList);
}

export async function replaceGradeById(req, res, next) {
    const gradeId = req.params.id;

    const gradeFound = await getGradeById(gradeId);

    if (!gradeFound) {
        const error = Error("Grade not found");
        error.statusCode = 404;
        return next(error);
    }

    const { studentId, evaluationId, score, observation, dateRegistered, status } = req.body;

    const updatedGrade = await updateGradeInDB(
        gradeId,
        studentId,
        evaluationId,
        score,
        observation,
        dateRegistered,
        status
    );

    if (updatedGrade === null) {
        const error = Error("Grade for this student and evaluation already exists");
        error.statusCode = 400;
        return next(error);
    }

    if (updatedGrade === -1) {
        const error = Error("Invalid studentId, student does not exist");
        error.statusCode = 400;
        return next(error);
    }

    if (updatedGrade === -2) {
        const error = Error("Invalid evaluationId, evaluation does not exist");
        error.statusCode = 400;
        return next(error);
    }

    if (updatedGrade === -3) {
        const error = Error("Course related to this evaluation does not exist");
        error.statusCode = 400;
        return next(error);
    }

    if (updatedGrade === -4) {
        const error = Error("Student is not enrolled in the course of this evaluation");
        error.statusCode = 400;
        return next(error);
    }

    if (updatedGrade === -5) {
        const error = Error("Score must be between 0 and 100");
        error.statusCode = 400;
        return next(error);
    }

    return res.success(200, "Grade updated successfully", updatedGrade);
}

export async function updateObservationByGradeId(req, res, next) {
    const gradeId = req.params.id;
    const { observation } = req.body;

    const gradeFound = await getGradeById(gradeId);

    if (!gradeFound) {
        const error = Error("Grade not found");
        error.statusCode = 404;
        return next(error);
    }

    const updatedGrade = await updateGradeObservationInDB(gradeId, observation);

    return res.success(200, "Grade observation updated successfully", updatedGrade);
}