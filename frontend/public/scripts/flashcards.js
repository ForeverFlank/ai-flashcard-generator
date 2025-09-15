"use strict";

import { generateDeck, getDeckById, uploadDeck } from "./apis/deck-api.js";
import { drawDeckReadMode, drawDeckEditMode } from "./uis/deck-ui.js";

let currentDeck = null;
let currentMode = "read";

async function generateAndDrawDeck() {
    currentDeck = await generateDeck().then(r => r.deck);
    currentMode = "read";
    drawDeckReadMode(currentDeck);
}

async function loadAndDrawDeck(id) {
    drawDeckReadMode();
    currentDeck = await getDeckById(id).then(r => r.deck);
    drawDeckReadMode(currentDeck);
}

function toggleModeAndDrawFlashcards() {
    if (currentMode === "read") {
        currentMode = "edit";
        drawDeckEditMode(currentDeck);
    } else {
        currentMode = "read";
        drawDeckReadMode(currentDeck);
    }
}

async function saveEditedFlashcards() {
    currentDeck.flashcards = currentDeck.flashcards.filter((card) => !card.toBeDeleted);
    currentDeck.flashcards.forEach((card) => {
        if (card.qEdited) {
            card.q = card.qEdited;
        }
        if (card.aEdited) {
            card.a = card.aEdited;
        }
        delete card.qEdited;
        delete card.aEdited;
    });
    await uploadDeck(currentDeck);
    currentMode = "read";
    drawDeckReadMode(currentDeck);
}

function cancelEditedFlashcards() {
    currentDeck.flashcards = currentDeck.flashcards.filter((card) => !card.recentlyCreated);
    currentDeck.flashcards.forEach((card) => {
        delete card.toBeDeleted;
        delete card.qEdited;
        delete card.aEdited;
    });
    currentMode = "read";
    drawDeckReadMode(currentDeck);
}

export {
    currentDeck, currentMode,
    generateAndDrawDeck, loadAndDrawDeck, toggleModeAndDrawFlashcards, saveEditedFlashcards, cancelEditedFlashcards
}