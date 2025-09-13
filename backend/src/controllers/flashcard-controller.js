import Deck from "../models/deck.js";
import { generateDeckJSONFromLLM } from "../llm.js";

export const generateDeck = async (req, res) => {
    try {
        const { topic, cardCount, contentLength, mode, name } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(400).json({ error: "Bad Request" });
        }

        const deckJson = await generateDeckJSONFromLLM({
            topic,
            cardCount,
            contentLength,
            mode,
        });

        let deckData;
        try {
            deckData = JSON.parse(deckJson);
        } catch (e) {
            console.error("Error generating deck:", e);
            return res.status(400).json({ error: "LLM response is not a valid JSON" });
        }

        const newDeck = await Deck.create({
            user,
            name: name || topic,
            topic,
            flashcards: deckData,
        });

        const response = JSON.parse(JSON.stringify(newDeck));
        response.author = response.user.name;
        delete response.user;

        res.status(201).json({ deck: response });
    } catch (e) {
        console.error("Error generating deck:", e);
        res.status(400).json({ error: "Bad Request" });
    }
};