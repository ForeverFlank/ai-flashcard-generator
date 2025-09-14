"use strict";

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

function drawFlashcardsReadMode(deck) {
    const container = document.getElementById("flashcards-container");
    container.innerHTML = "";

    deck.flashcards.forEach((card) => {
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

        const questionInput = document.createElement("p");
        questionInput.innerText = card.q;

        const answerInput = document.createElement("p");
        answerInput.innerText = card.a;

        front.appendChild(questionInput);
        front.appendChild(leftBorder);
        back.appendChild(answerInput);

        inner.appendChild(front);
        inner.appendChild(back);

        flashcard.appendChild(inner);
        container.appendChild(flashcard);

        flashcard.addEventListener("click", () => {
            const classList = inner.classList;
            const flippedClass = "flashcard-flipped";
            const flipped = classList.contains(flippedClass);
            if (flipped) {
                classList.remove(flippedClass);
            } else {
                classList.add(flippedClass);
            }
        });
    });
}

function drawFlashcardsEditMode(deck) {
    const container = document.getElementById("flashcards-container");
    container.innerHTML = "";

    deck.flashcards.forEach((card) => {
        const flashcard = document.createElement("div");
        flashcard.classList.add("flashcard");

        const inner = document.createElement("div");
        inner.classList.add("flashcard-inner");

        const editor = document.createElement("div");
        editor.classList.add("flashcard-editor");

        const leftBorder = document.createElement("div");
        leftBorder.classList.add("flashcard-left-border");
        leftBorder.style.backgroundColor = getCardColor(card.q);

        const questionLabel = document.createElement("label");
        questionLabel.innerText = "Question";

        const answerLabel = document.createElement("label");
        answerLabel.innerText = "Answer";

        const questionInput = document.createElement("textarea");
        questionInput.value = card.q;
        questionInput.classList.add("card-input");
        questionInput.oninput = e => card.qEdited = e.target.value;

        const answerInput = document.createElement("textarea");
        answerInput.value = card.a;
        answerInput.classList.add("card-input");
        answerInput.oninput = e => card.aEdited = e.target.value;

        editor.appendChild(questionLabel);
        editor.appendChild(questionInput);
        editor.appendChild(answerLabel);
        editor.appendChild(answerInput);
        editor.appendChild(leftBorder);

        inner.appendChild(editor);

        flashcard.appendChild(inner);
        container.appendChild(flashcard);
    });
}


export { drawFlashcardsReadMode, drawFlashcardsEditMode }