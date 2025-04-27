import { useEffect, useState, useCallback } from "react";
import Deck from "../types/deck";
import { useAuth } from "../contexts/auth-context";

export interface FetchDecksResponse {
  decks: Deck[];
  error: string | null;
  isLoading: boolean;
  refetch: () => void;
  sortedDecks: {
    recent: Deck[];
    alphabetical: Deck[];
    byCardCount: Deck[];
  };
}

export default function useFetchDecks(): FetchDecksResponse {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  const fetchDecks = useCallback(() => {
    setIsLoading(true);

    try {
      const storedDecks = localStorage.getItem("decks");

      if (!storedDecks) {
        setDecks([]);
        return;
      }

      const parsedDecks: Deck[] = JSON.parse(storedDecks);

      const userDecks = user
        ? parsedDecks.filter((deck: Deck) => deck.userId === user.id)
        : [];

      setDecks(userDecks);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar baralhos:", err);
      setError("Não foi possível carregar seus baralhos. Tente novamente.");
      setDecks([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const sortedDecks = {
    recent: [...decks].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ),

    alphabetical: [...decks].sort((a, b) =>
      a.name.localeCompare(b.name)
    ),

    byCardCount: [...decks].sort((a, b) => {
      const cards = JSON.parse(localStorage.getItem("cards") || "[]");
      const countA = cards.filter((card: any) => card.deckId === a.id).length;
      const countB = cards.filter((card: any) => card.deckId === b.id).length;
      return countB - countA;
    }),
  };

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "decks") {
        fetchDecks();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchDecks]);

  return {
    decks,
    error,
    isLoading,
    refetch: fetchDecks,
    sortedDecks,
  };
}