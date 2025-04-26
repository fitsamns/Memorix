import { useState, useEffect, useRef } from "react";
import { GoSearch, GoX } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Pesquisar baralhos...",
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      className={`relative flex items-center rounded-lg border ${
        isFocused
          ? "border-primary shadow-sm ring-1 ring-primary-hover/30"
          : "border-gray-300"
      } bg-white transition-all duration-200 w-full ${className}`}
    >
      <div className="flex items-center justify-center pl-3 text-gray-400">
        <GoSearch className={`text-lg ${isFocused ? "text-primary" : ""}`} />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder={placeholder}
        className="w-full py-2.5 px-3 text-gray-700 rounded-lg bg-transparent focus:outline-none"
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <AnimatePresence>
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={handleClear}
            className="pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Limpar busca"
          >
            <GoX className="text-lg" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
