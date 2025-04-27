
export default function useEditCard() {
    const editCard = (cardId: string, updatedCard: any) => {
        try {
            const cards = localStorage.getItem("cards") || "";
            if (!cards) {
                throw new Error("No cards found");
            }
            const parsedCards = JSON.parse(cards);
            const cardIndex = parsedCards.findIndex((card: any) => card.id === cardId);
            if (cardIndex === -1) {
                throw new Error("Card not found");
            }
            parsedCards[cardIndex] = { ...parsedCards[cardIndex], ...updatedCard };
            localStorage.setItem("cards", JSON.stringify(parsedCards));
        } catch (err: any) {
            console.error(err);
        }
    };

    return { editCard };
}
