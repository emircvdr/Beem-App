import { GetAllWorkplaces, GetWorkplacesWithUserId, GetWorkspacesWithAdminID } from "@/api/workspacesAPI/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar2, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";
import { getCookie } from "cookies-next/client";
import { MoveLeft, Plus } from "lucide-react"
import BoringAvatar from "boring-avatars";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import CreateWorkplaceDialog from "@/app/workspaces/_components/CreateWorkplaceDialog";




export default function WorkspacesBar() {
    const authId = getCookie("authId");
    const router = useRouter();
    const pathname = usePathname();

    const { allWorkspaces, isErrorAllWorkspaces, isLoadingAllWorkspaces } = GetAllWorkplaces()
    const { workplaceWithUserId, isErrorWorkplaceWithUserId, isLoadingWorkplaceWithUserId } = GetWorkplacesWithUserId(authId as any);


    return (
        <Sidebar2 variant="sidebar" collapsible="offcanvas" side="right" >
            <SidebarHeader className="items-center">
                <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="h-full flex items-center">
                    <CreateWorkplaceDialog />
                    <SidebarGroupContent>
                        <SidebarSeparator className="mt-[20px]" />
                        <SidebarMenu className="h-full flex items-center mt-5">
                            {workplaceWithUserId?.map((item: any) => (
                                <SidebarMenuItem key={item.workplace_id} onClick={() => router.push(`/workspaces/${item.workplace_id}`)}>
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <Avatar className="cursor-pointer w-[50px] h-[50px] mt-2">
                                                    <AvatarFallback>
                                                        <BoringAvatar size={70} name={item.workplace_id.toString()} variant="marble" colors={["#40223c", "#42988f", "#b1c592", "#f1ddba", "#fb718a"]} />
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {
                                                    allWorkspaces?.find((workspace) => workspace.id == item.workplace_id)?.name
                                                }
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
                        <MoveLeft /> Home
                    </Button>
                </SidebarFooter>
            }
        </Sidebar2>
    )
}
