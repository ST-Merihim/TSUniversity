"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// --- Модальне вікно ---
function toggleModal(open) {
    const modal = document.querySelector("#bookingModal");
    const backdrop = document.querySelector("#backdrop");
    if (!modal || !backdrop)
        return;
    if (open) {
        modal.classList.add("modal--visible");
        backdrop.classList.add("backdrop--visible");
    }
    else {
        modal.classList.remove("modal--visible");
        backdrop.classList.remove("backdrop--visible");
    }
}
function initModal() {
    const openButtons = document.querySelectorAll(".js-open-modal");
    const closeButtons = document.querySelectorAll(".js-close-modal");
    const backdrop = document.querySelector("#backdrop");
    openButtons.forEach((btn) => {
        btn.addEventListener("click", () => toggleModal(true));
    });
    closeButtons.forEach((btn) => {
        btn.addEventListener("click", () => toggleModal(false));
    });
    if (backdrop) {
        backdrop.addEventListener("click", () => toggleModal(false));
    }
}
// --- Підсвітка "чипів" за активним розділом ---
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
function initSectionChips() {
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
// --- FAQ акордеон ---
function initFaq() {
    const questions = document.querySelectorAll("[data-faq]");
    questions.forEach((btn) => {
        btn.addEventListener("click", () => {
            const parent = btn.parentElement;
            if (!parent)
                return;
            const answer = parent.querySelector(".faq-answer");
            if (!answer)
                return;
            const visible = answer.classList.contains("faq-answer--visible");
            const allAnswers = document.querySelectorAll(".faq-answer");
            allAnswers.forEach((el) => {
                el.classList.remove("faq-answer--visible");
            });
            if (!visible) {
                answer.classList.add("faq-answer--visible");
            }
        });
    });
}
// --- Завдання (todos) з API ---
let loadedTodos = [];
function fetchTodos() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://jsonplaceholder.typicode.com/todos?_limit=10";
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = yield response.json();
        return data;
    });
}
function renderTodos(todos, onlyIncomplete) {
    const list = document.querySelector("#tasksList");
    if (!list)
        return;
    list.innerHTML = "";
    todos
        .filter((todo) => onlyIncomplete ? !todo.completed : true)
        .forEach((todo) => {
        const item = document.createElement("li");
        item.className = "task-item";
        if (todo.completed) {
            item.classList.add("completed");
        }
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => {
            checkbox.checked
                ? item.classList.add("completed")
                : item.classList.remove("completed");
        });
        const text = document.createElement("span");
        text.textContent = todo.title;
        item.appendChild(checkbox);
        item.appendChild(text);
        list.appendChild(item);
    });
}
function initTodos() {
    const loadBtn = document.querySelector("#loadTasks");
    const filterCheckbox = document.querySelector("#filterCompleted");
    if (loadBtn) {
        loadBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            try {
                loadedTodos = yield fetchTodos();
                const onlyIncomplete = !!(filterCheckbox === null || filterCheckbox === void 0 ? void 0 : filterCheckbox.checked);
                renderTodos(loadedTodos, onlyIncomplete);
            }
            catch (error) {
                console.error("Не вдалося завантажити завдання:", error);
            }
        }));
    }
    if (filterCheckbox) {
        filterCheckbox.addEventListener("change", () => {
            if (loadedTodos.length === 0)
                return;
            const onlyIncomplete = filterCheckbox.checked;
            renderTodos(loadedTodos, onlyIncomplete);
        });
    }
}
// --- Ініціалізація сторінки ---
function initApp() {
    initModal();
    initSectionChips();
    initFaq();
    initTodos();
}
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});
