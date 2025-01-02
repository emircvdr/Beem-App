"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation"; 1
import WorkspacesBar from "../home/_components/WorkspacesBar";
import WorkspacesSidebar from "./_components/WorkspacesSideBar";
import Settings from "./settings/[workspaceId]/page";




interface HomeLayoutProps {
    children: React.ReactNode;
};

const Home = ({ children }: HomeLayoutProps) => {

    const pathname = usePathname();
    return (
        <SidebarProvider>
            <div className="w-[calc(100%-100px)] h-screen flex items-center justify-center">
                <WorkspacesSidebar />
                {
                    pathname === "/workspaces/settings/" ? (
                        <Settings />
                    ) : (
                        <main className="w-full h-full relative">
                            {children}
                        </main>
                    )
                }
                <WorkspacesBar />
            </div>
        </SidebarProvider>
    );
};

export default Home;

