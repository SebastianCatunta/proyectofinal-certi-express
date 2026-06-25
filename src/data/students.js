import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    userId: String,
    studentCode: Number,
    career: String,
    semester: Number
});

export const Student = mongoose.model("Student", studentSchema);