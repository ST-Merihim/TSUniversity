// ---- Типи ----

export type DayOfWeek =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday";

export type TimeSlot =
    | "8:30-10:00"
    | "10:15-11:45"
    | "12:15-13:45"
    | "14:00-15:30"
    | "15:45-17:15";

export type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

export type Professor = {
    id: number;
    name: string;
    department: string;
};

export type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

export type Course = {
    id: number;
    name: string;
    type: CourseType;
};

export type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

export type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

// ---- "База" в пам'яті ----

const professors: Professor[] = [];
const classrooms: Classroom[] = [];
const courses: Course[] = [];
const schedule: Lesson[] = [];
const lessonIds: number[] = [];

let profCounter: number = 1;
let courseCounter: number = 1;
let lessonCounter: number = 1;

// ---- Додаткові хелпери ----

function findLessonIndexById(id: number): number {
    return lessonIds.indexOf(id);
}

function hasProfessorConflict(lesson: Lesson): Lesson | null {
    for (let i = 0; i < schedule.length; i++) {
        const current = schedule[i];
        if (
            current.professorId === lesson.professorId &&
            current.dayOfWeek === lesson.dayOfWeek &&
            current.timeSlot === lesson.timeSlot
        ) {
            return current;
        }
    }
    return null;
}

function hasClassroomConflict(lesson: Lesson): Lesson | null {
    for (let i = 0; i < schedule.length; i++) {
        const current = schedule[i];
        if (
            current.classroomNumber === lesson.classroomNumber &&
            current.dayOfWeek === lesson.dayOfWeek &&
            current.timeSlot === lesson.timeSlot
        ) {
            return current;
        }
    }
    return null;
}

// ---- API для наповнення даними ----

export function addProfessorRaw(prof: Omit<Professor, "id">): Professor {
    const created: Professor = { ...prof, id: profCounter++ };
    professors.push(created);
    return created;
}

export function addCourseRaw(course: Omit<Course, "id">): Course {
    const created: Course = { ...course, id: courseCounter++ };
    courses.push(created);
    return created;
}

export function addClassroomRaw(room: Classroom): void {
    const exists = classrooms.some(
        (c: Classroom): boolean => c.number === room.number
    );
    if (!exists) classrooms.push(room);
}

// ---- Валідація та додавання уроку ----

export function validateLesson(lesson: Lesson): ScheduleConflict | null {
    const professorConflict = hasProfessorConflict(lesson);
    if (professorConflict) {
        return {
            type: "ProfessorConflict",
            lessonDetails: professorConflict
        };
    }

    const classroomConflict = hasClassroomConflict(lesson);
    if (classroomConflict) {
        return {
            type: "ClassroomConflict",
            lessonDetails: classroomConflict
        };
    }

    return null;
}

export function addLesson(lesson: Lesson): boolean {
    const conflict = validateLesson(lesson);
    if (conflict) {
        console.warn("Конфлікт при додаванні уроку:", conflict.type);
        return false;
    }
    schedule.push(lesson);
    lessonIds.push(lessonCounter++);
    return true;
}

// ---- Пошук / фільтрація ----

export function findAvailableClassrooms(
    timeSlot: TimeSlot,
    dayOfWeek: DayOfWeek
): string[] {
    const busyNumbers: string[] = [];

    for (const lesson of schedule) {
        if (lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek) {
            busyNumbers.push(lesson.classroomNumber);
        }
    }

    const freeNumbers: string[] = [];
    for (const room of classrooms) {
        if (busyNumbers.indexOf(room.number) === -1) {
            freeNumbers.push(room.number);
        }
    }

    return freeNumbers;
}

export function getProfessorSchedule(professorId: number): Lesson[] {
    const result: Lesson[] = [];
    for (const lesson of schedule) {
        if (lesson.professorId === professorId) {
            result.push(lesson);
        }
    }
    return result;
}

// ---- Аналіз ----

const allDays: DayOfWeek[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];

const allSlots: TimeSlot[] = [
    "8:30-10:00",
    "10:15-11:45",
    "12:15-13:45",
    "14:00-15:30",
    "15:45-17:15"
];

export function getClassroomUtilization(
    classroomNumber: string
): number {
    const maxLessons = allDays.length * allSlots.length;
    if (maxLessons === 0) return 0;

    let used = 0;
    for (const lesson of schedule) {
        if (lesson.classroomNumber === classroomNumber) {
            used++;
        }
    }

    const percent = (used / maxLessons) * 100;
    return Math.round(percent);
}

