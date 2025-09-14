import express from "express";

import { generateDeck, storeDeck } from "./controllers/flashcard-controller.js";
import { userLogin, userRegister } from "./controllers/user-controller.js";
import { authMiddleware } from "./auth.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);

router.post("/flashcards/generate-deck", authMiddleware, generateDeck);
router.post("/flashcards/upload-deck", authMiddleware, storeDeck);

export { router };