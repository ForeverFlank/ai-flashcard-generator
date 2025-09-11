import Groq from "groq-sdk";
import { systemPrompt } from "./system-prompt.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateFlashcardJSON(data) {
    const topic = data.topic;
    const cardCount = data.cardCount;
    const contentLength = data.contentLength;
    const difficulty = data.difficulty;


    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            {
                role: "user",
                content: `
                    Topic: ${topic},
                    Count: ${cardCount},
                    Length: ${contentLength},
                    Difficulty: ${difficulty}
                `
            },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: true,
        stop: null
    });

    let fullResponse = "";

    for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
            fullResponse += content;
        }
    }

    return fullResponse;
}
