import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { BsCalendarCheck, BsCardText } from "react-icons/bs";
import { TbTrash } from "react-icons/tb";
import useCountCardsByDeck from "../../../hooks/useCountCardsByDeck";
import type Deck from "../../../types/deck";

interface DeckProps {
  deck: Deck;
  onDelete: (deckId: string) => void;
  onView: (deckId: string) => void;
}

export default function DeckComponent({ deck, onDelete, onView }: DeckProps) {
  const [cardCount, setCardCount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const { countCardsByDeck } = useCountCardsByDeck();

  useEffect(() => {
    setCardCount(countCardsByDeck(deck.id));
    setLastUpdated(
      formatDistanceToNow(new Date(deck.updatedAt), {
        addSuffix: true,
        locale: ptBR,
      })
    );
  }, [deck.updatedAt, deck.id]);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Barra colorida no topo */}
      <div className="h-2 bg-gradient-to-r from-primary to-primary-hover"></div>

      <div className="p-5">
        {/* Cabeçalho */}
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300 truncate">
            {deck.name}
          </h2>

          {/* Botão deletar - agora é um botão com feedback hover */}
          <button
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
            onClick={() => onDelete(deck.id)}
            aria-label="Excluir baralho"
          >
            <TbTrash className="text-lg" />
          </button>
        </div>

        {/* Descrição com overflow elíptico para até 2 linhas */}
        <p className="text-gray-600 text-sm line-clamp-2 h-10 mb-3">
          {deck.description || "Sem descrição"}
        </p>

        {/* Metadados */}
        <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
          <div className="flex items-center">
            <BsCardText className="mr-1" />
            <span>{cardCount} cartões</span>
          </div>
          <div className="flex items-center">
            <BsCalendarCheck className="mr-1" />
            <span>Atualizado {lastUpdated}</span>
          </div>
        </div>

        {/* Botão de ação principal */}
        <button
          onClick={() => onView(deck.id)}
          className="group w-full mt-3 bg-primary-50 text-primary font-medium py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center overflow-hidden relative"
        >
          <span className="absolute inset-0 bg-primary transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 relative z-10 group-hover:text-white transition-colors duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
            Ver baralho
          </span>
        </button>
      </div>
    </div>
  );
}
