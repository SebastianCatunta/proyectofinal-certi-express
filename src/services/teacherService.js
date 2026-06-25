import { Teacher } from "../data/teachers.js";
import { User } from "../data/users.js";
import { Course } from "../data/courses.js";

export async function getTeachers() {
    const teachersInDB = await Teacher.find();
    return teachersInDB;
}

export async function getTeacherById(teacherId) {
    const teacherInDB = await Teacher.findById(teacherId);
    return teacherInDB;
}

export async function createTeacherInDB(userId, teacherCode, subjectsCanTeach) {
    const userFound = await User.findById(userId);

    if (!userFound) {
        return -1;
    }

    if (userFound.role !== "teacher") {
        return -2;
    }

    const teacherFound = await Teacher.find({ userId });

    if (teacherFound.length > 0) {
        return null;
    }

    const newTeacher = await Teacher.create({
        userId,
        teacherCode,
        subjectsCanTeach
    });

    const responseTeacher = {
        id: newTeacher._id,
        userId: newTeacher.userId,
        teacherCode: newTeacher.teacherCode,
        subjectsCanTeach: newTeacher.subjectsCanTeach
    };

    return responseTeacher;
}

export async function updateTeacherInDB(teacherId, userId, teacherCode, subjectsCanTeach) {
    const userFound = await User.findById(userId);

    if (!userFound) {
        return -1;
    }

    const teacherFound = await Teacher.findOne({ userId });

    if (teacherFound && teacherFound._id.toString() !== teacherId) {
        return null;
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
        teacherId,
        { userId, teacherCode, subjectsCanTeach },
        { new: true }
    );

    return updatedTeacher;
}

export async function deleteTeacherInDB(teacherId) {
    const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
    return deletedTeacher;
}
export async function getCoursesByTeacherId(teacherId) {
    const coursesInDB = await Course.find({ teacherId });
    return coursesInDB;
}