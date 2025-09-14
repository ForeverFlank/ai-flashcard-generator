"use strict";

import { BACKEND_URL } from "../config.js";

let loggedInUser = null;

async function signupUser(name, password) {
    try {
        const res = await fetch(`${BACKEND_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Registration failed");
        }

        const data = await res.json();
        localStorage.setItem("authToken", data.token);

        return data.token;
    } catch (error) {
        console.error("Registration error:", error.message);
        return false;
    }
}

async function loginUser(name, password) {
    try {
        const res = await fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Login failed");
        }

        const data = await res.json();
        localStorage.setItem("authToken", data.token);

        return data.token;
    } catch (error) {
        console.error("Login error:", error.message);
        return false;
    }
}

async function checkAuth() {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    try {
        const res = await fetch(`${BACKEND_URL}/check-auth`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 401) {
            localStorage.removeItem("authToken");
            return false;
        }

        loggedInUser = await res.json();
        return true;
    } catch (error) {
        console.error("Auth check failed:", error);
        return false;
    }
}

function signOut() {
    loggedInUser = null;
    localStorage.clear("authToken");
}

export { loggedInUser, loginUser, signupUser, checkAuth, signOut }