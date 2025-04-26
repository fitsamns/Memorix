import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import {
  BsArrowLeft,
  BsCalendarCheck,
  BsCardText,
  BsLightning,
} from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { PiPencil } from "react-icons/pi";
import { Link, useNavigate, useParams } from "react-router-dom";
import FloatingButton from "../../components/floating-button";
import Navbar from "../../components/navbar";
import useCreateCard from "../../hooks/useCreateCard";
import useDeleteCard from "../../hooks/useDeleteCard";
import useDeleteDeck from "../../hooks/useDeleteDeck";
import useEditCard from "../../hooks/useEditCard";
import useEditDeck from "../../hooks/useEditDeck";
import useFetchCardsByDeckId from "../../hooks/useFetchCardsByDeckId";
import useFetchDeckById from "../../hooks/useFetchDeckById";
import Card from "../../types/card";
import Deck from "../../types/deck";
import CardsTable from "./components/cards-table";
import CreateCardDialog from "./components/create-card-dialog";
import EditCardDialog from "./components/edit-card-dialog";
import EditDeckDialog from "./components/edit-deck-dialog";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, error, fetchDeckById } = useFetchDeckById();
  const [deck, setDeck] = useState<Deck | null | undefined>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const { fetchCardsByDeckId } = useFetchCardsByDeckId();
  const { editCard } = useEditCard();
  const { deleteCard } = useDeleteCard();
  const { createCard } = useCreateCard();
  const { deleteDeck } = useDeleteDeck();
  const { editDeck } = useEditDeck();

  const [isCreateCardDialogOpen, setIsCreateCardDialogOpen] = useState(false);
  const [isEditCardDialogOpen, setIsEditCardDialogOpen] = useState(false);
  const [isEditDeckDialogOpen, setIsEditDeckDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDeck = useCallback(() => {
    if (!id || id === "" || id === "undefined") {
      setDeck(null);
      return;
    }
    const fetchedDeck = fetchDeckById(id);
    setDeck(fetchedDeck);
  }, [id, fetchDeckById]);

  const fetchCards = useCallback(() => {
    if (!id) return;

    const fetchedCards = fetchCardsByDeckId(id);
    setCards(fetchedCards);
  }, [id, fetchCardsByDeckId]);

  // Carregar dados do baralho
  useEffect(() => {
    fetchDeck();
  }, [fetchDeck]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const filteredCards = searchQuery
    ? cards.filter(
        (card) =>
          card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cards;

  const handleCreateCard = (data: { question: string; answer: string }) => {
    const newCard = createCard(id || "", {
      question: data.question,
      answer: data.answer,
    });

    if (newCard) {
      setCards((prevCards) => [...prevCards, newCard]);
      setIsCreateCardDialogOpen(false);
    }
  };

  const handleEditCard = (data: { question: string; answer: string }) => {
    if (!selectedCard) return;

    editCard(selectedCard.id, {
      question: data.question,
      answer: data.answer,
    });

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === selectedCard.id
          ? {
              ...card,
              question: data.question,
              answer: data.answer,
              updatedAt: new Date(),
            }
          : card
      )
    );

    setIsEditCardDialogOpen(false);
  };

  const handleDeleteCard = (cardId: string) => {
    deleteCard(cardId);
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
  };

  const handleEditDeck = (data: { name: string; description?: string }) => {
    if (!deck) return;

    editDeck(deck.id, {
      name: data.name,
      description: data.description,
    });

    setDeck((prevDeck) =>
      prevDeck
        ? {
            ...prevDeck,
            name: data.name,
            description: data.description || "",
            updatedAt: new Date(),
          }
        : null
    );

    setIsEditDeckDialogOpen(false);
  };

  const handleDeleteDeck = () => {
    if (!deck) return;

    deleteDeck(deck.id);
    navigate("/decks", { replace: true });
  };

  // CORREÇÃO: Função de navegação para evitar redirecionamento duplicado
  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/decks");
  };

  // Renderização condicional para estados de carregamento e erro
  if (loading) {
    return (
      <div className="bg-slate-200 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="mt-4 text-gray-600">Carregando baralho...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-200 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
            <div className="text-red-500 text-5xl mb-4">
              <BiTrash className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Erro ao carregar baralho
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/decks"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition duration-300"
            >
              Voltar para Baralhos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="bg-slate-200 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2">Baralho não encontrado</h2>
            <p className="text-gray-600 mb-6">
              O baralho que você está procurando não existe ou foi removido.
            </p>
            <Link
              to="/decks"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition duration-300"
            >
              Voltar para Baralhos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
            >
              <h3 className="text-xl font-bold mb-2">Excluir baralho</h3>
              <p className="text-gray-600 mb-4">
                Tem certeza que deseja excluir o baralho "{deck.name}"? Esta
                ação não pode ser desfeita e todos os cartões serão perdidos.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteDeck}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingButton onClick={() => setIsCreateCardDialogOpen(true)}>
        <GoPlus className="text-2xl" />
        Adicionar cartão
      </FloatingButton>

      <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          {/* CORREÇÃO: Botão de voltar - removido onClick que causava loop */}
          <Link
            to="/decks"
            className="inline-flex items-center mb-6 bg-white rounded-full p-2 shadow-sm text-gray-600 hover:text-primary hover:shadow-md transition duration-300"
            aria-label="Voltar para baralhos"
            onClick={handleBackClick}
          >
            <BsArrowLeft className="text-xl" />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-md rounded-xl p-6 mb-6"
          >
            {/* Resto do componente permanece igual */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {deck.name}
                </h1>
                <p className="text-gray-500 mt-1">
                  Criado em{" "}
                  {format(new Date(deck.createdAt), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIsEditDeckDialogOpen(true)}
                  className="inline-flex items-center bg-primary-50 text-primary px-4 py-2 rounded-lg hover:bg-primary-100 transition duration-200"
                >
                  <PiPencil className="mr-1.5" />
                  Editar baralho
                </button>
                <button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="inline-flex items-center bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition duration-200"
                >
                  <BiTrash className="mr-1.5" />
                  Excluir
                </button>
              </div>
            </div>

            {deck.description && (
              <p className="text-gray-700 mb-4 bg-gray-50 p-4 rounded-lg">
                {deck.description}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <BsCardText className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total de cartões</p>
                  <p className="text-xl font-bold text-blue-700">
                    {cards.length}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <BsLightning className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Para revisar hoje</p>
                  <p className="text-xl font-bold text-green-700">
                    {
                      cards.filter((card) => {
                        if (!card.nextReviewAt) return true;
                        return new Date(card.nextReviewAt) <= new Date();
                      }).length
                    }
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <BsCalendarCheck className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Última atualização</p>
                  <p className="text-xl font-bold text-purple-700">
                    {format(new Date(deck.updatedAt), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar nos cartões..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {filteredCards.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                {searchQuery ? (
                  <div>
                    <p className="text-gray-500 mb-2">
                      Nenhum cartão encontrado para "{searchQuery}"
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-primary hover:underline"
                    >
                      Limpar busca
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-500 mb-4">
                      Você ainda não tem cartões neste baralho.
                    </p>
                    <button
                      onClick={() => setIsCreateCardDialogOpen(true)}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition duration-200"
                    >
                      <GoPlus className="inline-block mr-1" />
                      Adicionar seu primeiro cartão
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <CardsTable
                cards={filteredCards}
                onEditCard={(card) => {
                  setSelectedCard(card);
                  setIsEditCardDialogOpen(true);
                }}
                onDeleteCard={handleDeleteCard}
              />
            )}
          </motion.div>
        </main>
      </div>

      <CreateCardDialog
        isOpen={isCreateCardDialogOpen}
        onClose={() => setIsCreateCardDialogOpen(false)}
        onSubmit={handleCreateCard}
      />

      <EditCardDialog
        isOpen={isEditCardDialogOpen}
        onClose={() => setIsEditCardDialogOpen(false)}
        card={selectedCard}
        onSubmit={handleEditCard}
      />

      <EditDeckDialog
        isOpen={isEditDeckDialogOpen}
        onClose={() => setIsEditDeckDialogOpen(false)}
        deck={deck}
        onSubmit={handleEditDeck}
      />
    </>
  );
}
