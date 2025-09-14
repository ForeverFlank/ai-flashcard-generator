import mongoose from "mongoose";
import { FlashcardSchema } from "./flashcard-model.js";

const DeckSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    topic: { type: String, required: true },
    flashcards: [FlashcardSchema],
}, { timestamps: true });

DeckSchema.methods.addFlashcard = function (flashcard) {
    this.flashcards.push(flashcard);
    return this.save();
};

DeckSchema.methods.removeFlashcard = function (cardId) {
    this.flashcards = this.flashcards.filter(card => card._id.toString() !== cardId.toString());
    return this.save();
};

DeckSchema.methods.updateFlashcard = function (cardId, newData) {
    const card = this.flashcards.id(cardId);
    if (card) {
        if (newData.q) card.q = newData.q;
        if (newData.a) card.a = newData.a;
        if (newData.metadata) {
            card.metadata = {
                ...card.metadata.toObject(),
                ...newData.metadata,
                lastEdited: new Date(),
            };
        }
        return this.save();
    }
    return null;
};

const Deck = mongoose.model("Deck", DeckSchema);
export default Deck;