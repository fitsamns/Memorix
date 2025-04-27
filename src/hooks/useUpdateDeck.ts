import { useState } from 'react';
import Deck from '../types/deck';

export default function useUpdateDeck() {
    const [deck, setDeck] = useState<Deck | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function update(id: string, updatedDeckData: Partial<Deck>) {
        setIsLoading(true);
        setError(null);

        try {
            const decks = localStorage.getItem('decks');
            const parsedDecks = decks ? JSON.parse(decks) : [];
            const deckIndex = parsedDecks.findIndex((deck: Deck) => deck.id === id);

            if (deckIndex === -1) {
                throw new Error('Deck not found');
            }

            const updatedDeck = { ...parsedDecks[deckIndex], ...updatedDeckData, updatedAt: new Date() };
            parsedDecks[deckIndex] = updatedDeck;
            localStorage.setItem('decks', JSON.stringify(parsedDecks));
            setDeck(updatedDeck);
            setIsLoading(false);
        } catch (error) {
            console.error('Error during deck update:', error);
            setError('Erro ao atualizar baralho');
            setIsLoading(false);
        }
        return deck;
    }
    return { update, deck, error, isLoading };
}
