import express from "express";

import { deleteDeckById, generateDeck, getDeckById, getDecksByUsername, storeDeck } from "./controllers/deck-controller.js";
import { userLogin, userRegister } from "./controllers/user-controller.js";
import { authMiddleware } from "./auth.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);

router.post("/flashcards/generate-deck", authMiddleware, generateDeck);
router.post("/flashcards/upload-deck", authMiddleware, storeDeck);

router.get("/users/:name/decks", getDecksByUsername);

router.get("/deck/:id", authMiddleware, getDeckById);
router.delete("/deck/:id", authMiddleware, deleteDeckById);

export { router };