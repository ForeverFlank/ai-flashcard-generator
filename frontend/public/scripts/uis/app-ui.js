"use strict";

document.querySelectorAll('.input-number-group').forEach(group => {
    const input = group.querySelector('input[type="number"]');
    const btnAdd = group.querySelector('.input-number-plus');
    const btnSub = group.querySelector('.input-number-minus');

    btnAdd.addEventListener('click', () => {
        let val = parseInt(input.value) || 0;
        let max = parseInt(input.max) || Infinity;
        if (val < max) {
            input.value = val + 1;
            input.dispatchEvent(new Event("input"));
        }
    });

    btnSub.addEventListener('click', () => {
        let val = parseInt(input.value) || 0;
        let min = parseInt(input.min) || 0;
        if (val > min) {
            input.value = val - 1;
            input.dispatchEvent(new Event("input"));
        }
    });

    input.addEventListener("input", () => {
        let val = parseInt(input.value) || 0;
        const min = parseInt(input.min) || 0;
        const max = parseInt(input.max) || Infinity;
        if (val < min) input.value = min;
        if (val > max) input.value = max;
    });
});


function displayPages(pages) {
    const generatorPage = document.getElementById("generator-container");
    const loadingPage = document.getElementById("loading-container");
    const deckPage = document.getElementById("deck-container");
    const viewPage = document.getElementById("view-container");
    const userPage = document.getElementById("user-container");

    generatorPage.style.display = "none";
    loadingPage.style.display = "none";
    deckPage.style.display = "none";
    viewPage.style.display = "none";
    userPage.style.display = "none";

    pages.forEach((page) => {
        if (page === "generator") {
            generatorPage.style.display = "flex";
        } else if (page === "loading") {
            loadingPage.style.display = "flex";
        } else if (page === "deck") {
            deckPage.style.display = "flex";
        } else if (page === "view") {
            viewPage.style.display = "flex";
        } else if (page === "user") {
            userPage.style.display = "flex";
        }
    });

    window.scrollTo(0, 0);
}

export { displayPages }