var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let todosCache = [];
function fetchTodos() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://jsonplaceholder.typicode.com/todos?_limit=10";
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
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
export function initTodosData() {
    const loadBtn = document.querySelector("#loadTasks");
    const filterCheckbox = document.querySelector("#filterCompleted");
    if (loadBtn) {
        loadBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            try {
                todosCache = yield fetchTodos();
                const onlyIncomplete = !!(filterCheckbox === null || filterCheckbox === void 0 ? void 0 : filterCheckbox.checked);
                renderTodos(todosCache, onlyIncomplete);
            }
            catch (error) {
                console.error("Не вдалося завантажити завдання:", error);
            }
        }));
    }
    if (filterCheckbox) {
        filterCheckbox.addEventListener("change", () => {
            if (todosCache.length === 0)
                return;
            renderTodos(todosCache, filterCheckbox.checked);
        });
    }
}
