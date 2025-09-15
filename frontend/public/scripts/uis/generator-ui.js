"use strict";

import { displayPages } from "./app-ui.js";

function setupGeneratorMenu() {
    const input = document.getElementById("input-topic");
    const button = document.getElementById("btn-generator-submit");

    input.addEventListener("input", () => {
        const hasText = input.value.trim().length > 0;

        button.disabled = !hasText;
        button.style.opacity = hasText ? "1" : "0";
        button.style.pointerEvents = hasText ? "auto" : "none";
    });

    button.addEventListener("click", async () => {
        displayPages(["generator", "loading"]);
        await requestAndDrawFlashcards();
        displayPages(["deck"]);
    });
}

export { setupGeneratorMenu }