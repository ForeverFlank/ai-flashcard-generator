import { requestDeck } from "./api.js";
import { mockDeck } from "./mock-data.js";
import { drawFlashcardsReadMode, draweFlashcardsEditMode } from "./ui.js";

let currentDeck = null;
let currentMode = "read";

async function requestAndDrawFlashcards() {
    // currentDeck = await requestDeck();
    currentDeck = mockDeck;
    // drawFlashcardsReadMode(currentDeck);
    draweFlashcardsEditMode(currentDeck);
}

export { currentDeck, currentMode, requestAndDrawFlashcards }