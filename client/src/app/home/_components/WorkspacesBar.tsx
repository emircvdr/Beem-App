import { GetWorkspacesWithAdminID } from "@/api/workspacesAPI/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar2, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";
import { getCookie } from "cookies-next/client";
import { Calendar, Home, Inbox, MoveLeft, Plus, Search, Settings } from "lucide-react"
import BoringAvatar from "boring-avatars";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";



export default function WorkspacesBar() {
    const authId = getCookie("authId");
    const router = useRouter();
    const pathname = usePathname();
    const { workspaces, isErrorWorkspaces, isLoadingWorkspaces } = GetWorkspacesWithAdminID(authId as any);

    return (
        <Sidebar2 variant="sidebar" collapsible="offcanvas" side="right" >
            <SidebarHeader className="items-center">
                <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="h-full flex items-center">
                    <div className="w-[50px] h-[50px] border rounded-full flex items-center justify-center">
                        <Plus style={
                            {
                                width: "30px",
                                height: "30px",
                                color: "#000"
                            }
                        } />
                    </div>
                    <SidebarGroupContent>
                        <SidebarSeparator className="mt-4" />
                        <SidebarMenu className="h-full flex items-center mt-5">
                            {workspaces?.map((item) => (
                                <SidebarMenuItem key={item.id} onClick={() => router.push(`/workspaces/${item.id}`)}>
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <Avatar className="cursor-pointer w-[50px] h-[50px] mt-2">
                                                    {/* <AvatarImage /> */}
                                                    <AvatarFallback>
                                                        <BoringAvatar size={70} name={item.id.toString()} variant="marble" colors={["#40223c", "#42988f", "#b1c592", "#f1ddba", "#fb718a"]} />
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {item.name}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            {
                pathname !== "/home" &&
                <SidebarFooter>
                    <Button variant="ghost" size="icon" className="w-full" onClick={() => router.push("/home")}>
                        <MoveLeft /> Back to Home
                    </Button>
                </SidebarFooter>
            }
        </Sidebar2>
    )
}
