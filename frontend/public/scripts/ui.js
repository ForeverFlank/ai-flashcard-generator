const colorPallets = ["#f4c348ff", "#4fdd98ff", "#469defff", "#ed55ebff"];

function getCardColor(question) {
    let n = 0xCED7;
    for (const char of question) {
        n ^= char.charCodeAt(0);
        n += 67;
        n = n ^ (n << 1);
        n %= colorPallets.length;
    }
    return colorPallets[n];
}

export function drawFlashcards(data) {
    const container = document.getElementById("flashcards-container");

    for (const card of data) {
        const flashcard = document.createElement("div");
        flashcard.classList.add("flashcard");

        const inner = document.createElement("div");
        inner.classList.add("flashcard-inner");

        const front = document.createElement("div");
        front.classList.add("flashcard-front");
        const back = document.createElement("div");
        back.classList.add("flashcard-back");

        const leftBorder = document.createElement("div");
        leftBorder.classList.add("flashcard-left-border");
        leftBorder.style.backgroundColor = getCardColor(card.q);

        const question = document.createElement("p");
        question.innerText = card.q;

        const answer = document.createElement("p");
        answer.innerText = card.a;

        front.appendChild(question);
        front.appendChild(leftBorder);
        back.appendChild(answer);

        inner.appendChild(front);
        inner.appendChild(back);

        flashcard.appendChild(inner);
        container.appendChild(flashcard);
    }
}