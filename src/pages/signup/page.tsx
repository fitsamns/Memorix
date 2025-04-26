import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  GoXCircle,
  GoCheck,
  GoLock,
  GoMail,
  GoPerson,
  GoEye,
  GoEyeClosed,
} from "react-icons/go";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import clsx from "clsx";
import Logo from "../../assets/logo-blue.png";
import { AnimatePresence, motion } from "framer-motion";

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Page() {
  const [signupError, setSignupError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields, isSubmitting },
  } = useForm<SignupFormInputs>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { signup } = useAuth();

  const onSubmit = async (data: SignupFormInputs) => {
    setSignupError(null);
    const { name, email, password } = data;
    const { success, error } = await signup(name, email, password);

    if (!success && error) {
      setSignupError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Cabeçalho */}
          <div className="bg-primary text-white px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <img
                src={Logo}
                alt="Memorix"
                className="w-16 h-16 bg-white rounded-full p-2"
              />
            </div>
            <h1 className="text-3xl font-bold">Crie sua conta</h1>
            <p className="text-blue-100 mt-2">
              Comece a estudar com Memorix hoje mesmo
            </p>
          </div>

          {/* Formulário */}
          <div className="p-6 sm:p-8">
            <AnimatePresence>
              {signupError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center"
                >
                  <GoXCircle className="flex-shrink-0 mr-2" />
                  <span>{signupError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Nome */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nome completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GoPerson className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Seu nome completo"
                    {...register("name", {
                      required: "Nome é obrigatório",
                      minLength: {
                        value: 3,
                        message: "Nome deve ter pelo menos 3 caracteres",
                      },
                    })}
                    className={clsx(
                      "pl-10 pr-4 py-3 block w-full rounded-lg border bg-gray-50",
                      "focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none",
                      {
                        "border-red-500 bg-red-50":
                          errors.name && touchedFields.name,
                        "border-green-500 bg-green-50":
                          !errors.name && touchedFields.name,
                        "border-gray-300": !touchedFields.name,
                      }
                    )}
                  />
                  {touchedFields.name && !errors.name && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <GoCheck className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.name && touchedFields.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <GoXCircle className="mr-1 flex-shrink-0" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* E-mail */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GoMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="seu-email@exemplo.com"
                    {...register("email", {
                      required: "E-mail é obrigatório",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Formato de e-mail inválido",
                      },
                    })}
                    className={clsx(
                      "pl-10 pr-4 py-3 block w-full rounded-lg border bg-gray-50",
                      "focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none",
                      {
                        "border-red-500 bg-red-50":
                          errors.email && touchedFields.email,
                        "border-green-500 bg-green-50":
                          !errors.email && touchedFields.email,
                        "border-gray-300": !touchedFields.email,
                      }
                    )}
                  />
                  {touchedFields.email && !errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <GoCheck className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.email && touchedFields.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <GoXCircle className="mr-1 flex-shrink-0" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Senha */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GoLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Crie uma senha forte"
                    {...register("password", {
                      required: "Senha é obrigatória",
                      min: {
                        value: 6,
                        message: "Senha deve ter pelo menos 6 caracteres",
                      },
                    })}
                    className={clsx(
                      "pl-10 pr-10 py-3 block w-full rounded-lg border bg-gray-50",
                      "focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none",
                      {
                        "border-red-500 bg-red-50":
                          errors.password && touchedFields.password,
                        "border-green-500 bg-green-50":
                          !errors.password && touchedFields.password,
                        "border-gray-300": !touchedFields.password,
                      }
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <GoEyeClosed className="h-5 w-5" />
                    ) : (
                      <GoEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && touchedFields.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <GoXCircle className="mr-1 flex-shrink-0" />
                    {errors.password.message}
                  </p>
                )}
                {touchedFields.password && !errors.password && (
                  <p className="mt-1 text-xs text-gray-500 flex items-center">
                    <GoCheck className="mr-1 text-green-500" />
                    Senha válida
                  </p>
                )}
              </div>

              {/* Confirmar Senha */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirmar senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GoLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repita sua senha"
                    {...register("confirmPassword", {
                      required: "Confirmação de senha é obrigatória",
                      validate: (value) =>
                        value === watch("password") ||
                        "As senhas não coincidem",
                    })}
                    className={clsx(
                      "pl-10 pr-10 py-3 block w-full rounded-lg border bg-gray-50",
                      "focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none",
                      {
                        "border-red-500 bg-red-50":
                          errors.confirmPassword &&
                          touchedFields.confirmPassword,
                        "border-green-500 bg-green-50":
                          !errors.confirmPassword &&
                          touchedFields.confirmPassword,
                        "border-gray-300": !touchedFields.confirmPassword,
                      }
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <GoEyeClosed className="h-5 w-5" />
                    ) : (
                      <GoEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && touchedFields.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <GoXCircle className="mr-1 flex-shrink-0" />
                    {errors.confirmPassword.message}
                  </p>
                )}
                {touchedFields.confirmPassword && !errors.confirmPassword && (
                  <p className="mt-1 text-xs text-gray-500 flex items-center">
                    <GoCheck className="mr-1 text-green-500" />
                    Senhas conferem
                  </p>
                )}
              </div>

              {/* Botão de cadastro */}
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={clsx(
                  "relative w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white text-base font-medium transition-all duration-200 mt-6",
                  isValid && !isSubmitting
                    ? "bg-primary hover:bg-primary-hover"
                    : "bg-gray-400 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Criando sua conta...
                  </>
                ) : (
                  "Criar minha conta"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary-hover underline"
                >
                  Fazer login
                </Link>
              </p>
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
