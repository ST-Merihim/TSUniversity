"use strict";
// ----- Enum-и -----
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Active"] = "Active";
    StudentStatus["Academic_Leave"] = "Academic_Leave";
    StudentStatus["Graduated"] = "Graduated";
    StudentStatus["Expelled"] = "Expelled";
})(StudentStatus || (StudentStatus = {}));
var CourseType;
(function (CourseType) {
    CourseType["Mandatory"] = "Mandatory";
    CourseType["Optional"] = "Optional";
    CourseType["Special"] = "Special";
})(CourseType || (CourseType = {}));
var Semester;
(function (Semester) {
    Semester["First"] = "First";
    Semester["Second"] = "Second";
})(Semester || (Semester = {}));
var Grade;
(function (Grade) {
    Grade[Grade["Excellent"] = 5] = "Excellent";
    Grade[Grade["Good"] = 4] = "Good";
    Grade[Grade["Satisfactory"] = 3] = "Satisfactory";
    Grade[Grade["Unsatisfactory"] = 2] = "Unsatisfactory";
})(Grade || (Grade = {}));
var Faculty;
(function (Faculty) {
    Faculty["Computer_Science"] = "Computer_Science";
    Faculty["Economics"] = "Economics";
    Faculty["Law"] = "Law";
    Faculty["Engineering"] = "Engineering";
})(Faculty || (Faculty = {}));
// ----- Клас -----
class UniversityManagementSystem {
    constructor() {
        this.students = new Map();
        this.courses = new Map();
        this.studentCourses = new Map(); // studentId -> courseIds
        this.courseStudents = new Map(); // courseId -> studentIds
        this.grades = [];
        this.nextStudentId = 1;
        this.nextCourseId = 1;
    }
    // ---- Хелпери ----
    getStudent(studentId) {
        return this.students.get(studentId);
    }
    getCourse(courseId) {
        return this.courses.get(courseId);
    }
    ensureStudentSet(studentId) {
        const existing = this.studentCourses.get(studentId);
        if (existing)
            return existing;
        const created = new Set();
        this.studentCourses.set(studentId, created);
        return created;
    }
    ensureCourseSet(courseId) {
        const existing = this.courseStudents.get(courseId);
        if (existing)
            return existing;
        const created = new Set();
        this.courseStudents.set(courseId, created);
        return created;
    }
    isStudentRegistered(studentId, courseId) {
        const set = this.studentCourses.get(studentId);
        return set ? set.has(courseId) : false;
    }
    // ---- Публічні методи ----
    enrollStudent(student) {
        const newStudent = Object.assign(Object.assign({}, student), { id: this.nextStudentId++ });
        this.students.set(newStudent.id, newStudent);
        return newStudent;
    }
    // Додатковий метод: створити курс (зручно для тестів)
    addCourse(course) {
        const newCourse = Object.assign(Object.assign({}, course), { id: this.nextCourseId++ });
        this.courses.set(newCourse.id, newCourse);
        return newCourse;
    }
    registerForCourse(studentId, courseId) {
        const student = this.getStudent(studentId);
        const course = this.getCourse(courseId);
        if (!student) {
            console.error("Студент не знайдений:", studentId);
            return;
        }
        if (!course) {
            console.error("Курс не знайдений:", courseId);
            return;
        }
        if (student.status !== StudentStatus.Active) {
            console.error(`Студент зі статусом ${student.status} не може реєструватися на курси.`);
            return;
        }
        if (student.faculty !== course.faculty) {
            console.error("Факультет студента не відповідає факультету курсу:", student.faculty, course.faculty);
            return;
        }
        const courseSet = this.ensureCourseSet(courseId);
        if (courseSet.size >= course.maxStudents) {
            console.error("Курс уже заповнений.");
            return;
        }
        if (this.isStudentRegistered(studentId, courseId)) {
            console.warn("Студент вже зареєстрований на цей курс.");
            return;
        }
        courseSet.add(studentId);
        const studentSet = this.ensureStudentSet(studentId);
        studentSet.add(courseId);
    }
    setGrade(studentId, courseId, grade) {
        const student = this.getStudent(studentId);
        const course = this.getCourse(courseId);
        if (!student || !course) {
            console.error("setGrade: некоректний studentId або courseId.");
            return;
        }
        if (!this.isStudentRegistered(studentId, courseId)) {
            console.error("setGrade: студент не зареєстрований на курс.");
            return;
        }
        const record = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester
        };
        const idx = this.grades.findIndex((g) => g.studentId === studentId &&
            g.courseId === courseId &&
            g.semester === course.semester);
        if (idx !== -1) {
            this.grades[idx] = record;
        }
        else {
            this.grades.push(record);
        }
    }
    updateStudentStatus(studentId, newStatus) {
        const student = this.getStudent(studentId);
        if (!student) {
            console.error("updateStudentStatus: студент не знайдений");
            return;
        }
        if ((student.status === StudentStatus.Graduated ||
            student.status === StudentStatus.Expelled) &&
            newStatus === StudentStatus.Active) {
            console.error("Неможливо повернути студента зі статусу Graduated/Expelled в Active.");
            return;
        }
        student.status = newStatus;
    }
    getStudentsByFaculty(faculty) {
        const result = [];
        for (const student of this.students.values()) {
            if (student.faculty === faculty) {
                result.push(student);
            }
        }
        return result;
    }
    getStudentGrades(studentId) {
        return this.grades.filter((g) => g.studentId === studentId);
    }
    getAvailableCourses(faculty, semester) {
        const result = [];
        for (const course of this.courses.values()) {
            if (course.faculty !== faculty || course.semester !== semester)
                continue;
            const studentsForCourse = this.courseStudents.get(course.id);
            const count = studentsForCourse ? studentsForCourse.size : 0;
            if (count < course.maxStudents) {
                result.push(course);
            }
        }
        return result;
    }
    calculateAverageGrade(studentId) {
        const records = this.getStudentGrades(studentId);
        if (records.length === 0)
            return 0;
        const sum = records.reduce((acc, r) => acc + r.grade, 0);
        const avg = sum / records.length;
        return Math.round(avg * 100) / 100;
    }
    // Додатково: список "відмінників" по факультету (avg >= 4.5)
    getHonorsStudentsByFaculty(faculty) {
        const studentsOfFaculty = this.getStudentsByFaculty(faculty);
        return studentsOfFaculty.filter((st) => {
            const avg = this.calculateAverageGrade(st.id);
            return avg >= 4.5;
        });
    }
}
// ----- Приклад використання (можна закоментувати перед здачею) -----
const ums = new UniversityManagementSystem();
const csCourse = ums.addCourse({
    name: "TypeScript для початківців",
    type: CourseType.Mandatory,
    credits: 4,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 2
});
const s1 = ums.enrollStudent({
    fullName: "Юлія Здравоненко",
    faculty: Faculty.Computer_Science,
    year: 2,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2023-09-01"),
    groupNumber: "CS-21"
});
const s2 = ums.enrollStudent({
    fullName: "Іван Іванов",
    faculty: Faculty.Computer_Science,
    year: 2,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2023-09-01"),
    groupNumber: "CS-21"
});
ums.registerForCourse(s1.id, csCourse.id);
ums.registerForCourse(s2.id, csCourse.id);
// Третій студент не потрапить через ліміт maxStudents
const s3 = ums.enrollStudent({
    fullName: "Марія Петрова",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2024-09-01"),
    groupNumber: "CS-11"
});
ums.registerForCourse(s3.id, csCourse.id);
ums.setGrade(s1.id, csCourse.id, Grade.Excellent);
ums.setGrade(s2.id, csCourse.id, Grade.Good);
console.log("Середній бал s1:", ums.calculateAverageGrade(s1.id));
console.log("Середній бал s2:", ums.calculateAverageGrade(s2.id));
console.log("Відмінники CS:", ums.getHonorsStudentsByFaculty(Faculty.Computer_Science));
console.log("Доступні CS курси (First):", ums.getAvailableCourses(Faculty.Computer_Science, Semester.First));
