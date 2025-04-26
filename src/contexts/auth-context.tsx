import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import User from "../types/user";

type AuthContextProps = {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  logout: () => void;
  updateUserProfile: (userData: {
    name?: string;
    email?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextProps | null>(null);

// Constantes para localStorage
const STORAGE_KEYS = {
  USER_ID: "user_id",
  USERS: "users",
  AUTH_TIMESTAMP: "auth_timestamp",
};

// Funções auxiliares
const encryptPassword = (password: string): string => btoa(password);
const generateSessionTimestamp = () => Date.now().toString();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Memoizar a função checkAuth com useCallback para evitar recriação
  const checkAuth = useCallback(() => {
    try {
      const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      const authTimestamp = localStorage.getItem(STORAGE_KEYS.AUTH_TIMESTAMP);

      if (!userId) {
        setUser(null);
        return;
      }

      // Verificar se a sessão expirou (opcional - 24h de expiração)
      if (authTimestamp) {
        const lastAuth = parseInt(authTimestamp, 10);
        const currentTime = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;

        if (currentTime - lastAuth > oneDayMs) {
          // Sessão expirada
          localStorage.removeItem(STORAGE_KEYS.USER_ID);
          localStorage.removeItem(STORAGE_KEYS.AUTH_TIMESTAMP);
          setUser(null);
          return;
        }
      }

      // Buscar usuário
      const users = localStorage.getItem(STORAGE_KEYS.USERS);
      const parsedUsers = users ? JSON.parse(users) : [];
      const currentUser = parsedUsers.find((u: User) => u.id === userId);

      if (currentUser) {
        // Remover a senha antes de armazenar no state por segurança
        const { password, ...userWithoutPassword } = currentUser;
        setUser(userWithoutPassword as User);

        // Atualizar timestamp de autenticação
        localStorage.setItem(
          STORAGE_KEYS.AUTH_TIMESTAMP,
          generateSessionTimestamp()
        );
      } else {
        // Usuário não encontrado
        localStorage.removeItem(STORAGE_KEYS.USER_ID);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TIMESTAMP);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verificar autenticação no carregamento inicial
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login com tratamento de erros melhorado
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        return { success: false, error: "E-mail e senha são obrigatórios" };
      }

      const users = localStorage.getItem(STORAGE_KEYS.USERS);
      const parsedUsers = users ? JSON.parse(users) : [];
      const foundUser = parsedUsers.find(
        (user: User) =>
          user.email.toLowerCase() === email.toLowerCase() &&
          user.password === encryptPassword(password)
      );

      if (!foundUser) {
        return { success: false, error: "E-mail ou senha inválidos" };
      }

      // Armazenar ID do usuário e timestamp
      localStorage.setItem(STORAGE_KEYS.USER_ID, foundUser.id);
      localStorage.setItem(
        STORAGE_KEYS.AUTH_TIMESTAMP,
        generateSessionTimestamp()
      );

      // Remover a senha por segurança
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);

      navigate("/");
      return { success: true };
    } catch (error: any) {
      console.error("Error during login:", error);
      return {
        success: false,
        error: error?.message || "Erro ao fazer login. Tente novamente.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Cadastro com validações adicionais
  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Validações
      if (!name || name.length < 3) {
        return {
          success: false,
          error: "Nome deve ter pelo menos 3 caracteres",
        };
      }

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return { success: false, error: "E-mail inválido" };
      }

      if (!password || password.length < 6) {
        return {
          success: false,
          error: "Senha deve ter pelo menos 6 caracteres",
        };
      }

      const users = localStorage.getItem(STORAGE_KEYS.USERS);
      const parsedUsers = users ? JSON.parse(users) : [];

      // Verificar se o e-mail já existe (case insensitive)
      if (
        parsedUsers.some(
          (user: User) => user.email.toLowerCase() === email.toLowerCase()
        )
      ) {
        return { success: false, error: "E-mail já cadastrado" };
      }

      // Criar novo usuário
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password: encryptPassword(password),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Salvar usuário
      parsedUsers.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(parsedUsers));
      localStorage.setItem(STORAGE_KEYS.USER_ID, newUser.id);
      localStorage.setItem(
        STORAGE_KEYS.AUTH_TIMESTAMP,
        generateSessionTimestamp()
      );

      // Remover a senha por segurança
      // const { password: _, ...userWithoutPassword } = newUser;
      // setUser(userWithoutPassword);

      navigate("/");
      return { success: true };
    } catch (error: any) {
      console.error("Error during signup:", error);
      return {
        success: false,
        error: error?.message || "Erro ao fazer cadastro. Tente novamente.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Nova função para atualizar o perfil do usuário
  const updateUserProfile = async (userData: {
    name?: string;
    email?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (!user) {
        return { success: false, error: "Usuário não autenticado" };
      }

      // Validações
      if (userData.name && userData.name.length < 3) {
        return {
          success: false,
          error: "Nome deve ter pelo menos 3 caracteres",
        };
      }

      if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
        return { success: false, error: "E-mail inválido" };
      }

      const users = localStorage.getItem(STORAGE_KEYS.USERS);
      const parsedUsers = users ? JSON.parse(users) : [];

      // Verificar se o novo e-mail já está em uso por outro usuário
      if (
        userData.email &&
        userData.email.toLowerCase() !== user.email.toLowerCase() &&
        parsedUsers.some(
          (u: User) => u.email.toLowerCase() === userData.email!.toLowerCase()
        )
      ) {
        return { success: false, error: "E-mail já está em uso" };
      }

      // Atualizar usuário
      const updatedUsers = parsedUsers.map((u: User) => {
        if (u.id === user.id) {
          return {
            ...u,
            name: userData.name || u.name,
            email: userData.email || u.email,
            updatedAt: new Date().toISOString(),
          };
        }
        return u;
      });

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

      // Atualizar estado do usuário
      const updatedUser = {
        ...user,
        name: userData.name || user.name,
        email: userData.email || user.email,
        updatedAt: new Date().toISOString(),
      };

      setUser(updatedUser);

      return { success: true };
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      return {
        success: false,
        error: error?.message || "Erro ao atualizar perfil. Tente novamente.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout com limpeza de todos os dados relacionados
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TIMESTAMP);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  // Propriedade computada para verificar se o usuário está autenticado
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateUserProfile,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
