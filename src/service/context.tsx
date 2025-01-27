"use client"
import { LoginUser } from "@/interface/user.dto";
import { safeJson } from "@/utils/utils";
import React, { createContext, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export interface AppContextType {
  user: LoginUser | null;
  projects: any[] | null;
  setUser: (user: string | null) => void;
  programs: any[];
  setPrograms: (token: string | null) => void;
  setProjects: (projects: string[]) => void;
}

export const AppContext = createContext<AppContextType>({
  user: null,
  projects: [],
  setUser: (user: LoginUser) => {},
  setProjects: (projects: any[]) => {},
  programs: [],
  setPrograms: (projects: any[]) => {},
});
interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [programs, setPrograms] = useLocalStorage<any[] | null>(
    "app-programs",
    null
  );
  const [projects, setProjects] = useLocalStorage<any[] | null>(
    "user-projects",
    null
  );
  // const [user, setUser] = useState<LoginUser | null>(null);
  const [user, setUser]  = useLocalStorage<LoginUser | null>("user-login", null);
  console.log({ user, projects });


  return (
    <AppContext.Provider
      value={{
        user,
        projects,
        setUser,
        setProjects,
        programs,
        setPrograms,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
