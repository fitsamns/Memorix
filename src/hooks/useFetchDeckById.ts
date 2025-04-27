import { useCallback, useState } from 'react';
import Deck from '../types/deck';

export default function useFetchDeckById() {
    const [loading] = useState(false);
    const [error] = useState<string | null>(null);

    const fetchDeckById = useCallback((deckId: string): Deck | undefined => {
        if (!deckId) return undefined;

        try {
            const decks = localStorage.getItem('decks');
            const parsedDecks = decks ? JSON.parse(decks) : [];
            const foundDeck = parsedDecks.find((deck: Deck) => deck.id === deckId);

            if (!foundDeck) {
                return undefined;
            }

            const userId = localStorage.getItem('user_id');
            if (foundDeck.userId !== userId) {
                return undefined;
            }

            return foundDeck;
        } catch (err: any) {
            console.error("Erro ao buscar baralho:", err);
            return undefined;
        }
    }, []);

    return { loading, error, fetchDeckById };
}