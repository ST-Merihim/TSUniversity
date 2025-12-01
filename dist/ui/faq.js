export function initFaqUi() {
    const questions = document.querySelectorAll("[data-faq]");
    questions.forEach((btn) => {
        btn.addEventListener("click", () => {
            const parent = btn.parentElement;
            if (!parent)
                return;
            const answer = parent.querySelector(".faq-answer");
            if (!answer)
                return;
            const isVisible = answer.classList.contains("faq-answer--visible");
            const allAnswers = document.querySelectorAll(".faq-answer");
            allAnswers.forEach((a) => {
                a.classList.remove("faq-answer--visible");
            });
            if (!isVisible) {
                answer.classList.add("faq-answer--visible");
            }
        });
    });
}
