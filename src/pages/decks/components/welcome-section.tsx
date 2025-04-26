import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  BsArrowRightCircle,
  BsBarChart,
  BsCalendar3,
  BsClockHistory,
  BsGem,
  BsLightning,
  BsStars,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/auth-context";
import { useReviewContext } from "../../../contexts/review-context";
import useFetchDecks from "../../../hooks/useFetchDecks";

export default function WelcomeSection() {
  const { user } = useAuth();
  const { getCardsDueToday } = useReviewContext();
  const { decks } = useFetchDecks();
  const [expandStats, setExpandStats] = useState(false);

  const cardsToReview = getCardsDueToday();

  const stats = useMemo(() => {
    const totalDecks = decks.length;

    let totalCards = 0;
    let learnedCards = 0;
    let newCards = 0;
    let reviewingCards = 0;

    try {
      const cards = JSON.parse(localStorage.getItem("cards") || "[]");
      const userDeckIds = decks.map((deck) => deck.id);

      const userCards = cards.filter((card: any) =>
        userDeckIds.includes(card.deckId)
      );

      totalCards = userCards.length;
      learnedCards = userCards.filter(
        (card: any) => card.repetitions && card.repetitions > 2
      ).length;

      newCards = userCards.filter(
        (card: any) => !card.repetitions || card.repetitions === 0
      ).length;

      reviewingCards = userCards.filter(
        (card: any) =>
          card.repetitions && card.repetitions > 0 && card.repetitions <= 2
      ).length;
    } catch (err) {
      console.error("Erro ao calcular estatísticas de cartões:", err);
    }

    let studyDays = 0;
    let lastStudyDate = null;
    let streak = 0;

    try {
      if (user?.id) {
        const studyStatsKey = `study_stats_${user.id}`;
        const statsJson = localStorage.getItem(studyStatsKey);

        if (statsJson) {
          const studyData = JSON.parse(statsJson);
          studyDays = studyData.studyDays?.length || 0;
          lastStudyDate = studyData.lastStudyDate
            ? new Date(studyData.lastStudyDate)
            : null;

          if (studyData.studyDays?.length) {
            const sortedDays = [...studyData.studyDays].sort();
            const today = new Date().toISOString().split("T")[0];
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split("T")[0];

            if (
              sortedDays.includes(today) ||
              sortedDays.includes(yesterdayStr)
            ) {
              streak = 1;

              for (let i = 1; i < 100; i++) {
                const checkDate = new Date();
                checkDate.setDate(
                  checkDate.getDate() - (sortedDays.includes(today) ? i : i + 1)
                );
                const checkDateStr = checkDate.toISOString().split("T")[0];

                if (sortedDays.includes(checkDateStr)) {
                  streak++;
                } else {
                  break;
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Erro ao calcular estatísticas de estudo:", err);
    }

    return {
      totalDecks,
      totalCards,
      learnedCards,
      newCards,
      reviewingCards,
      studyDays,
      lastStudyDate,
      streak,
    };
  }, [decks, user?.id]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const formatLastStudyDate = (date: Date | null) => {
    if (!date) return "ainda não estudou";

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "hoje";
    if (date.toDateString() === yesterday.toDateString()) return "ontem";

    return `em ${format(date, "dd 'de' MMMM", { locale: ptBR })}`;
  };

  const getMotivationalMessage = () => {
    if (stats.streak >= 5) return `🔥 Sequência de ${stats.streak} dias!`;
    if (cardsToReview === 0) return "Parabéns, você está em dia! 🎉";
    if (cardsToReview > 10) return "Muitos cartões esperando por você!";
    return "Continue com o bom trabalho!";
  };

  const progress =
    stats.totalCards > 0
      ? Math.round((stats.learnedCards / stats.totalCards) * 100)
      : 0;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const expandVariants = {
    closed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mb-8"
    >
      {/* Cabeçalho principal com saudação */}
      <motion.div
        variants={item}
        className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-active rounded-2xl shadow-lg mb-6"
      >
        {/* Formas decorativas para efeito visual */}
        <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-white opacity-5"></div>
        <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-white opacity-5"></div>

        <div className="relative z-10 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Saudação e mensagem principal */}
            <div>
              <div className="flex items-center mb-1">
                <BsStars className="text-yellow-300 mr-2 text-xl" />
                <span className="text-yellow-200 font-medium">
                  {getMotivationalMessage()}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-white">
                {getGreeting()}, {user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-blue-100 max-w-lg">
                {cardsToReview > 0
                  ? `Você tem ${cardsToReview} cartões para revisar hoje. Mantenha seu progresso!`
                  : "Você está em dia com suas revisões. Excelente trabalho!"}
              </p>

              {/* Barra de progresso */}
              {stats.totalCards > 0 && (
                <div className="mt-4 mb-1">
                  <div className="flex justify-between text-xs text-blue-100 mb-1">
                    <span>Progresso de aprendizado</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2.5">
                    <motion.div
                      className="bg-white h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    ></motion.div>
                  </div>
                </div>
              )}
            </div>

            {/* Botão de revisão */}
            <div className="mt-5 md:mt-0">
              {cardsToReview > 0 ? (
                <Link to="/review">
                  <motion.div
                    className="bg-white hover:bg-blue-50 text-primary font-medium rounded-xl px-5 py-3.5 inline-flex items-center shadow-md"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="bg-primary bg-opacity-10 p-2 rounded-full mr-3">
                      <BsLightning className="text-white text-lg" />
                    </div>
                    <div>
                      <div className="text-sm text-primary-active font-medium">
                        Iniciar revisão
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-xl font-bold text-primary">
                          {cardsToReview}
                        </span>
                        <span className="text-xs text-primary-active ml-1 font-normal">
                          {cardsToReview === 1 ? "cartão" : "cartões"}
                        </span>
                      </div>
                    </div>
                    <BsArrowRightCircle className="ml-3 text-primary-active" />
                  </motion.div>
                </Link>
              ) : (
                <motion.div
                  className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-5 py-3.5 inline-flex items-center"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="bg-green-400 bg-opacity-20 p-2 rounded-full mr-3">
                    <BsGem className="text-green-300 text-lg" />
                  </div>
                  <div>
                    <div className="text-sm text-green-400 font-medium">
                      Revisões concluídas
                    </div>
                    <div className="text-lg font-bold text-green-500">
                      Tudo em dia!
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Estatísticas resumidas */}
      <motion.div
        variants={item}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3"
      >
        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm flex items-center hover:shadow-md transition-all"
          whileHover={{ y: -2, backgroundColor: "#f9fbff" }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="bg-blue-50 p-3 rounded-full mr-3 text-blue-500">
            <BsBarChart className="text-lg" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">
              Total de baralhos
            </p>
            <p className="text-xl font-bold text-gray-800">
              {stats.totalDecks}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm flex items-center hover:shadow-md transition-all"
          whileHover={{ y: -2, backgroundColor: "#f9fbff" }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="bg-green-50 p-3 rounded-full mr-3 text-green-500">
            <BsLightning className="text-lg" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">
              Total de cartões
            </p>
            <p className="text-xl font-bold text-gray-800">
              {stats.totalCards}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm flex items-center hover:shadow-md transition-all"
          whileHover={{ y: -2, backgroundColor: "#f9fbff" }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="bg-purple-50 p-3 rounded-full mr-3 text-purple-500">
            <BsCalendar3 className="text-lg" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Dias de estudo</p>
            <p className="text-xl font-bold text-gray-800">{stats.studyDays}</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm flex items-center hover:shadow-md transition-all"
          whileHover={{ y: -2, backgroundColor: "#f9fbff" }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="bg-amber-50 p-3 rounded-full mr-3 text-amber-500">
            <BsClockHistory className="text-lg" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Última sessão</p>
            <p className="text-xl font-bold text-gray-800">
              {formatLastStudyDate(stats.lastStudyDate)}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Botão para expandir estatísticas detalhadas */}
      <div className="flex justify-center mb-2">
        <motion.button
          onClick={() => setExpandStats(!expandStats)}
          className="text-sm text-primary hover:text-primary-hover flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {expandStats ? "Menos estatísticas" : "Mais estatísticas"}
          <motion.div
            animate={{ rotate: expandStats ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="ml-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg>
          </motion.div>
        </motion.button>
      </div>

      {/* Estatísticas detalhadas expansíveis */}
      <motion.div
        variants={expandVariants}
        initial="closed"
        animate={expandStats ? "open" : "closed"}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Estatísticas detalhadas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gráfico de distribuição de cartões */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Distribuição de cartões
              </h4>
              <div className="flex items-center mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className="bg-blue-400 h-2.5 rounded-full"
                    style={{
                      width: `${(stats.newCards / stats.totalCards) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {stats.newCards} novos
                </span>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className="bg-yellow-400 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (stats.reviewingCards / stats.totalCards) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {stats.reviewingCards} revisando
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className="bg-green-400 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (stats.learnedCards / stats.totalCards) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {stats.learnedCards} aprendidos
                </span>
              </div>
            </div>

            {/* Sequência de estudos */}
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-between">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Sua sequência de estudos
              </h4>
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="text-4xl font-bold text-amber-500">
                    {stats.streak}
                  </div>
                  <div className="text-xs text-gray-500">dias consecutivos</div>
                </div>
                <div className="flex-1">
                  {stats.streak > 0 ? (
                    <p className="text-sm text-gray-600">
                      {stats.streak >= 5 ? "Impressionante!" : "Bom trabalho!"}{" "}
                      Continue estudando diariamente para aumentar sua
                      sequência.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Comece a estudar hoje para iniciar sua sequência diária.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
