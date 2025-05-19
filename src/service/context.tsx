'use client';
import { LoginUser } from '@/interface/user.dto';
import React, { createContext, useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export interface AppContextType {
  user: LoginUser | null;
  setUser: (user: Partial<LoginUser>) => void;
  config: Record<string, string>;
  setConfig: (config: Record<string, string>) => void;
  removeUser: () => void;
}

export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  config: {},
  setConfig: () => {},
  removeUser: () => {},
});

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const [config, setConfig] = useLocalStorage<Record<string, string>>('app-config', {});
  const [user, setUserObject] = useLocalStorage<LoginUser | null>('user-login', null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleConfig = (conf: Record<string, string>) => {
    setConfig({ ...config, ...conf });
  };

  const setUser = (user: Partial<LoginUser> & Partial<LoginUser['user']>) => {
    setUserObject(
      (prev) =>
        ({
          ...(prev || {}),
          ...user,
          user: { ...(prev?.user || {}), ...user },
        }) as LoginUser,
    );
  };

  const removeUser = () => setUserObject(null);

  // Only render children after client-side hydration
  if (!isClient) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider
        value={{
          user,
          config,
          setUser,
          setConfig: handleConfig,
          removeUser,
        }}
      >
        {children}
      </AppContext.Provider>
    </QueryClientProvider>
  );
};
