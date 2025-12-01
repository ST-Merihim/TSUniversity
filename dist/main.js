import { initModalUi } from "./ui/modal.js";
import { initSectionUi } from "./ui/sections.js";
import { initFaqUi } from "./ui/faq.js";
import { initTodosData } from "./data/todos.js";
function bootstrap() {
    initModalUi();
    initSectionUi();
    initFaqUi();
    initTodosData();
}
document.addEventListener("DOMContentLoaded", () => {
    bootstrap();
});
