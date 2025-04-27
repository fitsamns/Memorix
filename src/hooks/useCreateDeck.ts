import { useState } from "react";
import Deck from "../types/deck";
import { useAuth } from "../contexts/auth-context";

export default function useCreateDeck() {
    const [deck, setDeck] = useState<Deck | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user } = useAuth();

    const create = (deckData: any) => {
        setIsLoading(true);
        setError(null);

        try {
            const decks = localStorage.getItem("decks");
            const parsedDecks = decks ? JSON.parse(decks) : [];
            const newDeck: Deck = { ...deckData, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date(), userId: user?.id || "" };
            parsedDecks.push(newDeck);
            localStorage.setItem("decks", JSON.stringify(parsedDecks));
            setDeck(newDeck);
            setIsLoading(false);
        } catch (error) {
            console.error("Error during deck creation:", error);
            setError("Erro ao criar baralho");
            setIsLoading(false);
        }
    }
    return { create, deck, error, isLoading };
}
