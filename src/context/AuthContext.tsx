import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getMe } from '../services/user.service';
import type { User } from '../types/User';

type UserContextType = {
  user: User | undefined;
  isLoading: boolean
};

export const UserContext = createContext<UserContextType>({ user: undefined, isLoading: true });

export function useUser() {
  return useContext(UserContext);
}

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fazer lógica para obter informações do usuário do back-end
  useEffect(() => {
    async function getUserData() {
      setIsLoading(true);
      const userData = await getMe();
      setUser(userData);
      setIsLoading(false);
    }
    getUserData();
  }, []);

  return <UserContext.Provider value={{ user, isLoading }}>{children}</UserContext.Provider>;
}
