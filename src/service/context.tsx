"use client"
import { LoginUser } from "@/interface/user.dto";
import { safeJson } from "@/utils/utils";
import React, { createContext, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { getMyPrograms } from "./programs";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
const queryClient = new QueryClient()

export interface AppContextType {
  user: LoginUser | null;
  setUser: (user: Partial<LoginUser>) => void;
  config: Record<string, any>;
  setConfig: (config: Record<string, any>) => void;
  removeUser: ()=> void
}

export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: (user: Partial<LoginUser>) => {},
  config: {},
  setConfig: (config: Record<string, any>) => {},
  removeUser:()=>{}
});
interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  
  const [config, setConfig] = useLocalStorage<Record<string, any>>(
    "app-config",
    {}
  );
  const [user, setUserObject]  = useLocalStorage<LoginUser | null>("user-login", null);


  const handleConfig = (conf: Record<string, any>)=>{
    setConfig({...config, ...conf})
  }
  const setUser = (user: Partial<LoginUser> & Partial<LoginUser['user']>)=>{
    setUserObject((prev)=>({...(prev||{}), ...user, user: {...(prev?.user || {}), ...user, }} as LoginUser))
  }
  const removeUser = ()=> setUserObject({})


  return (
    <QueryClientProvider client={queryClient}>
    <AppContext.Provider
      value={{
        user,
        config,
        setUser,
        setConfig: handleConfig,
        removeUser
      }}
    >
      {children}
    </AppContext.Provider>
    </QueryClientProvider>
  );
};
