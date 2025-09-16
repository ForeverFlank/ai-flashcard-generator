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

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Request deck error: ", error.message);
    }
}

async function modifyDeck(deck) {
    try {
        const prompt = document.getElementById("input-edit-prompt").value.trim();
        const flashcards = deck.flashcards.map((card) => {
            return {
                q: card.qEdited || card.q,
                a: card.aEdited || card.a
            }
        });

        const requestBody = {
            prompt,
            flashcards
        };

        const res = await fetch(`${BACKEND_URL}/flashcards/modify-deck`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to generate deck");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Modify deck error: ", error.message);
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

async function getDeckById(id) {
    try {
        const token = localStorage.getItem("authToken");

        const res = await fetch(`${BACKEND_URL}/deck/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to fetch deck");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching deck:", error.message);
        return null;
    }
}

async function getDecksByUsername(name) {
    try {
        const res = await fetch(`${BACKEND_URL}/users/${encodeURIComponent(name)}/decks`, {
            method: "GET"
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to fetch decks");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching decks by username:", error);
        throw error;
    }
}

async function deleteDeckById(id) {
    try {
        const token = localStorage.getItem("authToken");

        const res = await fetch(`${BACKEND_URL}/deck/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to delete deck");
        }

        const result = await res.json();
        // console.log("Deck deleted:", result.message);
        return true;

    } catch (error) {
        console.error("Error deleting deck:", error.message);
        return false;
    }
}

async function getLatestDecks(pageNum) {
    try {
        const res = await fetch(`${BACKEND_URL}/deck/latest/${pageNum}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to fetch latest decks");
        }

        const data = await res.json();
        return data.decks;
    } catch (error) {
        console.error("Error fetching latest decks:", error.message);
        return [];
    }
}

export {
    generateDeck,
    modifyDeck,
    uploadDeck,
    getDeckById,
    getDecksByUsername,
    deleteDeckById,
    getLatestDecks
}