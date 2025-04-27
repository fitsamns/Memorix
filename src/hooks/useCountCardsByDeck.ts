import Card from '../types/card';

export default function useCountCardsByDeck() {
    const countCardsByDeck = (deckId: string) => {
        const cards = JSON.parse(localStorage.getItem("cards") || "[]");
        const count = cards.filter((card: Card) => card.deckId === deckId).length;
        return count;
    }

    return { countCardsByDeck };
}
