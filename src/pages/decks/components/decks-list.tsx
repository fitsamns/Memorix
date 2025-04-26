import { AnimatePresence, motion } from "framer-motion";
import { BsExclamationCircle } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import EmptyState from "../../../components/empty-state";
import DeckComponent from "./deck";
import Deck from "../../../types/deck";
import Card from "../../../types/card";

interface DecksListProps {
  decks: Deck[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  sortOption: "recent" | "alphabetical" | "byCardCount";
  setSortOption: (option: "recent" | "alphabetical" | "byCardCount") => void;
  onDelete: (deckId: string) => void;
  onCreateNew: () => void;
  onView: (deckId: string) => void;
  cards: Card[];
}

export default function DecksList({
  decks,
  isLoading,
  error,
  searchQuery,
  sortOption,
  setSortOption,
  onDelete,
  onCreateNew,
  onView,
}: DecksListProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      {/* Mostrar mensagem de erro se houver */}
      {error && <ErrorMessage error={error} />}

      {/* Cabeçalho da seção */}
      <ListHeader
        decksCount={decks.length}
        isLoading={isLoading}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* Conteúdo da lista */}
      <ListContent
        decks={decks}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onDelete={onDelete}
        onCreateNew={onCreateNew}
        onView={onView}
      />
    </motion.section>
  );
}

// Componentes internos
function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
      <BsExclamationCircle className="mr-2" />
      <span>{error}</span>
    </div>
  );
}

interface ListHeaderProps {
  decksCount: number;
  isLoading: boolean;
  sortOption: "recent" | "alphabetical" | "byCardCount";
  setSortOption: (option: "recent" | "alphabetical" | "byCardCount") => void;
}

function ListHeader({
  decksCount,
  isLoading,
  sortOption,
  setSortOption,
}: ListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h2 className="text-xl font-semibold text-gray-800">
        {!isLoading &&
          decksCount > 0 &&
          `${decksCount} ${decksCount === 1 ? "baralho" : "baralhos"}`}
        {isLoading && "Carregando baralhos..."}
      </h2>

      <div className="flex gap-2">
        <select
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
          value={sortOption}
          onChange={(e) => {
            setSortOption(
              e.target.value as "recent" | "alphabetical" | "byCardCount"
            );
          }}
          disabled={isLoading}
        >
          <option value="recent">Mais recentes</option>
          <option value="alphabetical">Nome</option>
          <option value="byCardCount">Nº cartões</option>
        </select>
      </div>
    </div>
  );
}

interface ListContentProps {
  decks: Deck[];
  isLoading: boolean;
  searchQuery: string;
  onDelete: (deckId: string) => void;
  onCreateNew: () => void;
  onView: (deckId: string) => void;
}

function ListContent({
  decks,
  isLoading,
  searchQuery,
  onDelete,
  onCreateNew,
  onView,
}: ListContentProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <EmptyState
        icon={<BsExclamationCircle className="text-4xl text-gray-400" />}
        title={
          searchQuery
            ? "Nenhum baralho encontrado"
            : "Você ainda não tem baralhos"
        }
        description={
          searchQuery
            ? `Não encontramos baralhos correspondentes a "${searchQuery}".`
            : "Crie seu primeiro baralho para começar a estudar."
        }
        action={
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors"
          >
            <GoPlus />
            Criar meu primeiro baralho
          </button>
        }
      />
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {decks.map((deck) => (
          <motion.div
            key={deck.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            layout
          >
            <DeckComponent deck={deck} onDelete={onDelete} onView={onView} />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}
