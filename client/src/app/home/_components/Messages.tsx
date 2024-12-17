"use client" //This component not used in the project right now
import { SearchInput } from "@/components/ui/searchInput";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import DirectMessageBox from "./DirectMessageBox";
import logo from "../../../../public/logo.svg";
import deneme from "../../../../public/deneme.jpeg";
import { GetRooms } from "@/api/roomAPI/api";
import { GetAllUsers } from "@/api/userAPI/api";
import { useRouter } from "next/navigation";


export default function Messages({ setRender, render, setUserId, setAuthId }: { setRender: (render: boolean) => void, render: boolean, setUserId: (userId: any) => void, setAuthId: (authId: any) => void }) {
    const router = useRouter()
    const { rooms, isErrorRooms, isLoadingRooms } = GetRooms()
    const { allUsers, isErrorAllUsers, isLoadingAllUsers } = GetAllUsers()


    return (
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel className="text-black font-newCustom">DIRECT MESSAGES</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SearchInput type="search" placeholder="Search" className="mb-5 mt-3 border border-muted-foreground bg-transparent text-black font-newCustom placeholder:text-black" />
                    <SidebarMenu>
                        {rooms?.map((item: any) => (
                            <SidebarMenuItem key={item.id} className="mb-4 transition-colors  rounded-lg hover:bg-[#6668a0]" onClick={
                                () => {
                                    setUserId(item.user2Id)
                                    setRender(true)
                                    router.push(`/home/messages/${item.id}`)
                                }
                            }>
                                <SidebarMenuButton asChild>
                                    <DirectMessageBox userId={allUsers?.find((user: any) => user.id == item.user2Id)?.id} name={
                                        allUsers?.find((user: any) => user.id == item.user2Id)?.fullname
                                    } lastMessage={"HHAHA"} />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    )
}