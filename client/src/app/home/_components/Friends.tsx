import { SearchInput } from "@/components/ui/searchInput";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar";
import FriendsBox from "./FriendsBox";
import NotificationPopover from "./NotificationPopover";
import PendingInvitesPopover from "./PendingInvitesPopover";
import { AddFriendDialog } from "./AddFriendDialog";
import { GetFriends } from "@/api/friendsAPI/api";
import { GetAllUsers, GetAvatar } from "@/api/userAPI/api";


export default function Friends({ authId }: { authId: any }) {
    const { allUsers, isErrorAllUsers, isLoadingAllUsers } = GetAllUsers();
    const { friends, isLoadingFriends, isErrorFriends } = GetFriends(authId);
    const filteredUsers = allUsers?.filter((item: any) => item.id !== authId)


    return (
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel className="text-black font-newCustom w-full h-full flex items-center justify-between">FRIENDS LIST
                    <div className="flex">
                        <AddFriendDialog />
                        <NotificationPopover authId={authId} />
                        <PendingInvitesPopover authId={authId} />
                    </div>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SearchInput type="search" placeholder="Search" className="mb-5 mt-3 border border-muted-foreground font-newCustom bg-transparent text-black placeholder:text-black" />
                    <SidebarMenu>
                        {
                            friends?.length > 0 ? (friends?.map((item: any) => (
                                <FriendsBox key={item.id} image={item.img?.src} name={filteredUsers.find((user: any) => user.id == item.friend_id || user.id == item.user_id).fullname} id={item.id} userId={filteredUsers.find((user: any) => user.id == item.friend_id || user.id == item.user_id).id} authId={authId} />

                            ))) : <div className="flex justify-center items-center h-full">
                                <p className="text-black">No friends found</p>
                            </div>
                        }
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    )
}