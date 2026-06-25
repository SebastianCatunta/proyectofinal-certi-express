import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema({
    courseId: String,
    title: String,
    description: String,
    type: String,
    date: String,
    status: String
});

export const Evaluation = mongoose.model("Evaluation", evaluationSchema);