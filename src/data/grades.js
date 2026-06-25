import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
    studentId: String,
    evaluationId: String,
    score: Number,
    observation: String,
    dateRegistered: String,
    status: String
});

export const Grade = mongoose.model("Grade", gradeSchema);