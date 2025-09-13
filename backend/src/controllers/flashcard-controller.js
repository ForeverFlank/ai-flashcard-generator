import Deck from "../models/deck.js";
import { generateDeckJSONFromLLM } from "../llm.js";

export const generateDeck = async (req, res) => {
    try {
        const { topic, cardCount, contentLength, difficulty, name } = req.body;
        const userId = req.user.userId;

        const flashcards = await generateDeckJSONFromLLM({
            topic,
            cardCount,
            contentLength,
            difficulty,
        });

        const newDeck = await Deck.create({
            user: userId,
            name: name || topic,
            topic,
            flashcards,
        });

        res.status(201).json({ deck: newDeck });
    } catch (e) {
        console.error("Error generating deck:", e);
        res.status(400).json({ error: "Bad Request" });
    }
};