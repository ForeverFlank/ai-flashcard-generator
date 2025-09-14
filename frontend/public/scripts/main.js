import { loginUser, registerUser } from "./api.js";
import {
    cancelEditedFlashcards, requestAndDrawFlashcards, saveEditedFlashcards, toggleModeAndDrawFlashcards
} from "./flashcards.js";

document.addEventListener("DOMContentLoaded", () => {
    loginUser("admin", "admin");

    document.getElementById("btn-submit").addEventListener("click", requestAndDrawFlashcards);

    document.getElementById("btn-edit-deck").addEventListener("click", toggleModeAndDrawFlashcards);

    document.getElementById("btn-edit-mode-save").addEventListener("click", saveEditedFlashcards);

    document.getElementById("btn-edit-mode-cancel").addEventListener("click", cancelEditedFlashcards);
});