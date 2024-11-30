"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import DirectMessageBar from "./_components/DirectMessageBar";
import Deneme from "./_components/Deneme";
import { usePathname } from "next/navigation";
import WorkspacesBar from "./_components/WorkspacesBar";



interface WorkspaceIdLayoutProps {
    children: React.ReactNode;
};

const WorkspaceId = ({ children }: WorkspaceIdLayoutProps) => {
    const pathname = usePathname()
    return (
        <SidebarProvider>
            <div className="w-full h-screen flex items-center justify-center">
                {
                    pathname === "/workspaces" ? <DirectMessageBar /> : <Deneme />
                }
                <main className="w-full h-full relative">
                    {children}
                </main>
                <WorkspacesBar />
            </div>
        </SidebarProvider>
    );
};

export default WorkspaceId;

