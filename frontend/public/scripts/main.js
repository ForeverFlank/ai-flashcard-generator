"use strict";

import { setupGeneratorMenu, setupUserMenu } from "./uis/app-ui.js";
import {
    cancelEditedFlashcards, saveEditedFlashcards, toggleModeAndDrawFlashcards
} from "./flashcards.js";

setupUserMenu();
setupGeneratorMenu();

document.getElementById("btn-edit-deck").addEventListener("click", toggleModeAndDrawFlashcards);

document.getElementById("btn-edit-mode-save").addEventListener("click", saveEditedFlashcards);

document.getElementById("btn-edit-mode-cancel").addEventListener("click", cancelEditedFlashcards);