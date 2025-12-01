"use strict";
const subjectName = "Математичний аналіз";
const studentFullName = "Степан Бандера";
const totalPoints = 95;
const maxPoints = 100;
const isExamPassed = totalPoints >= 60;
/**
 * Обчислює відсоток набраних балів.
 */
function calculatePercent(score, max) {
    if (max <= 0)
        return 0;
    const percent = (score / max) * 100;
    return Math.round(percent * 10) / 10;
}
/**
 * Формує підсумковий текст про результат іспиту.
 */
function buildExamSummary(name, subject, score, max, passed) {
    const percent = calculatePercent(score, max);
    const statusText = passed ? "склав" : "не склав";
    return `Студент ${name} ${statusText} іспит з дисципліни "${subject}" з результатом ${percent}% (${score}/${max}).`;
}
const summary = buildExamSummary(studentFullName, subjectName, totalPoints, maxPoints, isExamPassed);
console.log(summary);
