import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BiSearch, BiTrash } from "react-icons/bi";
import { BsChevronDown, BsChevronExpand, BsChevronUp } from "react-icons/bs";
import { PiPencil } from "react-icons/pi";
import Card from "../../../types/card";

interface CardsTableProps {
  cards: Card[];
  onEditCard: (card: Card) => void;
  onDeleteCard: (cardId: string) => void;
}

export default function CardsTable({
  cards,
  onEditCard,
  onDeleteCard,
}: CardsTableProps) {
  const [sortField, setSortField] = useState<"question" | "answer" | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Função para alternar o estado de ordenação
  const toggleSort = (field: "question" | "answer") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Função para obter o ícone de ordenação
  const getSortIcon = (field: "question" | "answer") => {
    if (sortField !== field)
      return <BsChevronExpand className="ml-1 opacity-50" />;
    return sortDirection === "asc" ? (
      <BsChevronUp className="ml-1" />
    ) : (
      <BsChevronDown className="ml-1" />
    );
  };

  // Ordenar os cartões
  const sortedCards = [...cards].sort((a, b) => {
    if (!sortField) return 0;

    const valueA = a[sortField].toLowerCase();
    const valueB = b[sortField].toLowerCase();

    if (sortDirection === "asc") {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });

  // Toggle de expansão em dispositivos móveis
  const toggleExpand = (cardId: string) => {
    setExpandedCardId(expandedCardId === cardId ? null : cardId);
  };

  return (
    <div className="overflow-hidden shadow ring-opacity-5 rounded-lg">
      {/* Versão para desktop */}
      <div className="hidden md:block min-w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleSort("question")}
              >
                <div className="flex items-center">
                  Questão
                  {getSortIcon("question")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleSort("answer")}
              >
                <div className="flex items-center">
                  Resposta
                  {getSortIcon("answer")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCards.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-10 text-center text-gray-500 bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center">
                    <BiSearch className="text-3xl text-gray-400 mb-2" />
                    <p>Nenhum cartão encontrado</p>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence initial={false}>
                {sortedCards.map((card) => (
                  <motion.tr
                    key={card.id}
                    initial={{ opacity: 0, backgroundColor: "#f9fafb" }}
                    animate={{ opacity: 1, backgroundColor: "#ffffff" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="line-clamp-2">{card.question}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="line-clamp-2">{card.answer}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <button
                        onClick={() => onEditCard(card)}
                        className="inline-flex items-center justify-center px-3 py-1 bg-primary-50 text-primary rounded-md hover:bg-primary-100 transition-colors mr-2"
                      >
                        <PiPencil className="mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => onDeleteCard(card.id)}
                        className="inline-flex items-center justify-center px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                      >
                        <BiTrash className="mr-1" />
                        Excluir
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Versão para mobile */}
      <div className="md:hidden">
        <ul className="divide-y divide-gray-200">
          {sortedCards.length === 0 ? (
            <li className="px-4 py-10 text-center text-gray-500 bg-gray-50">
              <div className="flex flex-col items-center justify-center">
                <BiSearch className="text-3xl text-gray-400 mb-2" />
                <p>Nenhum cartão encontrado</p>
              </div>
            </li>
          ) : (
            sortedCards.map((card) => (
              <li key={card.id} className="px-4 py-4 bg-white">
                <div
                  className="cursor-pointer"
                  onClick={() => toggleExpand(card.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                      {card.question}
                    </div>
                    <div className="text-gray-500">
                      {expandedCardId === card.id ? (
                        <BsChevronUp />
                      ) : (
                        <BsChevronDown />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedCardId === card.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 border-t pt-2">
                          <div className="text-xs font-semibold uppercase text-gray-500 mb-1">
                            Resposta
                          </div>
                          <div className="text-sm text-gray-700 mb-3">
                            {card.answer}
                          </div>

                          <div className="flex space-x-2 mt-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditCard(card);
                              }}
                              className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-50 text-primary rounded-md hover:bg-primary-100 transition-colors text-sm"
                            >
                              <PiPencil className="mr-1" />
                              Editar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCard(card.id);
                              }}
                              className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm"
                            >
                              <BiTrash className="mr-1" />
                              Excluir
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {cards.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 text-right">
          <p className="text-sm text-gray-700">
            <span className="font-medium">{cards.length}</span>{" "}
            {cards.length === 1 ? "cartão" : "cartões"} no total
          </p>
        </div>
      )}
    </div>
  );
}
