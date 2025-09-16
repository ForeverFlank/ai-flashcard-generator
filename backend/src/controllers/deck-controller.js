"use strict";

import Deck from "../models/deck-model.js";
import { generateDeckJSONFromLLM, modifyDeckJSONFromLLM } from "../llm.js";
import { User } from "../models/user-model.js";

async function generateDeck(req, res) {
    try {
        const { topic, count, difficulty, mode, name } = req.body;
        const user = req.user;

        if (!topic || !count || !difficulty || !mode) {
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
            return res.status(400).json({ error: "LLM generated data is not a valid JSON" });
        }
        
        const newDeck = await Deck.create({
            user,
            name: name || topic,
            topic,
            flashcards,
        });
        
        const response = newDeck.toObject();
        response.author = user?.name || "Anonymous";
        delete response.user;
        
        return res.status(201).json({ deck: response });
    } catch (error) {
        console.error("Error generating deck:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function modifyDeck(req, res) {
    try {
        const { prompt, flashcards } = req.body;
        
        if (!prompt || !flashcards) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        const modifiedFlashcards = await modifyDeckJSONFromLLM({
            prompt,
            flashcards
        });
        
        try {
            JSON.parse(modifiedFlashcards);
        } catch (error) {
            console.error("Failed to parse deck JSON from LLM:", error);
            return res.status(400).json({ error: "LLM generated data is not a valid JSON" });
        }

        return res.status(201).json({ flashcards: modifiedFlashcards });
    } catch (error) {
        console.error("Error generating deck:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function storeDeck(req, res) {
    try {
        const user = req.user;
        const { _id, topic, name, flashcards } = req.body;

        if (!user || !_id || !flashcards || !Array.isArray(flashcards)) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingDeck = await Deck.findById(_id);

        if (existingDeck && existingDeck.user.toString() === user._id.toString()) {
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

async function getDecksByUsername(req, res) {
    const { name } = req.params;

    try {
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const decks = await Deck.find({ user: user._id /*, public: true */ });

        const formatted = decks.map(deck => {
            const obj = deck.toObject();
            obj.author = user.name;
            delete obj.flashcards;
            delete obj.user;
            return obj;
        });

        return res.status(200).json({ decks: formatted });
    } catch (e) {
        console.error("Error fetching decks by username:", e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getDeckById(req, res) {
    try {
        const deckId = req.params.id;

        const deck = await Deck.findById(deckId).populate("user", "name");
        if (!deck) {
            return res.status(404).json({ error: "Deck not found" });
        }

        const response = deck.toObject();
        response.author = deck.user?.name || "Anonymous";
        delete response.user;

        return res.status(200).json({ deck: response });
    } catch (e) {
        console.error("Error fetching deck:", e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function deleteDeckById(req, res) {
    try {
        const deckId = req.params.id;
        const userId = req.user._id;

        const deleted = await Deck.findOneAndDelete({ _id: deckId, user: userId });
        if (!deleted) {
            return res.status(404).json({ error: "Deck not found or unauthorized" });
        }

        return res.status(200).json({ message: "Deck deleted successfully" });
    } catch (e) {
        console.error("Error deleting deck:", e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export {
    generateDeck,
    modifyDeck,
    storeDeck,
    getDecksByUsername,
    getDeckById,
    deleteDeckById
};