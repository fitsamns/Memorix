import { BsArrowClockwise } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import SearchBar from "./searchbar";
import ReviewNotification from "./review-notification";
import Card from "../../../types/card";

interface UtilitiesBarProps {
  error: string | null;
  refetch: () => void;
  onSearch: (query: string) => void;
  onNewDeck: () => void;
  cards?: Card[];
}

export default function UtilitiesBar({
  error,
  refetch,
  onSearch,
  onNewDeck,
  cards = [],
}: UtilitiesBarProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <SearchBar onSearch={onSearch} placeholder="Pesquisar baralhos..." />

        <div className="flex items-center gap-2">
          {error && (
            <button
              onClick={refetch}
              className="flex items-center gap-1 text-primary hover:text-primary-hover"
              title="Tentar novamente"
            >
              <BsArrowClockwise className="text-lg" />
              Recarregar
            </button>
          )}

          <button
            onClick={onNewDeck}
            className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors duration-300"
          >
            <GoPlus className="text-xl" />
            Novo Baralho
          </button>
        </div>
      </div>

      {cards.length > 0 && (
        <div className="mb-6">
          <ReviewNotification cardCount={cards.length} className="mb-4" />
        </div>
      )}
    </>
  );
}
