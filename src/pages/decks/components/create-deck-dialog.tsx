import { GoPlus } from "react-icons/go";
import Dialog from "./dialog";
import DeckForm from "./deck-form";

interface CreateDeckDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string }) => void;
}

export default function CreateDeckDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateDeckDialogProps) {
  return (
    <Dialog onClose={onClose} isOpen={isOpen}>
      <div className="flex items-center mb-4">
        <GoPlus className="text-3xl text-primary" />
        <h2 className="text-xl font-semibold text-gray-800 ml-2">
          Criar novo baralho
        </h2>
      </div>
      <DeckForm onSubmit={onSubmit} onCancel={onClose} />
    </Dialog>
  );
}
