import { generateFlashcardJSON } from "./llm.js";

/** @type {import("express").RequestHandler} */
export const generateFlashcards = async (req, res) => {
    try {
        const data = req.body;
        const output = await generateFlashcardJSON(data);
        res.status(200).json({ message: output });
    } catch (e) {
        console.error(e);
        res.status(400).json({ error: "Bad Request" });
    }
};
