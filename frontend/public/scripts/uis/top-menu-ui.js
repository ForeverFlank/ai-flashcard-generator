"use strict";

import { loggedInUser, loginUser, signOut, signupUser } from "../apis/user-api.js";
import { displayPages } from "./app-ui.js";
import { drawUserPage } from "./user-ui.js";

function updateTopRightUI() {
    const notLoggedInBar = document.getElementById("header-user-not-logged-in");
    const loggedInBar = document.getElementById("header-user-logged-in");

    if (loggedInUser) {
        notLoggedInBar.style.display = "none";
        loggedInBar.style.display = "block";
        document.getElementById("user-menu-username").innerText = loggedInUser.name;
    } else {
        notLoggedInBar.style.display = "block";
        loggedInBar.style.display = "none";
    }
}

function setupTopUI() {
    const userMenu = document.getElementById("header-user-menu");
    const loggedInMenu = document.getElementById("header-user-menu-logged-in");
    const signupMenu = document.getElementById("header-user-menu-sign-up");
    const loginMenu = document.getElementById("header-user-menu-log-in");
    const signupFailedText = document.getElementById("sign-up-failed");
    const loginFailedText = document.getElementById("log-in-failed");
    const userButton = document.getElementById("btn-user");

    function showMenuSection(section) {
        const isVisible = userMenu.style.display === "flex";
        const isSameSectionVisible = section.style.display === "block";

        if (isVisible && isSameSectionVisible) {
            userMenu.style.display = "none";
            section.style.display = "none";
        } else {
            userMenu.style.display = "flex";

            [signupMenu, loginMenu, loggedInMenu].forEach(el => {
                el.style.display = "none";
            });

            if (section) {
                section.style.display = "block";
            }
        }
    }

    userButton.addEventListener("click", () => {
        showMenuSection(loggedInMenu)
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
        updateTopRightUI();
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
        updateTopRightUI();
    });

    document.getElementById("btn-sign-out").addEventListener("click", () => {
        signOut();
        updateTopRightUI();
        userMenu.style.display = "none";
    });

    document.getElementById("btn-new-deck").addEventListener("click", () => {
        displayPages(["generator"]);
        userMenu.style.display = "none";
    });

    document.getElementById("btn-my-decks").addEventListener("click", async () => {
        if (!loggedInUser) return;
        displayPages(["user"]);
        drawUserPage(loggedInUser.name);
        userMenu.style.display = "none";
    });
}

export { setupTopUI, updateTopRightUI }