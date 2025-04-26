import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

interface DialogProps {
  onClose: () => void;
  isOpen: boolean;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl"; // Tamanhos do dialog
}

export default function Dialog({
  onClose,
  isOpen,
  children,
  title,
  size = "md",
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Fechar com tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Fechar ao clicar fora do dialog
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Impedir scroll do body quando o dialog estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Mapa de tamanhos
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop com blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={handleBackdropClick}
            data-testid="dialog-backdrop"
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
              }}
              className={`bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} overflow-hidden`}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? "dialog-title" : undefined}
            >
              {/* Cabeçalho do dialog (condicional) */}
              {title && (
                <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-gray-100">
                  <h2
                    id="dialog-title"
                    className="text-lg font-semibold text-gray-800"
                  >
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition duration-200"
                    aria-label="Fechar"
                  >
                    <IoClose size={20} />
                  </button>
                </div>
              )}

              {/* Conteúdo */}
              <div className={`p-6 ${!title ? "pt-4" : ""}`}>
                {!title && (
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition duration-200"
                      aria-label="Fechar"
                    >
                      <IoClose size={20} />
                    </button>
                  </div>
                )}
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
