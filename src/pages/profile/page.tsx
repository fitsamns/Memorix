import clsx from "clsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import {
  BsArrowLeft,
  BsBarChart,
  BsCalendar,
  BsGear,
  BsPerson,
} from "react-icons/bs";
import { GoXCircle } from "react-icons/go";
import { PiPencil } from "react-icons/pi";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar";
import { useAuth } from "../../contexts/auth-context";
import useFetchDecks from "../../hooks/useFetchDecks";
import Dialog from "../decks/components/dialog";

export default function Page() {
  const { user, logout, updateUserProfile } = useAuth();
  const { decks } = useFetchDecks();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  // Calcular estatísticas
  const stats = {
    totalDecks: decks.length,
    totalCards: decks.reduce((total, deck) => {
      // Buscar cartões desse deck
      const cards = JSON.parse(localStorage.getItem("cards") || "[]");
      const deckCards = cards.filter((card: any) => card.deckId === deck.id);
      return total + deckCards.length;
    }, 0),
    studyDays: 0, // Implementar futuramente com dados reais
    memberSince: user?.createdAt
      ? format(new Date(user.createdAt), "dd 'de' MMMM 'de' yyyy", {
          locale: ptBR,
        })
      : "--",
  };

  // Atualizar usuário
  const handleUpdateProfile = async () => {
    // Validação
    const newErrors: { name?: string; email?: string } = {};

    // ... suas validações permanecem as mesmas ...

    // Se tiver erros, não continua
    if (Object.keys(newErrors).length > 0) return;

    try {
      const result = await updateUserProfile({
        name: formData.name,
        email: formData.email,
      });

      if (result.success) {
        setIsEditDialogOpen(false);
      } else {
        setErrors({ ...errors });
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  if (!user) {
    return (
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isConfirmLogoutOpen && (
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
              <h3 className="text-xl font-bold mb-2">Sair da conta</h3>
              <p className="text-gray-600 mb-4">
                Tem certeza que deseja sair da sua conta? Você precisará fazer
                login novamente para acessar seus baralhos.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsConfirmLogoutOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Sair
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen pb-10">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          {/* Botão de voltar */}
          <Link
            to="/"
            className="inline-flex items-center mb-6 bg-white rounded-full p-2 shadow-sm text-gray-600 hover:text-primary hover:shadow-md transition duration-300"
            aria-label="Voltar para página inicial"
          >
            <BsArrowLeft className="text-xl" />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* Coluna da esquerda - Perfil */}
            <div className="lg:col-span-1">
              <motion.div
                className="bg-white shadow-md rounded-xl p-6 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                    <BsPerson className="text-white text-4xl" />
                  </div>

                  <h1 className="text-2xl font-bold text-gray-800">
                    {user.name}
                  </h1>
                  <p className="text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Membro desde {stats.memberSince}
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  <button
                    onClick={() => {
                      setFormData({ name: user.name, email: user.email });
                      setIsEditDialogOpen(true);
                    }}
                    className="w-full py-3 flex items-center justify-center gap-2 text-primary hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <PiPencil />
                    Editar perfil
                  </button>

                  <button
                    onClick={() => setIsConfirmLogoutOpen(true)}
                    className="w-full py-3 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <BiLogOut />
                    Sair da conta
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Coluna da direita - Estatísticas */}
            <div className="lg:col-span-3">
              <motion.div
                className="bg-white shadow-md rounded-xl p-6 mb-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Estatísticas
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Estatística - Baralhos */}
                  <div className="bg-blue-50 p-4 rounded-lg flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <BsBarChart className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total de baralhos</p>
                      <p className="text-xl font-bold text-blue-700">
                        {stats.totalDecks}
                      </p>
                    </div>
                  </div>

                  {/* Estatística - Cartões */}
                  <div className="bg-green-50 p-4 rounded-lg flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <BsPerson className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total de cartões</p>
                      <p className="text-xl font-bold text-green-700">
                        {stats.totalCards}
                      </p>
                    </div>
                  </div>

                  {/* Estatística - Dias de estudo */}
                  <div className="bg-purple-50 p-4 rounded-lg flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <BsCalendar className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dias de estudo</p>
                      <p className="text-xl font-bold text-purple-700">
                        {stats.studyDays}
                      </p>
                    </div>
                  </div>

                  {/* Estatística - Membro desde */}
                  <div className="bg-amber-50 p-4 rounded-lg flex items-center">
                    <div className="bg-amber-100 p-3 rounded-full mr-4">
                      <BsGear className="text-amber-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Membro desde</p>
                      <p className="text-xl font-bold text-amber-700">
                        {stats.memberSince}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Seção de Configurações */}
              <motion.div
                className="bg-white shadow-md rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Configurações
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Notificações por e-mail
                      </h3>
                      <p className="text-sm text-gray-500">
                        Receba lembretes para revisar seus cartões
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">Tema escuro</h3>
                      <p className="text-sm text-gray-500">
                        Mudar para o tema escuro da aplicação
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Compartilhamento de dados
                      </h3>
                      <p className="text-sm text-gray-500">
                        Compartilhar estatísticas anônimas de uso
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>

      <Dialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      >
        <div className="flex items-center mb-4">
          <PiPencil className="text-3xl text-primary" />
          <h2 className="text-xl font-semibold text-gray-800 ml-2">
            Editar perfil
          </h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateProfile();
          }}
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={clsx(
                "border rounded-lg p-2.5 w-full bg-gray-50",
                {
                  "border-red-500 ring-1 ring-red-500": errors.name,
                  "border-gray-300": !errors.name,
                },
                "focus:outline-none focus:ring-2 focus:ring-primary"
              )}
            />
            {errors.name && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <GoXCircle className="mr-1" />
                {errors.name}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={clsx(
                "border rounded-lg p-2.5 w-full bg-gray-50",
                {
                  "border-red-500 ring-1 ring-red-500": errors.email,
                  "border-gray-300": !errors.email,
                },
                "focus:outline-none focus:ring-2 focus:ring-primary"
              )}
            />
            {errors.email && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <GoXCircle className="mr-1" />
                {errors.email}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
