"use client"
import Image from "next/image";
import thinktech from "@/public/thinktechLogo.svg";
import cert from "@/public/images/certImage.svg";
import logo from "@/public/certLogo.svg";
import Projects from "./projects";
import AppLayout from "@/components/template/layout";
import { AppContext } from "@/service/context";
import React from "react";
import { LoginUser } from "@/interface/user.dto";
import { InfoCard, ListCard } from "@/components/molecule/info-card";
import { Button } from "@/components/molecule/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/molecule/dropdown-menu"
import { CircleEllipsis } from 'lucide-react';

export default function Admin() {
  const {user} = React.use(AppContext).user as LoginUser
  
  const actions = [{ text: "Edit"}, { text: "Delete", className: "text-red-600"}]
  const onAction = async (data)=>{
    console.log({ data });
    
  }
  return (
    <div className="min-h-screen h-full p-5">
      <span className="text-2xl sm:text-3xl">Welcome {user?.name?.split(' ')[0]}!</span>
      
      <div className="grid grid-cols-2 gap-2 pt-14 sm:pt-28 pb-14">
        <InfoCard
          title="9"
          description="programs"
        />
        <InfoCard
          title="9k"
          description="downloads"
          className="bg-secondary"
        />
      </div>

      <Button variant={'dotted'} className="font-medium p-6 w-full border-black">
      Create New Certificate
      </Button>

      <div className="flex items-center gap-5 pt-10 pb-5">
        <span className="font-medium">PAST PROGRAMS</span>
        <hr className="flex-1 border-jumbo"/>
        </div>

        <div>
          {[1,2,3,4,5].map(()=>{
            return <ListCard title="Women Techsters Fellowship 2024 Women Techsters Fellowship 2024" actions={actions} onAction={onAction} />
          })}
        </div>
    </div>
  );
}
