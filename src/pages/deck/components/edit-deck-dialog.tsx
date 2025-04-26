import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Dialog from "../../decks/components/dialog";
import Deck from "../../../types/deck";
import clsx from "clsx";

interface EditDeckDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
  deck: Deck | null;
}

export default function EditDeckDialog({
  isOpen,
  onClose,
  onSubmit,
  deck,
}: EditDeckDialogProps) {
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
  } = useForm<{ name: string; description: string }>({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (deck) {
      setValue("name", deck.name);
      setValue("description", deck.description || "");
    }
  }, [deck]);

  const handleFormSubmit = (data: { name: string; description: string }) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog onClose={onClose} isOpen={isOpen}>
      <h2 className="text-2xl font-bold mb-4">Editar baralho</h2>
      <form onSubmit={handleSubmitEdit(handleFormSubmit)}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Nome
          </label>
          <input
            type="text"
            id="name"
            {...registerEdit("name", {
              required: "Nome é obrigatório",
              minLength: {
                value: 3,
                message: "Nome deve ter pelo menos 3 caracteres",
              },
              maxLength: {
                value: 50,
                message: "Nome deve ter no máximo 50 caracteres",
              },
            })}
            className={`${
              errorsEdit.name && touchedFieldsEdit.name
                ? "border-red-500"
                : "border-gray-300"
            } border rounded-lg p-2 w-full`}
          />
          {errorsEdit.name && touchedFieldsEdit.name && (
            <p className="text-red-500 text-sm">{errorsEdit.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
            Descrição
          </label>
          <textarea
            id="description"
            {...registerEdit("description", {
              maxLength: {
                value: 200,
                message: "Descrição deve ter no máximo 200 caracteres",
              },
            })}
            className={`${
              errorsEdit.description && touchedFieldsEdit.description
                ? "border-red-500"
                : "border-gray-300"
            } border rounded-lg p-2 w-full`}
          />
          {errorsEdit.description && touchedFieldsEdit.description && (
            <p className="text-red-500 text-sm">
              {errorsEdit.description.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={!isValidEdit}
          className={clsx("bg-primary text-white rounded-lg px-4 py-2", {
            "opacity-50 cursor-not-allowed": !isValidEdit,
            "hover:bg-primary-hover cursor-pointer": isValidEdit,
          })}
        >
          Salvar
        </button>
      </form>
    </Dialog>
  );
}
