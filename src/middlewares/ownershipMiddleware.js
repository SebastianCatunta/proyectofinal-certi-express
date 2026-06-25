import { Student } from "../data/students.js";
import { Teacher } from "../data/teachers.js";
import { Course } from "../data/courses.js";
import { Grade } from "../data/grades.js";
import { Evaluation } from "../data/evaluations.js";

export async function ownStudentResource(
  req,
  res,
  next
) {

  try {

    if (req.user.role === "admin") {
      return next();
    }

    const student = await Student.findById(
      req.params.id
    );

    if (!student) {
      const error = Error("Student not found");
      error.statusCode = 404;
      return next(error);
    }

    if (student.userId !== req.user.userId) {
      const error = Error("Access denied");
      error.statusCode = 403;
      return next(error);
    }

    next();

  } catch (error) {
    next(error);
  }

}

export async function ownTeacherResource(
  req,
  res,
  next
) {

  try {

    if (req.user.role === "admin") {
      return next();
    }

    const teacher = await Teacher.findById(
      req.params.id
    );

    if (!teacher) {
      const error = Error("Teacher not found");
      error.statusCode = 404;
      return next(error);
    }

    if (teacher.userId !== req.user.userId) {
      const error = Error("Access denied");
      error.statusCode = 403;
      return next(error);
    }

    next();

  } catch (error) {
    next(error);
  }

}

export async function ownCourseTeacher(
  req,
  res,
  next
) {

  try {

    if (req.user.role === "admin") {
      return next();
    }

    const teacher = await Teacher.findOne({
      userId: req.user.userId
    });

    const course = await Course.findById(
      req.params.id
    );

    if (!teacher || !course) {
      const error = Error("Resource not found");
      error.statusCode = 404;
      return next(error);
    }

    if (course.teacherId !== teacher._id.toString()) {
      const error = Error("Access denied");
      error.statusCode = 403;
      return next(error);
    }

    next();

  } catch (error) {
    next(error);
  }

}

export async function ownEvaluationTeacher(
  req,
  res,
  next
) {

  try {

    if (req.user.role === "admin") {
      return next();
    }

    const teacher = await Teacher.findOne({
      userId: req.user.userId
    });

    const evaluation =
      await Evaluation.findById(
        req.params.id
      );

    if (!teacher || !evaluation) {
      const error = Error("Resource not found");
      error.statusCode = 404;
      return next(error);
    }

    const course =
      await Course.findById(
        evaluation.courseId
      );

    if (!course) {
      const error = Error("Course not found");
      error.statusCode = 404;
      return next(error);
    }

    if (
      course.teacherId !==
      teacher._id.toString()
    ) {
      const error = Error("Access denied");
      error.statusCode = 403;
      return next(error);
    }

    next();

  } catch (error) {
    next(error);
  }

}

export async function ownGradeResource(
  req,
  res,
  next
) {

  try {

    if (req.user.role === "admin") {
      return next();
    }

    const grade = await Grade.findById(
      req.params.id
    );

    if (!grade) {
      const error = Error("Grade not found");
      error.statusCode = 404;
      return next(error);
    }

    const student =
      await Student.findById(
        grade.studentId
      );

    if (!student) {
      const error = Error("Student not found");
      error.statusCode = 404;
      return next(error);
    }

    if (
      student.userId !==
      req.user.userId
    ) {
      const error = Error("Access denied");
      error.statusCode = 403;
      return next(error);
    }

    next();

  } catch (error) {
    next(error);
  }

}

export async function ownEvaluationCourseTeacher(
  req,
  res,
  next
) {

  try {

    if (req.user.role === "admin") {
      return next();
    }

    let evaluationId = req.body.evaluationId;

    if (!evaluationId && req.params.id) {
      const grade = await Grade.findById(req.params.id);

      if (!grade) {
        const error = Error("Grade not found");
        error.statusCode = 404;
        return next(error);
      }

      evaluationId = grade.evaluationId;
    }

    const evaluation = await Evaluation.findById(evaluationId);

    if (!evaluation) {
      const error = Error("Evaluation not found");
      error.statusCode = 404;
      return next(error);
    }

    const course =
      await Course.findById(
        evaluation.courseId
      );

    if (!course) {
      const error = Error("Course not found");
      error.statusCode = 404;
      return next(error);
    }

    const teacher =
      await Teacher.findOne({
        userId: req.user.userId
      });

    if (!teacher) {
      const error = Error("Teacher not found");
      error.statusCode = 404;
      return next(error);
    }

    if (
      course.teacherId !==
      teacher._id.toString()
    ) {
      const error = Error("Access denied");
      error.statusCode = 403;
      return next(error);
    }

    next();

  } catch (error) {
    next(error);
  }

}

export async function studentEnrolledInCourse(
  req,
  res,
  next
) {

  try {

    if (
      req.user.role === "admin" ||
      req.user.role === "teacher"
    ) {
      return next();
    }

    const student =
      await Student.findOne({
        userId: req.user.userId
      });

    if (!student) {
      const error = Error("Student not found");
      error.statusCode = 404;
      return next(error);
    }

    const course =
      await Course.findById(
        req.params.id
      );

    if (!course) {
      const error = Error("Course not found");
      error.statusCode = 404;
      return next(error);
    }

    const isEnrolled =
      course.studentIds.includes(
        student._id.toString()
      );

    if (!isEnrolled) {
      const error = Error("Access denied");
      error.statusCode = 403;
      return next(error);
    }

    next();

  } catch (error) {
    next(error);
  }

}

export async function ownCourseFromBody(req, res, next) {
  try {
    if (req.user.role === "admin") {
      return next();
    }

    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return next(Object.assign(new Error("Course not found"), { statusCode: 404 }));
    }

    
    if (req.user.role === "student") {

      const student = await Student.findOne({
        userId: req.user.userId
      });

      if (!student) {
        return next(Object.assign(new Error("Student not found"), { statusCode: 404 }));
      }

      const isEnrolled = course.studentIds
        .map(id => id.toString())
        .includes(student._id.toString());

      if (!isEnrolled) {
        return next(Object.assign(new Error("Not enrolled in this course"), { statusCode: 403 }));
      }
    }

    
    if (req.user.role === "teacher") {

      const teacher = await Teacher.findOne({
        userId: req.user.userId
      });

      if (!teacher) {
        return next(Object.assign(new Error("Teacher not found"), { statusCode: 404 }));
      }

      if (course.teacherId !== teacher._id.toString()) {
        return next(Object.assign(new Error("Not your course"), { statusCode: 403 }));
      }
    }

    next();

  } catch (err) {
    next(err);
  }
}