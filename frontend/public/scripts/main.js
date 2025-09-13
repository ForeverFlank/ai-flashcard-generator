import { requestAndDrawFlashcards } from "./flashcards.js";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-submit").addEventListener("click", (e) => {
        requestAndDrawFlashcards();
    });
    requestAndDrawFlashcards();
});