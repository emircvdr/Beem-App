"use client"
import { GetWorkspacesWithId } from "@/api/workspacesAPI/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarSeparator } from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight, DiamondPlus, DoorOpen, Settings, User, UserPlus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import BoringAvatar from "boring-avatars";
import InvitePeopleDialog from "./InvitePeopleDialog";


export default function WorkspacesSideBar() {
    const router = useRouter()
    const { workspaceId } = useParams()
    const { workspace, isErrorWorkspace, isLoadingWorkspace } = GetWorkspacesWithId(workspaceId as string);



    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg" className="flex items-center gap-2">
                                    <Avatar >
                                        <AvatarImage src={""} alt="avatar" className="object-contain" />
                                        <AvatarFallback>
                                            <BoringAvatar
                                                name={workspace?.id.toString()}
                                                variant="marble"
                                                colors={["#40223c", "#42988f", "#b1c592", "#f1ddba", "#fb718a"]}
                                                style={{ width: "150px", height: "150px" }}
                                            />
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{workspace?.name}</span>
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-popper-anchor-width]" onPointerDown={(e) => e.stopPropagation()}>
                                <InvitePeopleDialog inviteCode={workspace?.invite_code as string} name={workspace?.name as string} authId={workspace?.admin_id as string} workplaceId={workspaceId as string} />
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <span className="w-full flex flex-row items-center justify-between">Upgrade Workspace <DiamondPlus color="purple" size={20} /> </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span className="w-full flex flex-row items-center justify-between">Manage Users <User size={20} /> </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/workspaces/settings/${workspaceId}`)}>
                                    <span className="w-full flex flex-row items-center justify-between">Workspace Settings <Settings size={20} /> </span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <span className="w-full flex flex-row items-center justify-between text-red-500">Leave Workspace <DoorOpen size={20} className="text-red-500" /> </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <Collapsible asChild className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton>
                                        <span className="text-muted-foreground">Text Channels</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton>
                                                <span className="text-muted-foreground"># Dashboard</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton>
                                                <span className="text-muted-foreground"># Analytics</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarMenu>
                        <Collapsible asChild className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton>
                                        <span className="text-muted-foreground">White Board</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton>
                                                <span className="text-muted-foreground"># Weekly Board</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton>
                                                <span className="text-muted-foreground"># Montly Board</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarMenu>
                        <Collapsible asChild className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton>
                                        <span className="text-muted-foreground">Kanban</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton>
                                                <span className="text-muted-foreground"># Weekly Kanban</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton>
                                                <span className="text-muted-foreground"># Montly Kanban</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}