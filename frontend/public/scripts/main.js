"use strict";

import { getDecksByUsername, loginUser, registerUser } from "./api.js";
import {
    cancelEditedFlashcards, requestAndDrawFlashcards, saveEditedFlashcards, toggleModeAndDrawFlashcards
} from "./flashcards.js";

document.addEventListener("DOMContentLoaded", () => {
    // loginUser("admin", "admin");

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


    const cardCountInput = document.getElementById("input-card-count");

    document.getElementById("btn-card-count-add").addEventListener("click", () => {
        cardCountInput.value = Math.min(20,
            parseInt(cardCountInput.value) + 1
        );
    })
    document.getElementById("btn-card-count-sub").addEventListener("click", () => {
        cardCountInput.value = Math.max(1,
            parseInt(cardCountInput.value) - 1
        );
    })
});