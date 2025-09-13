import { userLogin, userRegister } from "./api.js";
import { requestAndDrawFlashcards } from "./flashcards.js";

document.addEventListener("DOMContentLoaded", () => {
    userLogin("admin", "admin");
    document.getElementById("btn-submit").addEventListener("click", (e) => {
        requestAndDrawFlashcards();
    });
});