import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getMe } from '../services/user.service';
import type { User } from '../types/User';

type UserContextType = {
  user: User | undefined;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({ user: undefined, isLoading: true, refreshUser: async () => {} });

export function useUser() {
  return useContext(UserContext);
}

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function refreshUser() {
    setIsLoading(true);
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      console.error(error);
      setUser(undefined)
    }
    setIsLoading(false);
  }

  // Fazer lógica para obter informações do usuário do back-end
  useEffect(() => {
    refreshUser();
  }, []);

  return <UserContext.Provider value={{ user, isLoading, refreshUser }}>{children}</UserContext.Provider>;
}
