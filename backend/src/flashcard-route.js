import express from "express";

import { generateFlashcards } from "./flashcard-controller.js";

const router = express.Router();

router.post("/", generateFlashcards);

export { router };