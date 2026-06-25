import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: String,
    description: String,
    code: Number,
    teacherId: String,
    studentIds: [String],
    status: String
});

export const Course = mongoose.model("Course", courseSchema);