export function getMostPopularCourseType(): CourseType {
    const counts: { [key in CourseType]: number } = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0
    };

    for (const lesson of schedule) {
        const course = courses.find(
            (c: Course): boolean => c.id === lesson.courseId
        );
        if (!course) continue;
        counts[course.type]++;
    }

    let bestType: CourseType = "Lecture";
    let bestCount = counts[bestType];

    const types: CourseType[] = ["Lecture", "Seminar", "Lab", "Practice"];
    for (const type of types) {
        if (counts[type] > bestCount) {
            bestType = type;
            bestCount = counts[type];
        }
    }

    return bestType;
}

// ---- Модифікація ----

export function reassignClassroom(
    lessonId: number,
    newClassroomNumber: string
): boolean {
    const idx = findLessonIndexById(lessonId);
    if (idx === -1) {
        console.warn("Урок з таким id не знайдено:", lessonId);
        return false;
    }

    const currentLesson: Lesson = schedule[idx];
    const updatedLesson: Lesson = {
        ...currentLesson,
        classroomNumber: newClassroomNumber
    };

    const conflict = validateLesson(updatedLesson);
    if (conflict) {
        console.warn(
            "Не можна змінити аудиторію через конфлікт:",
            conflict.type
        );
        return false;
    }

    schedule[idx] = updatedLesson;
    return true;
}

export function cancelLesson(lessonId: number): void {
    const idx = findLessonIndexById(lessonId);
    if (idx === -1) {
        console.warn("Немає уроку з id =", lessonId);
        return;
    }
    schedule.splice(idx, 1);
    lessonIds.splice(idx, 1);
}

// ==== Демонстраційний приклад використання ====

// Створюємо аудиторії
addClassroomRaw({ number: "101", capacity: 30, hasProjector: true });
addClassroomRaw({ number: "202", capacity: 40, hasProjector: false });
addClassroomRaw({ number: "303", capacity: 25, hasProjector: true });

// Створюємо викладачів
const profMath: Professor = addProfessorRaw({
    name: "Ігор Степаненко",
    department: "Mathematics"
});

const profCS: Professor = addProfessorRaw({
    name: "Олена Коваль",
    department: "Computer Science"
});

// Створюємо курси
const courseDiscrete: Course = addCourseRaw({
    name: "Дискретна математика",
    type: "Lecture"
});

const courseAlgorithms: Course = addCourseRaw({
    name: "Алгоритми та структури даних",
    type: "Practice"
});

// Додаємо заняття в розклад
const lesson1: Lesson = {
    courseId: courseDiscrete.id,
    professorId: profMath.id,
    classroomNumber: "101",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00"
};

const lesson2: Lesson = {
    courseId: courseAlgorithms.id,
    professorId: profCS.id,
    classroomNumber: "202",
    dayOfWeek: "Monday",
    timeSlot: "10:15-11:45"
};

addLesson(lesson1);
addLesson(lesson2);

// Додаємо ще одне заняття в ту ж аудиторію, але інший слот — без конфлікту
const lesson3: Lesson = {
    courseId: courseAlgorithms.id,
    professorId: profCS.id,
    classroomNumber: "101",
    dayOfWeek: "Monday",
    timeSlot: "12:15-13:45"
};
addLesson(lesson3);

// Спроба додати конфлікт за викладачем (той самий час і день)
const conflictLesson: Lesson = {
    courseId: courseDiscrete.id,
    professorId: profMath.id,
    classroomNumber: "303",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00"
};
addLesson(conflictLesson); // буде попередження в консолі

// Виведення розкладу викладача
console.log("Розклад проф. математики:", getProfessorSchedule(profMath.id));
console.log("Розклад проф. CS:", getProfessorSchedule(profCS.id));

// Вільні аудиторії для конкретного слоту
console.log(
    "Вільні аудиторії в Monday 8:30-10:00:",
    findAvailableClassrooms("8:30-10:00", "Monday")
);

// Використання аудиторії
console.log(
    "Заповненість аудиторії 101 (%):",
    getClassroomUtilization("101")
);

// Найпопулярніший тип занять
console.log("Найпопулярніший тип занять:", getMostPopularCourseType());

// Демонстрація зміни аудиторії та відміни заняття
const firstLessonId: number = lessonIds[0]; // id першого доданого уроку

console.log("Спроба перенести перший урок в аудиторію 303:");
reassignClassroom(firstLessonId, "303");

console.log(
    "Розклад проф. математики після зміни аудиторії:",
    getProfessorSchedule(profMath.id)
);

console.log("Відміна першого уроку:");
cancelLesson(firstLessonId);

console.log(
    "Розклад проф. математики після відміни:",
    getProfessorSchedule(profMath.id)
);
