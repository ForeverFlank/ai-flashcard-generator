export function drawFlashcards(data) {
    const container = document.getElementById("flashcards-container");

    for (const card of data) {
        const div = document.createElement("div");
        div.style.border = "1px solid black";
        container.appendChild(div);
        
        const questionText = document.createElement("p");
        const answerText = document.createElement("p");
        div.appendChild(questionText);
        div.appendChild(answerText);
        
        questionText.innerText = "Q: " + card.q;
        answerText.innerText = "A: " + card.a;
    }
}