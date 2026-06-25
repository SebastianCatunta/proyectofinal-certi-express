import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    userId: String,
    teacherCode: Number,
    subjectsCanTeach: [String]
});

export const Teacher = mongoose.model("Teacher", teacherSchema);