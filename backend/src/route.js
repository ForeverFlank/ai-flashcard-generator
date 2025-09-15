import express from "express";

import { deleteDeckById, generateDeck, getDeckById, getDecksByUsername, storeDeck } from "./controllers/deck-controller.js";
import { loginUser, signupUser } from "./controllers/user-controller.js";
import { authMiddleware, checkAuth } from "./auth.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/check-auth", authMiddleware, checkAuth);

router.post("/flashcards/generate-deck", authMiddleware, generateDeck);
router.post("/flashcards/upload-deck", authMiddleware, storeDeck);

router.get("/users/:name/decks", getDecksByUsername);

router.get("/deck/:id", getDeckById);
router.delete("/deck/:id", authMiddleware, deleteDeckById);

export { router };