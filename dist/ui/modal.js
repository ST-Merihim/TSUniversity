function changeModalState(open) {
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
export function initModalUi() {
    const openButtons = document.querySelectorAll(".js-open-modal");
    const closeButtons = document.querySelectorAll(".js-close-modal");
    const backdrop = document.querySelector("#backdrop");
    openButtons.forEach((btn) => {
        btn.addEventListener("click", () => changeModalState(true));
    });
    closeButtons.forEach((btn) => {
        btn.addEventListener("click", () => changeModalState(false));
    });
    if (backdrop) {
        backdrop.addEventListener("click", () => changeModalState(false));
    }
}
