import express from "express";

import { generateDeck } from "./controllers/flashcard-controller.js";
import { userLogin, userRegister } from "./controllers/user-controller.js";

const router = express.Router();

router.post("/flashcards/generate-deck", generateDeck);

router.post("/register", userRegister);
router.post("/login", userLogin);

export { router };