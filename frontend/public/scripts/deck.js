"use strict";

import { generateDeck, getDeckById, modifyDeck, uploadDeck } from "./apis/deck-api.js";
import { drawDeckReadMode, drawDeckEditMode } from "./uis/deck-ui.js";

let currentDeck = null;
let currentMode = "read";

/* ---------- Loading ---------- */
async function generateAndDrawDeck() {
    currentDeck = (await generateDeck()).deck;
    currentMode = "read";
    drawDeckReadMode(currentDeck);
}

async function loadAndDrawDeck(id) {
    drawDeckReadMode(); // clears UI
    currentDeck = (await getDeckById(id)).deck;
    drawDeckReadMode(currentDeck);
}

/* ---------- Mode Toggle ---------- */
function toggleModeAndDrawDeck() {
    if (currentMode === "read") {
        currentMode = "edit";
        drawDeckEditMode(currentDeck);
    } else {
        currentMode = "read";
        drawDeckReadMode(currentDeck);
    }
}

async function modifyAndDrawDeck() {
    const flashcards = (await modifyDeck(currentDeck)).flashcards;

    currentDeck.flashcards.forEach((card) => {
        card.toBeDeleted = true;
    });
    flashcards.forEach((card) => {
        currentDeck.flashcards.push({
            qEdited: card.q,
            aEdited: card.a,
            recentlyCreated: true
        })
    });
    drawDeckEditMode(currentDeck);
}

/* ---------- Save / Cancel ---------- */
async function saveEditedDeck() {
    currentDeck.flashcards = currentDeck.flashcards.filter(c => !c.toBeDeleted);
    currentDeck.flashcards.forEach(c => {
        if (c.qEdited) c.q = c.qEdited;
        if (c.aEdited) c.a = c.aEdited;
        delete c.qEdited;
        delete c.aEdited;
        delete c.recentlyCreated;
    });

    await uploadDeck(currentDeck);
    currentMode = "read";
    drawDeckReadMode(currentDeck);
}

function cancelEditedDeck() {
    currentDeck.flashcards = currentDeck.flashcards.filter(c => !c.recentlyCreated);
    currentDeck.flashcards.forEach(c => {
        delete c.toBeDeleted;
        delete c.qEdited;
        delete c.aEdited;
    });

    currentMode = "read";
    drawDeckReadMode(currentDeck);
}

export {
    currentDeck, currentMode,
    generateAndDrawDeck,
    modifyAndDrawDeck,
    loadAndDrawDeck,
    toggleModeAndDrawDeck,
    saveEditedDeck,
    cancelEditedDeck
};
