import type { Todo } from "../types/todo.js";

let todosCache: Todo[] = [];

async function fetchTodos(): Promise<Todo[]> {
    const url: string =
        "https://jsonplaceholder.typicode.com/todos?_limit=10";
    const response: Response = await fetch(url);
    if (!response.ok) {
        throw new Error("HTTP error: " + response.status);
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

export function initTodosData(): void {
    const loadBtn: HTMLButtonElement | null =
        document.querySelector("#loadTasks");
    const filterCheckbox: HTMLInputElement | null =
        document.querySelector("#filterCompleted");

    if (loadBtn) {
        loadBtn.addEventListener("click", async (): Promise<void> => {
            try {
                todosCache = await fetchTodos();
                const onlyIncomplete: boolean = !!filterCheckbox?.checked;
                renderTodos(todosCache, onlyIncomplete);
            } catch (error) {
                console.error("Не вдалося завантажити завдання:", error);
            }
        });
    }

    if (filterCheckbox) {
        filterCheckbox.addEventListener("change", (): void => {
            if (todosCache.length === 0) return;
            renderTodos(todosCache, filterCheckbox.checked);
        });
    }
}
