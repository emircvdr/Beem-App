import { SearchInput } from "@/components/ui/searchInput";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import deneme from "../../../../public/deneme.jpeg";
import FriendsBox from "./FriendsBox";
import NotificationPopover from "./NotificationPopover";
import PendingInvitesPopover from "./PendingInvitesPopover";
import { useEffect } from "react";
import { AddFriendDialog } from "./AddFriendDialog";


export default function Friends(authId: any) {

    const items = [
        {
            name: "Emir",
            img: deneme,
        },
        {
            name: "Betul",
            img: deneme,
        },
        {
            name: "ediz",
            img: deneme,
        },
    ]
    return (
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel className="text-gray-200 font-bold w-full h-full flex items-center justify-between">FRIENDS LIST
                    <div className="flex">
                        <AddFriendDialog />
                        <NotificationPopover />
                        <PendingInvitesPopover authId={authId.authId} />
                    </div>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SearchInput type="search" placeholder="Search" className="mb-5 mt-3 border-none bg-[#6668a0] text-white  placeholder-black" />
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.name} className="mb-2 transition-colors hover:bg-[#6668a0] rounded-lg">
                                <SidebarMenuButton asChild>
                                    <FriendsBox image={item.img?.src} name={item.name} />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    )
}