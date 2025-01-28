"use client"
import { AppContext } from "@/service/context";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const app = React.useContext(AppContext)

  React.useEffect(()=>{
    setTimeout(()=>{
      if (!app.user?.user.email){
        window.location.href = '/'
      }
    }, 4000)
  }, [app])
  return (
   children
  );
}
