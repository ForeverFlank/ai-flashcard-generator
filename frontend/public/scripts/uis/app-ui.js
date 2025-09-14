"use strict";

import { getDecksByUsername } from "../apis/flashcard-api.js";
import { checkAuth, loggedInUser, loginUser, signOut, signupUser } from "../apis/user-api.js";

document.querySelectorAll('.input-number-group').forEach(group => {
    const input = group.querySelector('input[type="number"]');
    const btnAdd = group.querySelector('.input-number-plus');
    const btnSub = group.querySelector('.input-number-minus');

    btnAdd.addEventListener('click', () => {
        let val = parseInt(input.value) || 0;
        let max = parseInt(input.max) || Infinity;
        if (val < max) {
            input.value = val + 1;
            input.dispatchEvent(new Event("input"));
        }
    });

    btnSub.addEventListener('click', () => {
        let val = parseInt(input.value) || 0;
        let min = parseInt(input.min) || 0;
        if (val > min) {
            input.value = val - 1;
            input.dispatchEvent(new Event("input"));
        }
    });

    input.addEventListener("input", () => {
        let val = parseInt(input.value) || 0;
        const min = parseInt(input.min) || 0;
        const max = parseInt(input.max) || Infinity;
        if (val < min) input.value = min;
        if (val > max) input.value = max;
    });
});

function setupUserMenu() {
    const userMenu = document.getElementById("header-user-menu");
    const notLoggedInMenu = document.getElementById("header-user-menu-not-logged-in");
    const loggedInMenu = document.getElementById("header-user-menu-logged-in");
    const signupMenu = document.getElementById("header-user-menu-sign-up");
    const loginMenu = document.getElementById("header-user-menu-log-in");
    const signupFailedText = document.getElementById("sign-up-failed");
    const loginFailedText = document.getElementById("log-in-failed");
    const userButton = document.getElementById("btn-user");


    function showMenuSection(section) {
        [signupMenu, loginMenu, notLoggedInMenu, loggedInMenu].forEach(el => el.style.display = "none");
        if (section) section.style.display = "block";
    }

    userButton.addEventListener("click", async () => {
        await checkAuth();

        const isVisible = userMenu.style.display === "flex";
        userMenu.style.display = isVisible ? "none" : "flex";

        if (isVisible) return;

        showMenuSection(null);
        signupFailedText.style.display = "none";
        loginFailedText.style.display = "none";

        if (loggedInUser) {
            showMenuSection(loggedInMenu);
            document.getElementById("user-menu-username").innerText = loggedInUser.name;
        } else {
            showMenuSection(notLoggedInMenu);
        }
    });

    document.getElementById("btn-sign-up").addEventListener("click", () => showMenuSection(signupMenu));

    document.getElementById("btn-log-in").addEventListener("click", () => showMenuSection(loginMenu));

    document.getElementById("btn-sign-up-submit").addEventListener("click", async () => {
        const name = document.getElementById("sign-up-name").value;
        const pass = document.getElementById("sign-up-pass").value;
        const res = await signupUser(name, pass);

        if (res) {
            userMenu.style.display = "none";
        } else {
            signupFailedText.style.display = "block";
        }
    });

    document.getElementById("btn-log-in-submit").addEventListener("click", async () => {
        const name = document.getElementById("log-in-name").value;
        const pass = document.getElementById("log-in-pass").value;
        const res = await loginUser(name, pass);

        if (res) {
            userMenu.style.display = "none";
        } else {
            loginFailedText.style.display = "block";
        }
    });

    document.getElementById("btn-sign-out").addEventListener("click", () => {
        signOut();
        userMenu.style.display = "none";
    });

    document.getElementById("btn-new-deck").addEventListener("click", () => {
        // Placeholder for new deck logic 
    });

    document.getElementById("btn-my-decks").addEventListener("click", async () => {
        if (!loggedInUser) return;
        const myDecks = await getDecksByUsername(loggedInUser.name);
        console.log(myDecks);
    });
}

function setupGeneratorMenu() {
    const input = document.getElementById("input-topic");
    const button = document.getElementById("btn-generator-submit");

    input.addEventListener("input", () => {
        const hasText = input.value.trim().length > 0;

        button.disabled = !hasText;
        button.style.opacity = hasText ? "1" : "0";
        button.style.pointerEvents = hasText ? "auto" : "none";
    });

    button.addEventListener("click", async () => {
        displayPages(["generator", "loading"]);
        await requestAndDrawFlashcards();
        displayPages(["deck"]);
    });
}

function displayPages(pages) {
    const generatorPage = document.getElementById("generator-container");
    const loadingPage = document.getElementById("loading-container");
    const deckPage = document.getElementById("deck-container");

    generatorPage.style.display = "none";
    loadingPage.style.display = "none";
    deckPage.style.display = "none";

    pages.forEach((page) => {
        if (page === "generator") {
            generatorPage.style.display = "flex";
        } else if (page === "loading") {
            loadingPage.style.display = "flex";
        } else if (page === "deck") {
            deckPage.style.display = "flex";
        }
    });
}

export { setupUserMenu, setupGeneratorMenu, displayPages }