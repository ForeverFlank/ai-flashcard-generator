"use strict";

import { checkAuth, loginUser, signupUser } from "./api.js";
import {
    cancelEditedFlashcards, requestAndDrawFlashcards, saveEditedFlashcards, toggleModeAndDrawFlashcards
} from "./flashcards.js";

let loggedInUser = checkAuth();
let userButtonState = 0;

const notLoggedInMenu = document.getElementById("header-user-menu-not-logged-in");
const loggedInMenu = document.getElementById("header-user-menu-logged-in");
const signUpMenu = document.getElementById("header-user-menu-sign-up");
const logInMenu = document.getElementById("header-user-menu-log-in");

document.getElementById("btn-user").addEventListener("click", () => {
    const menu = document.getElementById("header-user-menu");
    if (menu.style.display === "none") {
        menu.style.display = "flex";
    } else {
        userButtonState = 0;
        menu.style.display = "none";
        return;
    }

    signUpMenu.style.display = "none";
    logInMenu.style.display = "none";

    loggedInUser = checkAuth();

    if (loggedInUser) {
        userButtonState = 2;
        notLoggedInMenu.style.display = "block";
        loggedInMenu.style.display = "none";
    } else {
        userButtonState = 1;
        notLoggedInMenu.style.display = "none";
        loggedInMenu.style.display = "block";
    }
});

document.getElementById("btn-sign-up").addEventListener("click", () => {
    userButtonState = 3;
    notLoggedInMenu.style.display = "none";
    signUpMenu.style.display = "block";
});

document.getElementById("btn-log-in").addEventListener("click", () => {
    userButtonState = 4;
    notLoggedInMenu.style.display = "none";
    logInMenu.style.display = "block";
});

document.getElementById("btn-new-deck").addEventListener("click", () => {

});

document.getElementById("btn-my-decks").addEventListener("click", () => {

});



document.getElementById("btn-sign-up-submit").addEventListener("click", async () => {
    const name = document.getElementById("sign-up-name").value;
    const pass = document.getElementById("sign-up-pass").value;
    const res = await signupUser(name, pass);
});

document.getElementById("btn-log-in-submit").addEventListener("click", async () => {
    const name = document.getElementById("log-in-name").value;
    const pass = document.getElementById("log-in-pass").value;
    const res = await loginUser(name, pass);
});

document.getElementById("btn-sign-out").addEventListener("click", () => {

});


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


document.getElementById("btn-submit").addEventListener("click", requestAndDrawFlashcards);


document.getElementById("btn-edit-deck").addEventListener("click", toggleModeAndDrawFlashcards);

document.getElementById("btn-edit-mode-save").addEventListener("click", saveEditedFlashcards);

document.getElementById("btn-edit-mode-cancel").addEventListener("click", cancelEditedFlashcards);
