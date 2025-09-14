import Deck from "../models/deck.js";
import { generateDeckJSONFromLLM } from "../llm.js";

async function generateDeck(req, res) {
    try {
        const { topic, count, difficulty, mode, name } = req.body;
        const user = req.user;

        if (!user || !topic || !count || !difficulty || !mode) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const deckJson = await generateDeckJSONFromLLM({
            topic,
            count,
            difficulty,
            mode,
        });

        let flashcards;
        try {
            flashcards = JSON.parse(deckJson);
        } catch (error) {
            console.error("Failed to parse deck JSON from LLM:", error);
            return res.status(400).json({ error: "Invalid deck format returned from LLM" });
        }

        const newDeck = await Deck.create({
            user,
            name: name || topic,
            topic,
            flashcards,
        });

        const response = newDeck.toObject();
        response.author = user.name;
        delete response.user;

        return res.status(201).json({ deck: response });
    } catch (error) {
        console.error("Error generating deck:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

async function storeDeck(req, res) {
    try {
        const user = req.user;
        const { _id, topic, name, flashcards } = req.body;

        if (!user || !_id || !flashcards || !Array.isArray(flashcards)) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingDeck = await Deck.findById(_id);

        if (!existingDeck) {
            return res.status(404).json({ error: "Deck not found" });
        }

        if (existingDeck.user._id.toString() === user._id.toString()) {
            existingDeck.topic = topic || existingDeck.topic;
            existingDeck.name = name || topic || existingDeck.name;
            existingDeck.flashcards = flashcards;

            await existingDeck.save();

            const response = existingDeck.toObject();
            response.author = user.name;
            delete response.user;

            return res.status(200).json({ deck: response });
        }

        const newDeck = await Deck.create({
            user,
            topic,
            name: name || topic,
            flashcards,
        });

        const response = newDeck.toObject();
        response.author = user.name;
        delete response.user;

        return res.status(201).json({ deck: response });

    } catch (e) {
        console.error("Error storing deck:", e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export { generateDeck, storeDeck }