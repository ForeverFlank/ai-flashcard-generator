"use strict";

import { BACKEND_URL } from "../config.js";

async function generateDeck() {
    try {
        const topic = document.getElementById("input-topic").value.trim();
        const count = document.getElementById("input-card-count").value;
        const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value;
        const mode = document.querySelector('input[name="mode"]:checked')?.value;

        const requestBody = {
            topic,
            count,
            difficulty,
            mode,
        };

        const token = localStorage.getItem("authToken");

        const res = await fetch(`${BACKEND_URL}/flashcards/generate-deck`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to generate deck");
        }

        const { deck } = await res.json();

        return deck;
    } catch (error) {
        console.error("Request deck error: ", error.message);
    }
}

async function uploadDeck(deck) {
    try {
        const token = localStorage.getItem("authToken");

        const res = await fetch(`${BACKEND_URL}/flashcards/upload-deck`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(deck),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to upload deck");
        }

        return true;
    } catch (error) {
        console.error("Request deck error: ", error.message);
        return false;
    }
}

async function getDecksByUsername(name) {
    try {
        const res = await fetch(`${BACKEND_URL}/users/${encodeURIComponent(name)}/decks`);

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to fetch decks");
        }

        const data = await res.json();
        return data.decks;
    } catch (error) {
        console.error("Error fetching decks by username:", error);
        throw error;
    }
}

export { generateDeck, uploadDeck, getDecksByUsername }