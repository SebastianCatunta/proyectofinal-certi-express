import { 
    getTeachers, 
    getTeacherById, 
    createTeacherInDB,
    updateTeacherInDB,
    getCoursesByTeacherId,
    deleteTeacherInDB
} from "../services/teacherService.js";

export async function findTeachers(req, res, next) {
    let teachersList = await getTeachers();
    return res.success(200, "Teachers found", teachersList);
}

export async function saveTeacher(req, res, next) {
    const { userId, teacherCode, subjectsCanTeach } = req.body;

    const newTeacher = await createTeacherInDB(userId, teacherCode, subjectsCanTeach);

    if (newTeacher === null) {
        const error = Error("Teacher with the same userId already exists");
        error.statusCode = 400;
        return next(error);
    }

    if (newTeacher === -1) {
        const error = Error("Invalid userId, user does not exist");
        error.statusCode = 400;
        return next(error);
    }

    if (newTeacher === -2) {
        const error = Error("The user must have teacher role");
        error.statusCode = 400;
        return next(error);
    }

    return res.success(200, "Teacher created successfully", newTeacher);
}

export async function findTeacherById(req, res, next) {
    const teacherId = req.params.id;

    const teacher = await getTeacherById(teacherId);

    if (!teacher) {
        const error = Error("Teacher not found");
        error.statusCode = 404;
        return next(error);
    }

    return res.success(200, "Teacher found", teacher);
}

export async function replaceTeacherById(req, res, next) {
    const teacherId = req.params.id;

    const teacherFound = await getTeacherById(teacherId);

    if (!teacherFound) {
        const error = Error("Teacher not found");
        error.statusCode = 404;
        return next(error);
    }

    const { userId, teacherCode, subjectsCanTeach } = req.body;

    const updatedTeacher = await updateTeacherInDB(teacherId, userId, teacherCode, subjectsCanTeach);

    if (updatedTeacher === null) {
        const error = Error("Teacher with the same userId already exists");
        error.statusCode = 400;
        return next(error);
    }

    if (updatedTeacher === -1) {
        const error = Error("Invalid userId, user does not exist");
        error.statusCode = 400;
        return next(error);
    }

    return res.success(200, "Teacher updated successfully", updatedTeacher);
}

export async function deleteTeacherById(req, res, next){
    const teacherId = req.params.id;
    const teacherFound = await getTeacherById(teacherId); 
    if(!teacherFound){
        const error = Error("Teacher not found");
        error.statusCode = 404;
        return next(error);
    }
       const deletedTeacher = await deleteTeacherInDB(teacherId);
    return res.success(200, "Teacher deleted successfully", teacherFound);
}

export async function findCoursesByTeacher(req, res, next) {
    const teacherId = req.params.id;

    const teacherFound = await getTeacherById(teacherId);

    if (!teacherFound) {
        const error = Error("Teacher not found");
        error.statusCode = 404;
        return next(error);
    }

    const courses = await getCoursesByTeacherId(teacherId);

    return res.success(200, "Teacher courses found", courses);
}
