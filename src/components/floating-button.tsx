import clsx from "clsx";
import { ReactNode } from "react";

interface FloatingButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function FloatingButton({
  children,
  onClick,
}: FloatingButtonProps) {
  return (
    <>
      <button
        className={clsx(
          "flex items-center justify-center bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-hover transition duration-300",
          "cursor-pointer",
          "fixed bottom-5 right-5 z-30"
        )}
        onClick={onClick}
      >
        <>{children}</>
      </button>
    </>
  );
}
