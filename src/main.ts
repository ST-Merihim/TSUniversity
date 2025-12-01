// ----- Enum-и -----

enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

enum Semester {
    First = "First",
    Second = "Second"
}

enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}

// ----- Інтерфейси -----

interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

interface GradeRecord {
    studentId: number;
    courseId: number;
    grade: Grade;
    date: Date;
    semester: Semester;
}

// ----- Клас -----

class UniversityManagementSystem {
    private students: Map<number, Student> = new Map();
    private courses: Map<number, Course> = new Map();
    private studentCourses: Map<number, Set<number>> = new Map(); // studentId -> courseIds
    private courseStudents: Map<number, Set<number>> = new Map(); // courseId -> studentIds
    private grades: GradeRecord[] = [];

    private nextStudentId = 1;
    private nextCourseId = 1;

    // ---- Хелпери ----

    private getStudent(studentId: number): Student | undefined {
        return this.students.get(studentId);
    }

    private getCourse(courseId: number): Course | undefined {
        return this.courses.get(courseId);
    }

    private ensureStudentSet(studentId: number): Set<number> {
        const existing = this.studentCourses.get(studentId);
        if (existing) return existing;
        const created = new Set<number>();
        this.studentCourses.set(studentId, created);
        return created;
    }

    private ensureCourseSet(courseId: number): Set<number> {
        const existing = this.courseStudents.get(courseId);
        if (existing) return existing;
        const created = new Set<number>();
        this.courseStudents.set(courseId, created);
        return created;
    }

    private isStudentRegistered(studentId: number, courseId: number): boolean {
        const set = this.studentCourses.get(studentId);
        return set ? set.has(courseId) : false;
    }

    // ---- Публічні методи ----

    public enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = {
            ...student,
            id: this.nextStudentId++
        };
        this.students.set(newStudent.id, newStudent);
        return newStudent;
    }

    // Додатковий метод: створити курс (зручно для тестів)
    public addCourse(course: Omit<Course, "id">): Course {
        const newCourse: Course = {
            ...course,
            id: this.nextCourseId++
        };
        this.courses.set(newCourse.id, newCourse);
        return newCourse;
    }

    public registerForCourse(studentId: number, courseId: number): void {
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
            console.error(
                `Студент зі статусом ${student.status} не може реєструватися на курси.`
            );
            return;
        }

        if (student.faculty !== course.faculty) {
            console.error(
                "Факультет студента не відповідає факультету курсу:",
                student.faculty,
                course.faculty
            );
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

    public setGrade(
        studentId: number,
        courseId: number,
        grade: Grade
    ): void {
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

        const record: GradeRecord = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester
        };

        const idx = this.grades.findIndex(
            (g: GradeRecord): boolean =>
                g.studentId === studentId &&
                g.courseId === courseId &&
                g.semester === course.semester
        );

        if (idx !== -1) {
            this.grades[idx] = record;
        } else {
            this.grades.push(record);
        }
    }

    public updateStudentStatus(
        studentId: number,
        newStatus: StudentStatus
    ): void {
        const student = this.getStudent(studentId);
        if (!student) {
            console.error("updateStudentStatus: студент не знайдений");
            return;
        }

        if (
            (student.status === StudentStatus.Graduated ||
                student.status === StudentStatus.Expelled) &&
            newStatus === StudentStatus.Active
        ) {
            console.error(
                "Неможливо повернути студента зі статусу Graduated/Expelled в Active."
            );
            return;
        }

        student.status = newStatus;
    }

    public getStudentsByFaculty(faculty: Faculty): Student[] {
        const result: Student[] = [];
        for (const student of this.students.values()) {
            if (student.faculty === faculty) {
                result.push(student);
            }
        }
        return result;
    }

    public getStudentGrades(studentId: number): GradeRecord[] {
        return this.grades.filter(
            (g: GradeRecord): boolean => g.studentId === studentId
        );
    }

    public getAvailableCourses(
        faculty: Faculty,
        semester: Semester
    ): Course[] {
        const result: Course[] = [];
        for (const course of this.courses.values()) {
            if (course.faculty !== faculty || course.semester !== semester) continue;
            const studentsForCourse = this.courseStudents.get(course.id);
            const count = studentsForCourse ? studentsForCourse.size : 0;
            if (count < course.maxStudents) {
                result.push(course);
            }
        }
        return result;
    }

    public calculateAverageGrade(studentId: number): number {
        const records = this.getStudentGrades(studentId);
        if (records.length === 0) return 0;

        const sum = records.reduce(
            (acc: number, r: GradeRecord): number => acc + r.grade,
            0
        );
        const avg = sum / records.length;
        return Math.round(avg * 100) / 100;
    }

    // Додатково: список "відмінників" по факультету (avg >= 4.5)
    public getHonorsStudentsByFaculty(faculty: Faculty): Student[] {
        const studentsOfFaculty = this.getStudentsByFaculty(faculty);
        return studentsOfFaculty.filter((st: Student): boolean => {
            const avg = this.calculateAverageGrade(st.id);
            return avg >= 4.5;
        });
    }
}

// ----- Приклад використання -----

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
console.log(
    "Відмінники CS:",
    ums.getHonorsStudentsByFaculty(Faculty.Computer_Science)
);
console.log(
    "Доступні CS курси (First):",
    ums.getAvailableCourses(Faculty.Computer_Science, Semester.First)
);
