"use strict";

import { FRONTEND_URL } from "../config.js";
import { cancelEditedDeck, currentDeck, loadAndDrawDeck, saveEditedDeck, toggleModeAndDrawDeck } from "../deck.js";
import { svgTrash } from "../icons.js";
import { displayPages } from "./app-ui.js";

/* ---------- Helpers ---------- */
function makeEl(tag, classes = [], text = "", props = {}) {
    const el = document.createElement(tag);
    if (classes.length) el.classList.add(...classes);
    if (text) el.innerText = text;
    Object.assign(el, props);
    return el;
}

function clearEl(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
}

function getCardColor(n) {
    return ["#f4c348ff", "#4fdd98ff", "#469defff", "#ed55ebff"][n % 4];
}

/* ---------- Containers ---------- */
const flashcardContainer = document.getElementById("flashcards-container");
const editContainer = document.getElementById("deck-edit-toggle-container");
const saveContainer = document.getElementById("deck-save-cancel-container");

/* ---------- Read Mode ---------- */
function drawDeckReadMode(deck = null) {
    editContainer.style.display = "flex";
    saveContainer.style.display = "none";

    const titleEl = document.getElementById("deck-title");
    const authorEl = document.getElementById("deck-author");

    clearEl(flashcardContainer);
    titleEl.innerText = "";
    authorEl.innerText = "";

    if (!deck) return;

    titleEl.innerText = deck.name;
    authorEl.innerText = `by: ${deck.author}`;

    deck.flashcards.forEach((card, idx) => {
        const flashcard = makeEl("div", ["flashcard"]);
        const inner = makeEl("div", ["flashcard-inner"]);
        const front = makeEl("div", ["flashcard-front"]);
        const back = makeEl("div", ["flashcard-back"]);

        const border = makeEl("div", ["flashcard-left-border"]);
        border.style.backgroundColor = getCardColor(idx);

        const qEl = makeEl("p", [], card.q);
        const aEl = makeEl("p", [], card.a);

        front.append(qEl, border);
        back.appendChild(aEl);
        inner.append(front, back);
        flashcard.appendChild(inner);
        flashcardContainer.appendChild(flashcard);

        flashcard.onclick = () => inner.classList.toggle("flashcard-flipped");
    });
}

/* ---------- Edit Mode ---------- */
function drawFlashcardEditMode(card, addButton) {
    const flashcard = makeEl("div", ["flashcard"]);
    flashcard.style.height = "12rem";

    const inner = makeEl("div", ["flashcard-inner"]);
    const editor = makeEl("div", ["flashcard-editor"]);

    const border = makeEl("div", ["flashcard-left-border"]);
    // border.style.backgroundColor = getCardColor(idx);

    const qLabel = makeEl("label", [], "Question");
    const qInput = makeEl("textarea", ["card-input"], "", {
        value: card.q,
        oninput: (e) => card.qEdited = e.target.value
    });

    const aLabel = makeEl("label", [], "Answer");
    const aInput = makeEl("textarea", ["card-input"], "", {
        value: card.a,
        oninput: (e) => card.aEdited = e.target.value
    });

    const deleteBtn = makeEl("button", ["btn-delete-flashcard"]);
    deleteBtn.innerHTML = svgTrash;
    deleteBtn.onclick = () => {
        card.toBeDeleted = true;
        flashcard.remove();
    };

    editor.append(qLabel, qInput, aLabel, aInput, border, deleteBtn);
    inner.appendChild(editor);
    flashcard.appendChild(inner);

    flashcardContainer.insertBefore(flashcard, addButton);
}

function drawDeckEditMode(deck) {
    editContainer.style.display = "none";
    saveContainer.style.display = "flex";
    clearEl(flashcardContainer);

    const addBtn = makeEl("button", ["btn-add-flashcard"]);
    addBtn.innerHTML = "<span>+</span> Add Flashcard";
    addBtn.onclick = () => {
        const newCard = { q: "", a: "", qEdited: "", aEdited: "", recentlyCreated: true, toBeDeleted: false };
        deck.flashcards.push(newCard);
        drawFlashcardEditMode(newCard, addBtn);
    };

    flashcardContainer.appendChild(addBtn);
    deck.flashcards.forEach((card) => drawFlashcardEditMode(card, addBtn));
}

/* ---------- Shared Deck ---------- */
async function tryDrawSharedDeck() {
    const id = new URLSearchParams(window.location.search).get("deck_id");
    if (id) {
        displayPages(["deck"]);
        await loadAndDrawDeck(id);
    }
}

/* ---------- View Mode ---------- */
let currentCardIndex = 0;
let randomBag = [];
let bagIndex = 0;

function randomizeBag() {
    const n = currentDeck.flashcards.length;
    const res = Array.from({ length: n }, (_, i) => i);

    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
}

function drawFlashcardViewMode() {
    const card = currentDeck.flashcards[currentCardIndex];
    document.getElementById("view-card-border").style.backgroundColor = getCardColor(currentCardIndex);
    document.getElementById("view-card-question").innerText = card.q;
    document.getElementById("view-card-answer").innerText = card.a;
}

function setupViewModeUI() {
    const cardInner = document.getElementById("view-card-inner");
    const flippedClass = "flashcard-flipped";

    function resetFlip() {
        const prevTransition = cardInner.style.transition;

        cardInner.style.transition = "none";
        cardInner.offsetHeight; 
        cardInner.classList.remove(flippedClass);

        requestAnimationFrame(() => {
            cardInner.style.transition = prevTransition;
        });
    }

    document.getElementById("btn-view-deck").onclick = () => {
        currentCardIndex = 0;
        bagIndex = 0;
        randomBag = randomizeBag();
        displayPages(["view"]);
        drawFlashcardViewMode();
    };

    cardInner.onclick = () => cardInner.classList.toggle(flippedClass);

    document.getElementById("btn-view-prev").onclick = () => {
        resetFlip();
        currentCardIndex = (currentCardIndex - 1 + currentDeck.flashcards.length) % currentDeck.flashcards.length;
        bagIndex = 0;
        randomBag = randomizeBag();
        drawFlashcardViewMode();
    };

    document.getElementById("btn-view-rand").onclick = () => {
        resetFlip();
        currentCardIndex = randomBag[bagIndex++];
        if (bagIndex >= randomBag.length) {
            bagIndex = 0;
            randomBag = randomizeBag();
        }
        drawFlashcardViewMode();
    };

    document.getElementById("btn-view-next").onclick = () => {
        resetFlip();
        currentCardIndex = (currentCardIndex + 1) % currentDeck.flashcards.length;
        bagIndex = 0;
        randomBag = randomizeBag();
        drawFlashcardViewMode();
    };

    document.getElementById("btn-view-exit").onclick = () => {
        resetFlip();
        displayPages(["deck"]);
    };
}

/* ---------- Deck Controls ---------- */
function setupDeckUI() {
    document.getElementById("btn-edit-deck").onclick = toggleModeAndDrawDeck;
    document.getElementById("btn-edit-mode-save").onclick = saveEditedDeck;
    document.getElementById("btn-edit-mode-cancel").onclick = cancelEditedDeck;
    document.getElementById("btn-share-deck").onclick = () => {
        const url = `${FRONTEND_URL}/?deck_id=${currentDeck._id}`;
        navigator.clipboard.writeText(url);
    };
}

export { drawDeckReadMode, drawDeckEditMode, tryDrawSharedDeck, setupViewModeUI, setupDeckUI };
