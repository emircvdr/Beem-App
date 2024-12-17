"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./_components/Sidebar";
import Deneme from "./_components/Deneme";
import { usePathname } from "next/navigation";
import WorkspacesBar from "./_components/WorkspacesBar";
import { useState } from "react";
import MessagesPage from "./messages/[userId]/page";



interface HomeLayoutProps {
    children: React.ReactNode;
};

const Home = ({ children }: HomeLayoutProps) => {
    const pathname = usePathname();
    return (
        <SidebarProvider>
            <div className="w-full h-screen flex items-center justify-center">
                <Sidebar />
                <main className="w-full h-full relative">
                    {
                        pathname === "/home" ? children : <MessagesPage />
                    }
                </main>
                <WorkspacesBar />
            </div>
        </SidebarProvider>
    );
};

export default Home;

