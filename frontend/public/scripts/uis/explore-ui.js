"use strict";

import { getLatestDecks } from "../apis/deck-api.js";
import { loadAndDrawDeck } from "../deck.js";
import { displayPage } from "./app-ui.js";

const exploreTable = document.getElementById("explore-tbody");
const exploreThrobber = document.getElementById("explore-throbber");

async function drawLatestDecksTable(pageNum) {
    exploreTable.innerHTML = "";
    exploreThrobber.style.display = "block";

    const decks = await getLatestDecks(pageNum);

    for (const deck of decks) {
        const tr = document.createElement("tr");

        const title = document.createElement("td");
        title.innerText = deck.name || "(Untitled Deck)";
        title.style.width = "60%";

        const author = document.createElement("td");
        author.innerText = deck.author || "Anonymous";

        const view = document.createElement("td");
        const viewBtn = document.createElement("button");
        viewBtn.innerText = "View";
        viewBtn.addEventListener("click", async () => {
            displayPage("deck");
            loadAndDrawDeck(deck._id);
        });
        view.style.width = "1%";
        view.appendChild(viewBtn);

        tr.appendChild(title);
        tr.appendChild(author);
        tr.appendChild(view);

        exploreTable.appendChild(tr);
    }

    exploreThrobber.style.display = "none";
}

function setupExploreUI() {
    const input = document.getElementById("input-page-num");

    async function handlePageInput() {
        const pageNum = parseInt(input.value);
        if (!isNaN(pageNum) && pageNum >= 1) {
            await drawLatestDecksTable(pageNum);
        }
    }

    input.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
            await handlePageInput();
        }
    });

    input.addEventListener("input", async () => {
        await handlePageInput();
    });

    input.addEventListener("blur", async () => {
        await handlePageInput();
    });
}

export { drawLatestDecksTable, setupExploreUI }