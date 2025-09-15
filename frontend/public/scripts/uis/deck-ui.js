"use strict";

import { BACKEND_URL, FRONTEND_URL } from "../config.js";
import { cancelEditedDeck, currentDeck, loadAndDrawDeck, saveEditedDeck, toggleModeAndDrawDeck } from "../deck.js";
import { svgTrash } from "../icons.js";
import { displayPages } from "./app-ui.js";

function getCardColor(question) {
    const colorPallets = ["#f4c348ff", "#4fdd98ff", "#469defff", "#ed55ebff"];

    let n = 0xCED7;
    for (const char of question) {
        n ^= char.charCodeAt(0);
        n += 67;
        n = n ^ (n << 1);
        n %= colorPallets.length;
    }
    return colorPallets[n];
}

const flashcardContainer = document.getElementById("flashcards-container");
const editContainer = document.getElementById("deck-edit-toggle-container");
const saveContainer = document.getElementById("deck-save-cancel-container");

function drawDeckReadMode(deck = null) {
    editContainer.style.display = "flex";
    saveContainer.style.display = "none";

    const titleElement = document.getElementById("deck-title");
    const authorElement = document.getElementById("deck-author");

    flashcardContainer.innerHTML = "";
    titleElement.innerText = "";
    authorElement.innerText = "";

    if (deck === null) return;

    titleElement.innerText = deck.name;
    authorElement.innerText = "by: " + deck.author;

    deck.flashcards.forEach((card) => {
        const flashcard = document.createElement("div");
        flashcard.classList.add("flashcard");

        const inner = document.createElement("div");
        inner.classList.add("flashcard-inner");

        const front = document.createElement("div");
        front.classList.add("flashcard-front");
        const back = document.createElement("div");
        back.classList.add("flashcard-back");

        const leftBorder = document.createElement("div");
        leftBorder.classList.add("flashcard-left-border");
        leftBorder.style.backgroundColor = getCardColor(card.q);

        const questionInput = document.createElement("p");
        questionInput.innerText = card.q;

        const answerInput = document.createElement("p");
        answerInput.innerText = card.a;

        front.appendChild(questionInput);
        front.appendChild(leftBorder);
        back.appendChild(answerInput);

        inner.appendChild(front);
        inner.appendChild(back);

        flashcard.appendChild(inner);
        flashcardContainer.appendChild(flashcard);

        flashcard.onclick = () => {
            const classList = inner.classList;
            const flippedClass = "flashcard-flipped";
            const flipped = classList.contains(flippedClass);
            if (flipped) {
                classList.remove(flippedClass);
            } else {
                classList.add(flippedClass);
            }
        };
    });
}

function drawFlashcardEditMode(card, addButton) {
    const flashcard = document.createElement("div");
    flashcard.classList.add("flashcard");
    flashcard.style.height = "12rem";

    const inner = document.createElement("div");
    inner.classList.add("flashcard-inner");

    const editor = document.createElement("div");
    editor.classList.add("flashcard-editor");

    const leftBorder = document.createElement("div");
    leftBorder.classList.add("flashcard-left-border");
    leftBorder.style.backgroundColor = getCardColor(card.q);

    const questionLabel = document.createElement("label");
    questionLabel.innerText = "Question";

    const answerLabel = document.createElement("label");
    answerLabel.innerText = "Answer";

    const questionInput = document.createElement("textarea");
    questionInput.value = card.q;
    questionInput.classList.add("card-input");
    questionInput.oninput = e => card.qEdited = e.target.value;

    const answerInput = document.createElement("textarea");
    answerInput.value = card.a;
    answerInput.classList.add("card-input");
    answerInput.oninput = e => card.aEdited = e.target.value;

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = svgTrash;
    deleteButton.classList.add("btn-delete-flashcard");
    deleteButton.onclick = () => {
        card.toBeDeleted = true;
        flashcard.remove();
    };

    editor.appendChild(questionLabel);
    editor.appendChild(questionInput);
    editor.appendChild(answerLabel);
    editor.appendChild(answerInput);
    editor.appendChild(leftBorder);
    editor.appendChild(deleteButton);

    inner.appendChild(editor);

    flashcard.appendChild(inner);
    flashcardContainer.insertBefore(flashcard, addButton);
}

function drawDeckEditMode(deck) {
    editContainer.style.display = "none";
    saveContainer.style.display = "flex";

    flashcardContainer.innerHTML = "";

    const addButton = document.createElement("button");
    addButton.classList.add("btn-add-flashcard");
    addButton.innerHTML = "<span>+</span> Add Flashcard";
    addButton.onclick = () => {
        const card = {
            q: "",
            a: "",
            qEdited: "",
            aEdited: "",
            recentlyCreated: true,
            toBeDeleted: false,
        };
        deck.flashcards.push(card);

        drawFlashcardEditMode(card, addButton);
    };

    flashcardContainer.appendChild(addButton);
    deck.flashcards.forEach((card) => drawFlashcardEditMode(card, addButton));
}

async function tryDrawSharedDeck() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("deck_id");

    if (id) {
        displayPages(["deck"]);
        await loadAndDrawDeck(id);
    }
}

function setupDeckUI() {
    document.getElementById("btn-edit-deck").addEventListener("click", toggleModeAndDrawDeck);

    document.getElementById("btn-edit-mode-save").addEventListener("click", saveEditedDeck);

    document.getElementById("btn-edit-mode-cancel").addEventListener("click", cancelEditedDeck);

    document.getElementById("btn-share-deck").addEventListener("click", () => {
        const url = `${FRONTEND_URL}/?deck_id=${currentDeck._id}`;
        navigator.clipboard.writeText(url);
    });
}

export { drawDeckReadMode, drawDeckEditMode, tryDrawSharedDeck, setupDeckUI }