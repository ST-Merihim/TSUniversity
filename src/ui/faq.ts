export function initFaqUi(): void {
    const questions: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll("[data-faq]");

    questions.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => {
            const parent: HTMLElement | null = btn.parentElement;
            if (!parent) return;

            const answer: HTMLDivElement | null =
                parent.querySelector(".faq-answer");
            if (!answer) return;

            const isVisible: boolean = answer.classList.contains(
                "faq-answer--visible"
            );

            const allAnswers: NodeListOf<HTMLDivElement> =
                document.querySelectorAll(".faq-answer");
            allAnswers.forEach((a: HTMLDivElement): void => {
                a.classList.remove("faq-answer--visible");
            });

            if (!isVisible) {
                answer.classList.add("faq-answer--visible");
            }
        });
    });
}
