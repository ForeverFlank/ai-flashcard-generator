import { requestDeck } from "./api.js";
import { drawFlashcards } from "./ui.js";

const sampleFlashcards = [
    {
        q: "What is the primary function of photosynthesis?",
        a: "It is the process by which plants, algae, and some bacteria convert light energy from the sun into chemical energy in the form of glucose."
    },
    {
        q: "What are the two main stages of photosynthesis?",
        a: "The two main stages are the light-dependent reactions and the light-independent reactions, also known as the Calvin cycle."
    },
    {
        q: "What is the light-independent reaction also known as?",
        a: "It is also known as the Calvin cycle, which occurs in the chloroplasts of plant cells."
    },
    {
        q: "What molecule is produced in the light-dependent reactions?",
        a: "ATP and NADPH are produced in the light-dependent reactions."
    },
    {
        q: "What gas is essential for photosynthesis to occur?",
        a: "Carbon dioxide (CO2) is essential for photosynthesis to occur."
    },
    {
        q: "Where does photosynthesis primarily occur in a plant cell?",
        a: "It primarily occurs in the chloroplasts of plant cells."
    },
    {
        q: "What byproduct of photosynthesis is released into the atmosphere as oxygen?",
        a: "Glucose is produced in photosynthesis, but oxygen is a byproduct released into the atmosphere."
    },
    {
        q: "Are humans directly involved in photosynthesis?",
        a: "No, humans are not directly involved in the process of photosynthesis."
    }
];

export async function requestAndDrawFlashcards() {
    // const data = sampleFlashcards;
    const data = await requestDeck();
    drawFlashcards(data);
}