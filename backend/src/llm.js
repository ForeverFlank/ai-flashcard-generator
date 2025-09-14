"use strict";

import { GoogleGenAI } from "@google/genai";
import { systemPrompt } from "./system-prompt.js";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function generateDeckJSONFromLLM(data) {
    const { topic, count, difficulty, mode } = data;

    const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history: [
            {
                role: "model",
                parts: [{ text: systemPrompt }],
            },
        ],
    });

    const response = await chat.sendMessage({
        message: `
            Topic: ${topic}
            Count: ${count}
            Difficulty: ${difficulty}
            Mode: ${mode}
        `.trim(),
    });

    const cleanedJson = response.text
        .replace(/^```json\s*/, "")
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "")
        .trim();

    return cleanedJson;
}
