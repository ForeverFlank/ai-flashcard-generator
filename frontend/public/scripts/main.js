"use strict";

import { checkAuth } from "./apis/user-api.js";
import { cancelEditedFlashcards, saveEditedFlashcards, toggleModeAndDrawFlashcards } from "./flashcards.js";
import { setupTopMenu, updateTopRightUI } from "./uis/top-menu-ui.js";
import { setupGeneratorMenu } from "./uis/generator-ui.js";

document.addEventListener("DOMContentLoaded", async () => {
    await checkAuth();
    updateTopRightUI();

    setupTopMenu();
    setupGeneratorMenu();

    document.getElementById("btn-edit-deck").addEventListener("click", toggleModeAndDrawFlashcards);

    document.getElementById("btn-edit-mode-save").addEventListener("click", saveEditedFlashcards);

    document.getElementById("btn-edit-mode-cancel").addEventListener("click", cancelEditedFlashcards);
});

// displayPages(["user"])