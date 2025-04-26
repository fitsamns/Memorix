import clsx from "clsx";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { GoXCircle, GoCheck, GoPlus } from "react-icons/go";
import { RiQuestionLine, RiLightbulbLine } from "react-icons/ri";
import Dialog from "../../decks/components/dialog";
import { useState, useEffect } from "react";

interface CreateCardFormProps {
  question: string;
  answer: string;
}

interface CreateCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCardFormProps) => void;
  isSubmitting?: boolean;
}

export default function CreateCardDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CreateCardDialogProps) {
  const [charCount, setCharCount] = useState({
    question: 0,
    answer: 0,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields },
    reset,
  } = useForm<CreateCardFormProps>({
    mode: "onChange",
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  // Observar os valores para atualizar contadores de caracteres
  const questionValue = watch("question");
  const answerValue = watch("answer");

  // CORREÇÃO: Usar useEffect em vez de useState
  useEffect(() => {
    setCharCount({
      question: questionValue?.length || 0,
      answer: answerValue?.length || 0,
    });
  }, [questionValue, answerValue]); // Adicionar dependências

  const handleFormSubmit = (data: CreateCardFormProps) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog onClose={onClose} isOpen={isOpen}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary bg-opacity-10 p-2 rounded-full">
          <GoPlus className="text-2xl text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          Criar novo cartão
        </h2>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5"
      >
        {/* Campo de pergunta */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="question" className="text-gray-700 font-medium">
              Pergunta
            </label>
            <span
              className={clsx("text-xs", {
                "text-gray-400": charCount.question < 40,
                "text-amber-500":
                  charCount.question >= 40 && charCount.question < 50,
                "text-red-500": charCount.question >= 50,
              })}
            >
              {charCount.question}/50
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiQuestionLine className="h-5 w-5 text-gray-400" />
            </div>

            <input
              type="text"
              id="question"
              autoFocus
              placeholder="Ex: Qual é a capital da França?"
              {...register("question", {
                required: "Pergunta é obrigatória",
                minLength: {
                  value: 3,
                  message: "Pergunta deve ter pelo menos 3 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "Pergunta deve ter no máximo 50 caracteres",
                },
              })}
              className={clsx(
                "pl-10 pr-10 py-3 block w-full rounded-lg border bg-gray-50 transition-all duration-200",
                {
                  "border-red-500 ring-1 ring-red-500 bg-red-50":
                    errors.question && touchedFields.question,
                  "border-green-500 ring-1 ring-green-100 bg-green-50":
                    !errors.question &&
                    touchedFields.question &&
                    questionValue?.length >= 3,
                  "border-gray-300": !touchedFields.question,
                },
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              )}
            />

            {touchedFields.question &&
              questionValue?.length >= 3 &&
              !errors.question && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <GoCheck className="h-5 w-5 text-green-500" />
                </div>
              )}
          </div>

          {errors.question && touchedFields.question && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center text-red-500 text-sm mt-1.5 overflow-hidden"
            >
              <GoXCircle className="mr-1 flex-shrink-0" />
              <span>{errors.question.message}</span>
            </motion.div>
          )}
        </div>

        {/* Campo de resposta */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="answer" className="text-gray-700 font-medium">
              Resposta
            </label>
            <span
              className={clsx("text-xs", {
                "text-gray-400": charCount.answer < 40,
                "text-amber-500":
                  charCount.answer >= 40 && charCount.answer < 50,
                "text-red-500": charCount.answer >= 50,
              })}
            >
              {charCount.answer}/50
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiLightbulbLine className="h-5 w-5 text-gray-400" />
            </div>

            <input
              type="text"
              id="answer"
              placeholder="Ex: Paris"
              {...register("answer", {
                required: "Resposta é obrigatória",
                minLength: {
                  value: 1,
                  message: "Resposta é obrigatória",
                },
                maxLength: {
                  value: 50,
                  message: "Resposta deve ter no máximo 50 caracteres",
                },
              })}
              className={clsx(
                "pl-10 pr-10 py-3 block w-full rounded-lg border bg-gray-50 transition-all duration-200",
                {
                  "border-red-500 ring-1 ring-red-500 bg-red-50":
                    errors.answer && touchedFields.answer,
                  "border-green-500 ring-1 ring-green-100 bg-green-50":
                    !errors.answer &&
                    touchedFields.answer &&
                    answerValue?.length >= 1,
                  "border-gray-300": !touchedFields.answer,
                },
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              )}
            />

            {touchedFields.answer &&
              answerValue?.length >= 1 &&
              !errors.answer && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <GoCheck className="h-5 w-5 text-green-500" />
                </div>
              )}
          </div>

          {errors.answer && touchedFields.answer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center text-red-500 text-sm mt-1.5 overflow-hidden"
            >
              <GoXCircle className="mr-1 flex-shrink-0" />
              <span>{errors.answer.message}</span>
            </motion.div>
          )}
        </div>

        {/* Dica de criação de cartões */}
        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700 flex items-start">
          <div className="bg-blue-100 p-1 rounded-full mt-0.5 mr-2">
            <RiLightbulbLine className="text-blue-600" />
          </div>
          <p>
            Dica: perguntas específicas e respostas curtas são mais eficazes
            para memorização.
          </p>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={clsx(
              "px-5 py-2.5 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center min-w-[120px]",
              {
                "bg-primary hover:bg-primary-hover shadow-sm hover:shadow":
                  isValid && !isSubmitting,
                "bg-gray-400 cursor-not-allowed": !isValid || isSubmitting,
              }
            )}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Criando...
              </>
            ) : (
              "Criar cartão"
            )}
          </button>
        </div>
      </motion.form>
    </Dialog>
  );
}
