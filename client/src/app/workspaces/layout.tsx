"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import DirectMessageBar from "./_components/Sidebar";
import Deneme from "./_components/Deneme";
import { usePathname } from "next/navigation";
import WorkspacesBar from "./_components/WorkspacesBar";
import { useState } from "react";
import MessagesPage from "../messages/[userId]/page";



interface WorkspaceIdLayoutProps {
    children: React.ReactNode;
};

const WorkspaceId = ({ children }: WorkspaceIdLayoutProps) => {
    const pathname = usePathname()
    const [render, setRender] = useState(false)
    const [userId, setUserId] = useState(null)
    const [authId, setAuthId] = useState(null)
    return (
        <SidebarProvider>
            <div className="w-full h-screen flex items-center justify-center">
                {
                    pathname === "/workspaces" ? <DirectMessageBar setRender={setRender} render={render} setUserId={setUserId} setAuthId={setAuthId} /> : <Deneme />
                }
                <main className="w-full h-full relative">
                    {
                        render ? <MessagesPage userId={userId} authId={authId} /> : children
                    }
                </main>
                <WorkspacesBar />
            </div>
        </SidebarProvider>
    );
};

export default WorkspaceId;

