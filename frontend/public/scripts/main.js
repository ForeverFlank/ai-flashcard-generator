"use strict";

import { setupUserMenu } from "./uis/app-ui.js";
import {
    cancelEditedFlashcards, requestAndDrawFlashcards, saveEditedFlashcards, toggleModeAndDrawFlashcards
} from "./flashcards.js";

setupUserMenu();

document.getElementById("btn-generator-submit").addEventListener("click", requestAndDrawFlashcards);

document.getElementById("btn-edit-deck").addEventListener("click", toggleModeAndDrawFlashcards);

document.getElementById("btn-edit-mode-save").addEventListener("click", saveEditedFlashcards);

document.getElementById("btn-edit-mode-cancel").addEventListener("click", cancelEditedFlashcards);