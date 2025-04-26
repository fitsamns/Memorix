import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BsArrowLeft, BsExclamationTriangle } from "react-icons/bs";
import Logo from "../../assets/logo-blue.png";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden text-center"
        >
          {/* Cabeçalho */}
          <div className="bg-primary text-white px-6 py-8">
            <div className="flex justify-center mb-4">
              <img
                src={Logo}
                alt="Memorix"
                className="w-16 h-16 bg-white rounded-full p-2"
              />
            </div>
            <div className="flex justify-center mb-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <BsExclamationTriangle className="text-4xl text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">404</h1>
            <p className="text-xl text-blue-100">Página não encontrada</p>
          </div>

          {/* Conteúdo */}
          <div className="p-8">
            <p className="text-gray-600 mb-6">
              Ops! Parece que você se perdeu. A página que você está procurando
              não existe ou foi movida.
            </p>

            <div className="space-y-4">
              <Link
                to="/"
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <BsArrowLeft className="mr-2" />
                Voltar para a página inicial
              </Link>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/decks"
                  className="text-primary hover:text-primary-hover hover:underline"
                >
                  Meus baralhos
                </Link>
                <span className="hidden sm:inline text-gray-400">•</span>
                <Link
                  to="/profile"
                  className="text-primary hover:text-primary-hover hover:underline"
                >
                  Meu perfil
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rodapé */}
        <div className="text-center mt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Memorix. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
