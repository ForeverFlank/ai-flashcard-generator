"use strict";

import { loggedInUser, loginUser, signOut, signupUser } from "../apis/user-api.js";
import { displayPage } from "./app-ui.js";
import { drawLatestDecksTable } from "./explore-ui.js";
import { drawUserPage } from "./user-ui.js";

const mobileExplore = document.getElementById("btn-mobile-explore");
const mobileLogin = document.getElementById("btn-mobile-log-in");
const mobileSignup = document.getElementById("btn-mobile-sign-up");
const mobileNewDeck = document.getElementById("btn-mobile-new-deck");
const mobileMyDecks = document.getElementById("btn-mobile-my-decks");
const mobileSignOut = document.getElementById("btn-mobile-sign-out"); // fixed typo

function updateTopRightUI() {
    const notLoggedInBar = document.getElementById("header-user-not-logged-in");
    const loggedInBar = document.getElementById("header-user-logged-in");

    mobileExplore.style.display = "block";

    if (!loggedInUser) {
        notLoggedInBar.style.display = "block";
        loggedInBar.style.display = "none";

        mobileLogin.style.display = "block";
        mobileSignup.style.display = "block";
        mobileNewDeck.style.display = "none";
        mobileMyDecks.style.display = "none";
        mobileSignOut.style.display = "none";
    } else {
        notLoggedInBar.style.display = "none";
        loggedInBar.style.display = "block";

        document.getElementById("user-menu-username").innerText = loggedInUser.name;

        mobileLogin.style.display = "none";
        mobileSignup.style.display = "none";
        mobileNewDeck.style.display = "block";
        mobileMyDecks.style.display = "block";
        mobileSignOut.style.display = "block";
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

    const mobileMenu = document.getElementById("header-mobile-menu");
    const hamburger = document.getElementById("btn-mobile-nav");

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
        showMenuSection(loggedInMenu);
    });

    document.getElementById("btn-explore").addEventListener("click", () => {
        displayPage("explore");
        document.getElementById("input-page-num").value = 1;
        drawLatestDecksTable(1);
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
    document.getElementById("btn-mobile-sign-out").addEventListener("click", () => {
        signOut();
        updateTopRightUI();
        userMenu.style.display = "none";
        closeMobileMenu();
    });

    document.getElementById("btn-new-deck").addEventListener("click", () => {
        displayPage("generator");
        userMenu.style.display = "none";
    });
    document.getElementById("btn-mobile-new-deck").addEventListener("click", () => {
        displayPage("generator");
        userMenu.style.display = "none";
        closeMobileMenu();
    });

    document.getElementById("btn-my-decks").addEventListener("click", async () => {
        if (!loggedInUser) return;
        displayPage("user");
        drawUserPage(loggedInUser.name);
        userMenu.style.display = "none";
    });
    document.getElementById("btn-mobile-my-decks").addEventListener("click", async () => {
        if (!loggedInUser) return;
        displayPage("user");
        drawUserPage(loggedInUser.name);
        userMenu.style.display = "none";
        closeMobileMenu();
    });



    hamburger.addEventListener("click", () => {
        if (mobileMenu.style.display === "flex") {
            mobileMenu.style.display = "none";
        } else {
            mobileMenu.style.display = "flex";
        }
    });

    function closeMobileMenu() {
        mobileMenu.style.display = "none";
    }

    mobileExplore.addEventListener("click", () => {
        displayPage("explore");
        document.getElementById("input-page-num").value = 1;
        drawLatestDecksTable(1);
        closeMobileMenu();
    });

    mobileLogin.addEventListener("click", () => {
        showMenuSection(loginMenu);
        closeMobileMenu();
    });

    mobileSignup.addEventListener("click", () => {
        showMenuSection(signupMenu);
        closeMobileMenu();
    });

    document.addEventListener("click", (e) => {
        const target = e.target;

        if (!mobileMenu.contains(target) && !hamburger.contains(target)) {
            closeMobileMenu();
        }
    });

}


export { setupTopUI, updateTopRightUI }