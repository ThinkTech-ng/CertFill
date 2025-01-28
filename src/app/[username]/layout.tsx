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
        app.setConfig({ layout: 'default'})
    },[])
    return (
        <>{children}</>
    );
  }