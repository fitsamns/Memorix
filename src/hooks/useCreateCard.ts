import Card from "../types/card";

export default function useCreateCard() {
    const createCard = (deckId: string, card: { question: string; answer: string }) => {
        try {
            const cards = localStorage.getItem("cards") || "";
            const parsedCards = cards ? JSON.parse(cards) : [];
            const newCard: Card = {
                ...card,
                id: crypto.randomUUID(),
                deckId,
                easinessFactor: 2.5,
                interval: 1,
                repetitions: 0,
                nextReviewAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            parsedCards.push(newCard);
            localStorage.setItem("cards", JSON.stringify(parsedCards));
            return newCard;
        } catch (error) {
            console.error("Error creating card:", error);
            return null;
        }
    }

    return { createCard };
}
