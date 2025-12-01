type Todo = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
};

// --- Модальне вікно ---

function toggleModal(open: boolean): void {
    const modal: HTMLDivElement | null = document.querySelector("#bookingModal");
    const backdrop: HTMLDivElement | null = document.querySelector("#backdrop");

    if (!modal || !backdrop) return;

    if (open) {
        modal.classList.add("modal--visible");
        backdrop.classList.add("backdrop--visible");
    } else {
        modal.classList.remove("modal--visible");
        backdrop.classList.remove("backdrop--visible");
    }
}

function initModal(): void {
    const openButtons: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll(".js-open-modal");
    const closeButtons: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll(".js-close-modal");
    const backdrop: HTMLDivElement | null = document.querySelector("#backdrop");

    openButtons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => toggleModal(true));
    });

    closeButtons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => toggleModal(false));
    });

    if (backdrop) {
        backdrop.addEventListener("click", (): void => toggleModal(false));
    }
}

// --- Підсвітка "чипів" за активним розділом ---

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

function initSectionChips(): void {
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

// --- FAQ акордеон ---

function initFaq(): void {
    const questions: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll("[data-faq]");

    questions.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => {
            const parent: HTMLElement | null = btn.parentElement;
            if (!parent) return;

            const answer: HTMLDivElement | null =
                parent.querySelector(".faq-answer");
            if (!answer) return;

            const visible: boolean = answer.classList.contains(
                "faq-answer--visible"
            );

            const allAnswers: NodeListOf<HTMLDivElement> =
                document.querySelectorAll(".faq-answer");
            allAnswers.forEach((el: HTMLDivElement): void => {
                el.classList.remove("faq-answer--visible");
            });

            if (!visible) {
                answer.classList.add("faq-answer--visible");
            }
        });
    });
}

// --- Завдання (todos) з API ---

let loadedTodos: Todo[] = [];

async function fetchTodos(): Promise<Todo[]> {
    const url: string =
        "https://jsonplaceholder.typicode.com/todos?_limit=10";
    const response: Response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    const data: Todo[] = await response.json();
    return data;
}

function renderTodos(todos: Todo[], onlyIncomplete: boolean): void {
    const list: HTMLUListElement | null =
        document.querySelector("#tasksList");
    if (!list) return;

    list.innerHTML = "";

    todos
        .filter((todo: Todo): boolean =>
            onlyIncomplete ? !todo.completed : true
        )
        .forEach((todo: Todo): void => {
            const item: HTMLLIElement = document.createElement("li");
            item.className = "task-item";
            if (todo.completed) {
                item.classList.add("completed");
            }

            const checkbox: HTMLInputElement = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = todo.completed;

            checkbox.addEventListener("change", (): void => {
                checkbox.checked
                    ? item.classList.add("completed")
                    : item.classList.remove("completed");
            });

            const text: HTMLSpanElement = document.createElement("span");
            text.textContent = todo.title;

            item.appendChild(checkbox);
            item.appendChild(text);
            list.appendChild(item);
        });
}

function initTodos(): void {
    const loadBtn: HTMLButtonElement | null =
        document.querySelector("#loadTasks");
    const filterCheckbox: HTMLInputElement | null =
        document.querySelector("#filterCompleted");

    if (loadBtn) {
        loadBtn.addEventListener("click", async (): Promise<void> => {
            try {
                loadedTodos = await fetchTodos();
                const onlyIncomplete: boolean = !!filterCheckbox?.checked;
                renderTodos(loadedTodos, onlyIncomplete);
            } catch (error) {
                console.error("Не вдалося завантажити завдання:", error);
            }
        });
    }

    if (filterCheckbox) {
        filterCheckbox.addEventListener("change", (): void => {
            if (loadedTodos.length === 0) return;
            const onlyIncomplete: boolean = filterCheckbox.checked;
            renderTodos(loadedTodos, onlyIncomplete);
        });
    }
}

// --- Ініціалізація сторінки ---

function initApp(): void {
    initModal();
    initSectionChips();
    initFaq();
    initTodos();
}

document.addEventListener("DOMContentLoaded", (): void => {
    initApp();
});
