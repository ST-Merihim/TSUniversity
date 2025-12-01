const subjectName: string = "Математичний аналіз";
const studentFullName: string = "Степан Бандера";
const totalPoints: number = 95;
const maxPoints: number = 100;
const isExamPassed: boolean = totalPoints >= 60;

/**
 * Обчислює відсоток набраних балів.
 */
function calculatePercent(score: number, max: number): number {
    if (max <= 0) return 0;
    const percent: number = (score / max) * 100;
    return Math.round(percent * 10) / 10;
}

/**
 * Формує підсумковий текст про результат іспиту.
 */
function buildExamSummary(
    name: string,
    subject: string,
    score: number,
    max: number,
    passed: boolean
): string {
    const percent: number = calculatePercent(score, max);
    const statusText: string = passed ? "склав" : "не склав";
    return `Студент ${name} ${statusText} іспит з дисципліни "${subject}" з результатом ${percent}% (${score}/${max}).`;
}

const summary: string = buildExamSummary(
    studentFullName,
    subjectName,
    totalPoints,
    maxPoints,
    isExamPassed
);

console.log(summary);
