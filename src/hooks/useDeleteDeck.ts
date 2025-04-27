import { useState } from "react";
import Deck from "../types/deck";
import Card from "../types/card";

export default function useDeleteDeck() {
    const [error, setError] = useState(null);

    const deleteDeck = (deckId: string) => {
        try {
            const decks = localStorage.getItem("decks") || "";
            if (!decks) {
                throw new Error("No decks found");
            }
            const parsedDecks = JSON.parse(decks);
            const updatedDecks = parsedDecks.filter((d: Deck) => d.id !== deckId);
            const cards = localStorage.getItem("cards") || "";
            const parsedCards = JSON.parse(cards);
            const updatedCards = parsedCards.filter((card: Card) => card.deckId !== deckId);
            localStorage.setItem("cards", JSON.stringify(updatedCards));
            if (updatedDecks.length === parsedDecks.length) {
                throw new Error("Deck not found");
            }
            localStorage.setItem("decks", JSON.stringify(updatedDecks));
        } catch (err: any) {
            setError(err);
        }
    };

    return { deleteDeck, error };
}
