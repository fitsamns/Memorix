import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BsArrowLeft,
  BsCheckCircle,
  BsLightningCharge,
  BsX,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar";
import {
  ResponseQuality,
  useReviewContext,
} from "../../contexts/review-context";

export default function ReviewPage() {
  const {
    cards,
    currentCard,
    currentCardIndex,
    showAnswer,
    toggleShowAnswer,
    answerCard,
    isFinished,
    resetReview,
    progress,
    isLoading,
    fetchCardsToReview,
  } = useReviewContext();

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized) {
      fetchCardsToReview(true);
      setHasInitialized(true);
    }
  }, [hasInitialized, fetchCardsToReview]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-700">Carregando cartões para revisão...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
            <div className="text-center mb-6">
              <BsCheckCircle className="text-6xl text-green-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-4">
              Nenhum cartão para revisar
            </h2>
            <p className="text-gray-700 mb-6">
              Você está em dia com suas revisões! Volte mais tarde ou adicione
              novos cartões aos seus baralhos.
            </p>
            <Link
              to="/decks"
              className="bg-primary text-white rounded-lg px-6 py-3 font-medium hover:bg-primary-hover transition duration-200 inline-block"
            >
              Voltar para Baralhos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md"
          >
            <div className="bg-green-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
              <BsCheckCircle className="text-6xl text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Revisão Concluída!</h2>
            <p className="text-gray-700 mb-6">
              Você revisou com sucesso todos os {cards.length} cartões. Continue
              assim para melhorar sua retenção!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => resetReview()}
                className="bg-primary text-white rounded-lg px-6 py-3 font-medium hover:bg-primary-hover transition duration-200 flex items-center justify-center"
              >
                <BsLightningCharge className="mr-2" />
                Revisar Novamente
              </button>
              <Link
                to="/decks"
                className="bg-gray-200 text-gray-800 rounded-lg px-6 py-3 font-medium hover:bg-gray-300 transition duration-200"
              >
                Voltar para Baralhos
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const getCardDueInfo = () => {
    if (!currentCard || !currentCard.easinessFactor) return null;

    let status = "Novo";
    let statusClass = "bg-blue-100 text-blue-600";

    if (currentCard.repetitions) {
      if (currentCard.repetitions === 1) {
        status = "Aprendendo";
        statusClass = "bg-yellow-100 text-yellow-600";
      } else if (currentCard.repetitions === 2) {
        status = "Revisando";
        statusClass = "bg-orange-100 text-orange-600";
      } else {
        status = "Aprendido";
        statusClass = "bg-green-100 text-green-600";
      }
    }

    return { status, statusClass };
  };

  const cardInfo = getCardDueInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <Navbar />

      {/* Botão de voltar */}
      <Link
        to="/decks"
        className="absolute top-20 left-4 bg-white rounded-full p-2.5 shadow-md text-gray-600 hover:text-primary transition duration-200 z-10"
        aria-label="Voltar"
      >
        <BsArrowLeft className="text-xl" />
      </Link>

      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Barra de progresso */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
            />
          </div>
        </div>

        {/* Contador de cartões */}
        <div className="text-center mb-6 text-gray-600">
          Cartão {currentCardIndex + 1} de {cards.length}
        </div>

        {/* Card */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCardIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Cabeçalho do card com metadados */}
              {cardInfo && (
                <div className="flex justify-between items-center px-6 pt-4 pb-2">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${cardInfo.statusClass}`}
                  >
                    {cardInfo.status}
                  </span>
                  {currentCard?.deckId && (
                    <Link
                      to={`/decks/${currentCard.deckId}`}
                      className="text-xs text-gray-500 hover:text-primary"
                    >
                      Ver baralho
                    </Link>
                  )}
                </div>
              )}

              {/* Pergunta */}
              <div className="p-6 pt-2 bg-gray-50">
                <h3 className="text-sm uppercase font-semibold text-primary mb-2">
                  Pergunta
                </h3>
                <div className="text-2xl font-medium text-gray-800 min-h-[80px] flex items-center">
                  {currentCard?.question}
                </div>
              </div>

              {/* Resposta (condicional) */}
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 border-t border-gray-200"
                  >
                    <h3 className="text-sm uppercase font-semibold text-green-600 mb-2">
                      Resposta
                    </h3>
                    <div className="text-2xl font-medium text-gray-800 min-h-[80px] flex items-center">
                      {currentCard?.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botões de ação */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                {!showAnswer ? (
                  <button
                    onClick={toggleShowAnswer}
                    className="w-full bg-primary text-white py-3.5 rounded-lg font-medium hover:bg-primary-hover transition duration-200 shadow-sm"
                  >
                    Mostrar Resposta
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-center text-sm text-gray-600 mb-2">
                      Como você se saiu com este cartão?
                    </p>

                    <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
                      <button
                        onClick={() => answerCard(ResponseQuality.INCORRECT)}
                        className="flex flex-col items-center justify-center bg-red-500 text-white py-2 px-1 rounded-lg hover:bg-red-600 transition duration-200"
                      >
                        <BsX className="text-xl mb-1" />
                        <span className="text-xs">Errei</span>
                      </button>

                      <button
                        onClick={() => answerCard(ResponseQuality.HARD)}
                        className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-200"
                      >
                        Difícil
                      </button>

                      <button
                        onClick={() => answerCard(ResponseQuality.DIFFICULT)}
                        className="bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
                      >
                        Regular
                      </button>

                      <button
                        onClick={() => answerCard(ResponseQuality.EASY)}
                        className="bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-500 transition duration-200"
                      >
                        Fácil
                      </button>

                      <button
                        onClick={() => answerCard(ResponseQuality.GOOD)}
                        className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Bom
                      </button>

                      <button
                        onClick={() => answerCard(ResponseQuality.PERFECT)}
                        className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
                      >
                        Perfeito
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Instruções */}
        {!showAnswer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-sm text-gray-600 bg-blue-50 p-4 rounded-lg max-w-md mx-auto"
          >
            <p>
              Tente lembrar da resposta antes de clicar em "Mostrar Resposta"
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
