function setActiveChip(sectionId: string): void {
    const chips: NodeListOf<HTMLSpanElement> =
        document.querySelectorAll(".js-section-chip");

    chips.forEach((chip: HTMLSpanElement): void => {
        const chipSection: string | null = chip.getAttribute("data-section");
        if (chipSection === sectionId) {
            chip.classList.add("chip--active");
        } else {
            chip.classList.remove("chip--active");
        }
    });
}

export function initSectionUi(): void {
    const sections: HTMLElement[] = [
        document.querySelector("#hero"),
        document.querySelector("#features"),
        document.querySelector("#tasks")
    ].filter((el): el is HTMLElement => el !== null);

    const observer: IntersectionObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]): void => {
            entries.forEach((entry: IntersectionObserverEntry): void => {
                if (entry.isIntersecting) {
                    const id: string | null = entry.target.getAttribute("id");
                    if (id) {
                        setActiveChip(id);
                    }
                }
            });
        },
        { threshold: 0.4 }
    );

    sections.forEach((section: HTMLElement): void => observer.observe(section));

    const chips: NodeListOf<HTMLSpanElement> =
        document.querySelectorAll(".js-section-chip");

    chips.forEach((chip: HTMLSpanElement): void => {
        chip.addEventListener("click", (): void => {
            const targetId: string | null = chip.getAttribute("data-section");
            if (!targetId) return;
            const section: HTMLElement | null =
                document.querySelector(`#${targetId}`);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}
