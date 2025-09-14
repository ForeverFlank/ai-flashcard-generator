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

export { registerUser, loginUser, generateDeck, uploadDeck }