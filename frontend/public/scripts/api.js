"use strict";

import { Deck } from "./deck.js";

const BACKEND_URL = "http://localhost:3222"

export async function requestDeck() {
    const topic = document.getElementById("input-topic").value.trim();
    const count = document.getElementById("input-card-count").value;
    const length = document.querySelector('input[name="length"]:checked')?.value;
    const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value;

    const requestBody = {
        topic,
        cardCount: count,
        contentLength: length,
        difficulty,
    };

    const token = localStorage.getItem("authToken");

    const response = await fetch(`${BACKEND_URL}/flashcards/generate-deck`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate deck");
    }

    const { deck } = await response.json();

    return deck;
}