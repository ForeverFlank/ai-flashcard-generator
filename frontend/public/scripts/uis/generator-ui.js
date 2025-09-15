"use strict";

import { generateAndDrawDeck } from "../deck.js";
import { displayPages } from "./app-ui.js";

function setupGeneratorUI() {
    const input = document.getElementById("input-topic");
    const button = document.getElementById("btn-generator-submit");

    function updateGenerateButton() {
        const hasText = input.value.trim().length > 0;

        button.disabled = !hasText;
        button.style.opacity = hasText ? "1" : "0";
        button.style.pointerEvents = hasText ? "auto" : "none";
    }

    input.addEventListener("input", updateGenerateButton);

    button.addEventListener("click", async () => {
        displayPages(["generator", "loading"]);
        await generateAndDrawDeck();
        displayPages(["deck"]);
    });

    updateGenerateButton();
}

export { setupGeneratorUI }