import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { BsLightning } from "react-icons/bs";
import { GoVersions } from "react-icons/go";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { RxAvatar } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo.png";
import { useAuth } from "../contexts/auth-context";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Fechar o menu quando clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        buttonRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-primary shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo e nome */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={Logo}
                alt="Memorix Logo"
                className="h-9 w-9 rounded-full"
              />
              <span className="ml-2 font-bold text-2xl text-white">
                Memorix
              </span>
            </Link>
          </div>

          {/* Links de navegação - visíveis em telas maiores */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/decks"
              className={clsx(
                "px-3 py-2 rounded-lg flex items-center text-sm font-medium transition-colors",
                isActive("/decks")
                  ? "bg-white text-primary"
                  : "text-white hover:bg-primary-dark"
              )}
            >
              <GoVersions className="mr-1.5" />
              Baralhos
            </Link>

            <Link
              to="/review"
              className={clsx(
                "px-3 py-2 rounded-lg flex items-center text-sm font-medium transition-colors",
                isActive("/review")
                  ? "bg-white text-primary"
                  : "text-white hover:bg-primary-dark"
              )}
            >
              <BsLightning className="mr-1.5" />
              Revisar
            </Link>

            {/* Menu do perfil */}
            <div className="relative ml-3">
              <button
                ref={buttonRef}
                type="button"
                className="flex items-center justify-center bg-primary-dark rounded-full p-1 text-white hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                id="user-menu-button"
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <span className="sr-only">Abrir menu do usuário</span>
                <RxAvatar className="h-7 w-7" strokeWidth={0.05} />
              </button>

              {/* Dropdown do perfil - agora com lógica correta de exibição */}
              {isProfileMenuOpen && (
                <div
                  ref={profileMenuRef}
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Seu Perfil
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={logout}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Botão mobile menu */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-dark focus:outline-none"
            >
              <span className="sr-only">Abrir menu principal</span>
              {isMobileMenuOpen ? (
                <HiOutlineX className="block h-6 w-6" />
              ) : (
                <HiOutlineMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary-dark">
            <Link
              to="/decks"
              className="block px-3 py-2 rounded-md text-white font-medium hover:bg-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <GoVersions className="inline-block mr-1.5" />
              Baralhos
            </Link>
            <Link
              to="/review"
              className="block px-3 py-2 rounded-md text-white font-medium hover:bg-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BsLightning className="inline-block mr-1.5" />
              Revisar
            </Link>
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-white font-medium hover:bg-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <RxAvatar className="inline-block mr-1.5" />
              Perfil
            </Link>
            <button
              className="block w-full text-left px-3 py-2 rounded-md text-white font-medium hover:bg-primary"
              onClick={logout}
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
