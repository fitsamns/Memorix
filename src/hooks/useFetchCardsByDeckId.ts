import { useCallback } from 'react';
import Card from '../types/card';

export default function useFetchCardsByDeckId() {
    const fetchCardsByDeckId = useCallback((deckId: string) => {
        try {
            const cards = localStorage.getItem("cards");
            const parsedCards = cards ? JSON.parse(cards) : [];
            const deckCards = parsedCards.filter((card: Card) => card.deckId === deckId);
            return deckCards;
        } catch (error) {
            console.error("Error fetching cards by deck ID:", error);
            return [];
        }
    }, []);

    return { fetchCardsByDeckId };
}