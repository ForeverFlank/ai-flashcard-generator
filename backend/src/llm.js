"use strict";

import { GoogleGenAI } from "@google/genai";
import { systemPrompt } from "./system-prompt.js";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function generateDeckJSONFromLLM(data) {
    const { topic, cardCount, contentLength, mode } = data;

    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
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
            Count: ${cardCount}
            Length: ${contentLength}
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
