"use strict";

import { generateDeck, uploadDeck } from "./api.js";
import { mockDeck } from "./mock-data.js";
import { drawFlashcardsReadMode, drawFlashcardsEditMode } from "./ui.js";

let currentDeck = null;
let currentMode = "read";

async function requestAndDrawFlashcards() {
    // currentDeck = await generateDeck();
    currentDeck = mockDeck;
    drawFlashcardsReadMode(currentDeck);
}

function toggleModeAndDrawFlashcards() {
    if (currentMode === "read") {
        currentMode = "edit";
        drawFlashcardsReadMode(currentDeck);
    } else {
        currentMode = "read";
        drawFlashcardsEditMode(currentDeck);
    }
}

async function saveEditedFlashcards() {
    currentDeck.flashcards.forEach((card) => {
        card.q = card.qEdited;
        card.a = card.aEdited;
        delete card.qEdited;
        delete card.aEdited;
    });
    const success = await uploadDeck(currentDeck);
}

function cancelEditedFlashcards() {
    currentDeck.flashcards.forEach((card) => {
        delete card.qEdited;
        delete card.aEdited;
    });
}

export {
    currentDeck, currentMode,
    requestAndDrawFlashcards, toggleModeAndDrawFlashcards,
    saveEditedFlashcards, cancelEditedFlashcards
}