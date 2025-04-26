import { useForm } from "react-hook-form";
import { GoXCircle } from "react-icons/go";
import clsx from "clsx";

export interface DeckFormValues {
  name: string;
  description?: string;
}

interface DeckFormProps {
  onSubmit: (data: DeckFormValues) => void;
  onCancel: () => void;
  defaultValues?: DeckFormValues;
  submitLabel?: string;
}

export default function DeckForm({
  onSubmit,
  onCancel,
  defaultValues = { name: "", description: "" },
  submitLabel = "Criar baralho",
}: DeckFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<DeckFormValues>({
    mode: "onChange",
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
          Nome do baralho
        </label>
        <input
          type="text"
          id="name"
          placeholder="Ex: Matemática Básica"
          {...register("name", {
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
          className={clsx(
            "border rounded-lg p-2.5 w-full bg-gray-50",
            {
              "border-red-500 ring-1 ring-red-500":
                errors.name && touchedFields.name,
              "border-gray-300": !errors.name,
            },
            "focus:outline-none focus:ring-2 focus:ring-primary"
          )}
        />
        {errors.name && touchedFields.name && (
          <div className="flex items-center text-red-500 text-sm mt-1">
            <GoXCircle className="mr-1" />
            {errors.name.message}
          </div>
        )}
      </div>
      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-gray-700 font-medium mb-2"
        >
          Descrição <span className="text-gray-400 text-xs">(opcional)</span>
        </label>
        <textarea
          id="description"
          placeholder="Descreva o conteúdo deste baralho..."
          {...register("description")}
          className="border border-gray-300 rounded-lg p-2.5 w-full h-28 resize-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className={clsx("px-4 py-2 rounded-lg text-white", {
            "bg-primary hover:bg-primary-hover cursor-pointer": isValid,
            "bg-gray-400 cursor-not-allowed": !isValid,
          })}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
