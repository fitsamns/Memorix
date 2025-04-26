import clsx from "clsx";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { GoXCircle } from "react-icons/go";
import Card from "../../../types/card";
import Dialog from "../../decks/components/dialog";

interface EditCardFormProps {
  question: string;
  answer: string;
}

interface EditCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditCardFormProps) => void;
  card: Card | null;
}

export default function EditCardDialog({
  isOpen,
  onClose,
  onSubmit,
  card,
}: EditCardDialogProps) {
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: {
      errors: errorsEdit,
      isValid: isValidEdit,
      touchedFields: touchedFieldsEdit,
    },
    reset,
    setValue,
  } = useForm<EditCardFormProps>({
    mode: "onChange",
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  useEffect(() => {
    if (card) {
      setValue("question", card.question);
      setValue("answer", card.answer);
    }
  }, [card]);

  const handleFormSubmit = (data: EditCardFormProps) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog onClose={onClose} isOpen={isOpen}>
      <h2 className="text-2xl font-bold mb-4">Editar cartão</h2>
      <form onSubmit={handleSubmitEdit(handleFormSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="question"
            className="block text-gray-700 font-bold mb-2"
          >
            Pergunta
          </label>
          <input
            type="text"
            id="question"
            {...registerEdit("question", {
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
              "border rounded-lg p-2 w-full",
              {
                "border-red-500":
                  errorsEdit.question && touchedFieldsEdit.question,
                "border-gray-300": !errorsEdit.question,
              },
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
          />
          {errorsEdit.question && touchedFieldsEdit.question && (
            <div className="flex items-center text-red-500 text-sm mt-1">
              <GoXCircle className="mr-1" />
              {errorsEdit.question.message}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="answer"
            className="block text-gray-700 font-bold mb-2"
          >
            Resposta
          </label>
          <input
            type="text"
            id="answer"
            {...registerEdit("answer", {
              required: "Resposta é obrigatória",
              minLength: {
                value: 3,
                message: "Resposta deve ter pelo menos 3 caracteres",
              },
              maxLength: {
                value: 50,
                message: "Resposta deve ter no máximo 50 caracteres",
              },
            })}
            className={clsx(
              "border rounded-lg p-2 w-full",
              {
                "border-red-500": errorsEdit.answer && touchedFieldsEdit.answer,
                "border-gray-300": !errorsEdit.answer,
              },
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
          />
          {errorsEdit.answer && touchedFieldsEdit.answer && (
            <div className="flex items-center text-red-500 text-sm mt-1">
              <GoXCircle className="mr-1" />
              {errorsEdit.answer.message}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={!isValidEdit}
          className={clsx("bg-primary text-white rounded-lg px-4 py-2", {
            "opacity-50 cursor-not-allowed": !isValidEdit,
            "hover:bg-primary-hover": isValidEdit,
          })}
        >
          Editar cartão
        </button>
      </form>
    </Dialog>
  );
}
