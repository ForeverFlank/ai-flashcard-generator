class User {
    constructor() {
        this.id = 0;
        this.name = "";
        this.decks = [];
    }

    addDeck(deck) {
        this.decks.push(deck);
    }

    getDeckById(id) {
        return this.decks.find(deck => deck.id === id);
    }
}

export { User }