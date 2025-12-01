function setActiveChip(sectionId) {
    const chips = document.querySelectorAll(".js-section-chip");
    chips.forEach((chip) => {
        const chipSection = chip.getAttribute("data-section");
        if (chipSection === sectionId) {
            chip.classList.add("chip--active");
        }
        else {
            chip.classList.remove("chip--active");
        }
    });
}
export function initSectionUi() {
    const sections = [
        document.querySelector("#hero"),
        document.querySelector("#features"),
        document.querySelector("#tasks")
    ].filter((el) => el !== null);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                if (id) {
                    setActiveChip(id);
                }
            }
        });
    }, { threshold: 0.4 });
    sections.forEach((section) => observer.observe(section));
    const chips = document.querySelectorAll(".js-section-chip");
    chips.forEach((chip) => {
        chip.addEventListener("click", () => {
            const targetId = chip.getAttribute("data-section");
            if (!targetId)
                return;
            const section = document.querySelector(`#${targetId}`);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}
