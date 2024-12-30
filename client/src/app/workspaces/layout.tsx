"use client";

import { SidebarProvider } from "@/components/ui/sidebar";

import { usePathname } from "next/navigation"; 1
import { useState } from "react";
import WorkspacesBar from "../home/_components/WorkspacesBar";
import Deneme from "./_components/WorkspacesSideBar";



interface HomeLayoutProps {
    children: React.ReactNode;
};

const Home = ({ children }: HomeLayoutProps) => {
    const pathname = usePathname();
    return (
        <SidebarProvider>
            <div className="w-full h-screen flex items-center justify-center">
                <Deneme />
                <main className="w-full h-full relative">
                    {children}
                </main>
                <WorkspacesBar />
            </div>
        </SidebarProvider>
    );
};

export default Home;

