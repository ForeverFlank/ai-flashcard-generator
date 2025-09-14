import { loginUser, registerUser } from "./api.js";
import {
    cancelEditedFlashcards, requestAndDrawFlashcards, saveEditedFlashcards, toggleModeAndDrawFlashcards
} from "./flashcards.js";

document.addEventListener("DOMContentLoaded", () => {
    loginUser("admin", "admin");

    document.getElementById("btn-user").addEventListener("click", () => {
        const menu = document.getElementById("header-user-menu");
        if (menu.style.display === "none") {
            menu.style.display = "flex";
        } else {
            menu.style.display = "none";
        }
    });

    document.getElementById("btn-submit").addEventListener("click", requestAndDrawFlashcards);

    document.getElementById("btn-edit-deck").addEventListener("click", toggleModeAndDrawFlashcards);

    document.getElementById("btn-edit-mode-save").addEventListener("click", saveEditedFlashcards);

    document.getElementById("btn-edit-mode-cancel").addEventListener("click", cancelEditedFlashcards);
});