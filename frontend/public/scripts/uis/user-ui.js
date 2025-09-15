"use strict";

import { deleteDeckById, getDecksByUsername } from "../apis/deck-api.js";
import { loadAndDrawDeck } from "../flashcards.js";
import { displayPages } from "./app-ui.js";

const usernameElement = document.getElementById("user-container-name");
const decksTable = document.getElementById("user-decks-tbody");

async function drawUserPage(username) {
    usernameElement.innerText = username + "'s decks";
    decksTable.innerHTML = "";

    const decks = await getDecksByUsername(username).then(r => r.decks);
    for (const deck of decks) {
        const tr = document.createElement("tr");

        const title = document.createElement("td");
        title.innerText = deck.name;
        title.classList.add("table-grow");

        const view = document.createElement("td");
        const viewBtn = document.createElement("button");
        viewBtn.innerText = "View";
        viewBtn.addEventListener("click", async () => {
            displayPages(["deck"]);
            loadAndDrawDeck(deck._id);
        });
        view.appendChild(viewBtn);
        
        const del = document.createElement("td");
        const delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        delBtn.classList.add("btn-red");
        delBtn.addEventListener("click", async () => {
            await deleteDeckById(deck._id);
            drawUserPage(username);
        });
        del.appendChild(delBtn);

        tr.appendChild(title);
        tr.appendChild(view);
        tr.appendChild(del);

        decksTable.appendChild(tr);
    }
}

export { drawUserPage }