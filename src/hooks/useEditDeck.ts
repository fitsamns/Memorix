
export default function useEditDeck() {
    const editDeck = (deckId: string, updatedDeck: any) => {
        try {
            const decks = localStorage.getItem("decks") || "";
            if (!decks) {
                throw new Error("No decks found");
            }
            const parsedDecks = JSON.parse(decks);
            const deckIndex = parsedDecks.findIndex((deck: any) => deck.id === deckId);
            if (deckIndex === -1) {
                throw new Error("Deck not found");
            }
            parsedDecks[deckIndex] = { ...parsedDecks[deckIndex], ...updatedDeck };
            localStorage.setItem("decks", JSON.stringify(parsedDecks));
        } catch (err: any) {
            console.error(err);
        }
    };

    return { editDeck };
}
