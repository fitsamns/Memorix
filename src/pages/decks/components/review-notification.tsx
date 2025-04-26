import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BsArrowRight, BsLightningCharge } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

interface ReviewNotificationProps {
  cardCount: number;
  className?: string;
}

export default function ReviewNotification({
  cardCount,
  className,
}: ReviewNotificationProps) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (cardCount > 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [cardCount]);

  const handleReviewClick = () => {
    navigate("/review"); // Use navigate ao invés de window.location
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (cardCount <= 0 || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className={clsx(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between",
          "bg-gradient-to-r from-primary-50 to-white",
          "rounded-xl p-4 sm:p-5",
          "border-l-4 border-primary shadow-sm",
          className
        )}
      >
        <div className="flex items-center mb-3 sm:mb-0">
          <div className="bg-primary bg-opacity-10 rounded-full p-2 mr-3">
            <BsLightningCharge className="text-xl text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Revisão pendente</h3>
            <p className="text-gray-600 text-sm">
              Você tem{" "}
              <motion.span
                animate={{ scale: isPulsing ? 1.2 : 1 }}
                className="font-bold text-primary inline-flex items-center"
              >
                {cardCount}
              </motion.span>{" "}
              {cardCount === 1 ? "cartão" : "cartões"} para revisar hoje
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDismiss}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Mais tarde
          </button>
          <button
            onClick={handleReviewClick}
            className="flex items-center justify-center gap-2 bg-primary text-white rounded-lg px-5 py-2 hover:bg-primary-hover transition-colors duration-200 shadow-sm hover:shadow"
          >
            <span>Revisar agora</span>
            <BsArrowRight className="text-lg" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
