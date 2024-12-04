import { SearchInput } from "@/components/ui/searchInput";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import deneme from "../../../../public/deneme.jpeg";
import FriendsBox from "./FriendsBox";
import NotificationPopover from "./NotificationPopover";
import PendingInvitesPopover from "./PendingInvitesPopover";
import { useEffect } from "react";
import { AddFriendDialog } from "./AddFriendDialog";
import { GetFriends } from "@/api/friendsAPI/api";
import { GetAllUsers } from "@/api/userAPI/api";


export default function Friends(authId: any) {
    const { allUsers, isErrorAllUsers, isLoadingAllUsers } = GetAllUsers();
    const { friends, isLoadingFriends, isErrorFriends } = GetFriends(authId.authId);
    const filteredUsers = allUsers?.filter((item: any) => item.id !== authId.authId)

    useEffect(() => {
        console.log(filteredUsers)
    }, [])

    return (
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel className="text-gray-200 font-bold w-full h-full flex items-center justify-between">FRIENDS LIST
                    <div className="flex">
                        <AddFriendDialog />
                        <NotificationPopover authId={authId.authId} />
                        <PendingInvitesPopover authId={authId.authId} />
                    </div>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SearchInput type="search" placeholder="Search" className="mb-5 mt-3 border-none bg-[#6668a0] text-white  placeholder-black" />
                    <SidebarMenu>
                        {
                            friends?.map((item: any) => (
                                <FriendsBox key={item.id} image={item.img?.src} name={filteredUsers.find((user: any) => user.id == item.friend_id || user.id == item.user_id).fullname} id={item.id} userId={filteredUsers.find((user: any) => user.id == item.friend_id || user.id == item.user_id).id} />
                            ))
                        }
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    )
}