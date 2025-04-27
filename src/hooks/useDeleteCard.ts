
export default function useDeleteCard() {
    const deleteCard = (cardId: string) => {
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
            parsedCards.splice(cardIndex, 1);
            localStorage.setItem("cards", JSON.stringify(parsedCards));
        } catch (err: any) {
            console.error(err);
        }
    };

    return { deleteCard };
}
