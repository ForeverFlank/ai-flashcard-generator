"use strict";

const BACKEND_URL = "http://localhost:3222"

async function registerUser(name, password) {
    try {
        const response = await fetch(`${BACKEND_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Registration failed");
        }

        const data = await response.json();
        console.log("Registered user ID:", data.userId);
        return data.userId;
    } catch (error) {
        console.error("Registration error:", error.message);
    }
}

async function loginUser(name, password) {
    try {
        const response = await fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Login failed");
        }

        const data = await response.json();
        console.log("Received auth token:", data.token);

        localStorage.setItem("authToken", data.token);

        return data.token;
    } catch (error) {
        console.error("Login error:", error.message);
    }
}

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
    } catch (error) {
        console.error("Request deck error: ", error.message);
    }
}

async function uploadDeck(deck) {
    try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${BACKEND_URL}/flashcards/upload-deck`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(deck),
        });
    
        if (!response.ok) {
            const errorData = await response.json();
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

export {
    registerUser,
    loginUser,
    generateDeck,
    uploadDeck,
    getDecksByUsername
}