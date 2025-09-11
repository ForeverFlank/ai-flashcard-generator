const BACKEND_URL = "http://localhost:3222"

export async function requestFlashcards() {
    const userInput = document.getElementById("input-topic").value.trim();
    const cardCount = document.getElementById("input-card-count").value;
    const contentLength = document.getElementById("input-length").value;
    const difficulty = document.getElementById("input-difficulty").value;

    const body = {
        topic: userInput,
        cardCount: cardCount,
        contentLength: contentLength,
        difficulty: difficulty
    };

    const res = await fetch(`${BACKEND_URL}/flashcards`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }).then((r) => r.json());

    return JSON.parse(res.message);
}