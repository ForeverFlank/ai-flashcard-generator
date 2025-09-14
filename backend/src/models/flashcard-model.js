import mongoose from "mongoose";

const FlashcardSchema = new mongoose.Schema({
    q: { type: String, required: true },
    a: { type: String, required: true },
    metadata: {
        difficulty: { type: String, default: "medium", enum: ["easy", "medium", "hard"] },
        length: { type: String, default: "medium", enum: ["short", "medium", "long"] },
        lastEdited: { type: Date, default: Date.now }
    }
});

export { FlashcardSchema }