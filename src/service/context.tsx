"use client"
import { LoginUser } from "@/interface/user.dto";
import { safeJson } from "@/utils/utils";
import React, { createContext, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { getMyPrograms } from "./programs";

export interface AppContextType {
  user: LoginUser | null;
  projects: any[] | null;
  setUser: (user: string | null) => void;
  config: Record<string, any>;
  setPrograms: (token: string | null) => void;
  setConfig: (config: Record<string, any>) => void;
}

export const AppContext = createContext<AppContextType>({
  user: null,
  projects: [],
  setUser: (user: LoginUser) => {},
  setProjects: (projects: any[]) => {},
  config: {},
  setConfig: (config: Record<string, any>) => {},
});
interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [programs, setPrograms] = useLocalStorage<any[] | null>(
    "app-programs",
    []
  );
  const [config, setConfig] = useLocalStorage<Record<string, any>>(
    "app-config",
    {}
  );
  const [user, setUser]  = useLocalStorage<LoginUser | null>("user-login", null);

  React.useEffect(()=>{
    (async()=>{
      console.log('jgj----pop')
      const data = await getMyPrograms()
      console.log('await----pop')

    })()
  }, [])

  const handleConfig = (conf: Record<string, any>)=>{
    setConfig({...config, ...conf})
  }


  return (
    <AppContext.Provider
      value={{
        user,
        config,
        setUser,
        programs,
        setConfig: handleConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
