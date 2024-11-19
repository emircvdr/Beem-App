"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import DirectMessageBar from "./_components/DirectMessageBar";
import Deneme from "./_components/Deneme";
import { usePathname } from "next/navigation";

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
                <main className="w-full h-full">
                    {children}
                </main>
            </div>
        </SidebarProvider>

    );
};

export default WorkspaceId;

