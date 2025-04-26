import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import { useReviewContext } from "../../contexts/review-context";
import useCreateDeck from "../../hooks/useCreateDeck";
import useDeleteDeck from "../../hooks/useDeleteDeck";
import useFetchDecks from "../../hooks/useFetchDecks";
import CreateDeckDialog from "./components/create-deck-dialog";
import DecksList from "./components/decks-list";
import ReviewNotification from "./components/review-notification";
import UtilitiesBar from "./components/utilities-bar";
import WelcomeSection from "./components/welcome-section";

interface CreateDeckFormProps {
  name: string;
  description?: string;
}

export default function Page() {
  const { isLoading, error, refetch, sortedDecks } = useFetchDecks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState<
    "recent" | "alphabetical" | "byCardCount"
  >("recent");
  const [searchQuery, setSearchQuery] = useState("");

  const { reset } = useForm<CreateDeckFormProps>({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { create } = useCreateDeck();
  const { deleteDeck } = useDeleteDeck();
  const { cards, fetchCardsToReview, getCardsDueToday } = useReviewContext();
  const navigate = useNavigate();

  const getSortedDecks = () => {
    return sortedDecks[sortOption];
  };

  const filteredDecks = getSortedDecks().filter(
    (deck) =>
      !searchQuery ||
      deck.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateDeck = (data: CreateDeckFormProps) => {
    create(data);
    setIsDialogOpen(false);
    reset();

    setTimeout(() => {
      refetch();
    }, 100);
  };

  const handleDeleteDeck = (deckId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este baralho?")) {
      deleteDeck(deckId);
      refetch();
    }
  };

  useEffect(() => {
    fetchCardsToReview();
  }, [fetchCardsToReview]);

  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen pb-10">
      <Navbar />
      <main className="container mx-auto px-4 pt-8">
        <WelcomeSection />

        <UtilitiesBar
          error={error}
          refetch={refetch}
          onSearch={handleSearch}
          onNewDeck={() => setIsDialogOpen(true)}
        />

        {getCardsDueToday() > 0 && (
          <ReviewNotification cardCount={cards.length} className="mb-5" />
        )}

        <DecksList
          decks={filteredDecks}
          isLoading={isLoading}
          error={error}
          searchQuery={searchQuery}
          sortOption={sortOption}
          setSortOption={setSortOption}
          onDelete={handleDeleteDeck}
          onCreateNew={() => setIsDialogOpen(true)}
          onView={(deckId: string) => navigate(`/decks/${deckId}`)}
          cards={cards}
        />

        <CreateDeckDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={(data: { name: string; description?: string }) => {
            handleCreateDeck(data);
            reset();
          }}
        />
      </main>
    </div>
  );
}
