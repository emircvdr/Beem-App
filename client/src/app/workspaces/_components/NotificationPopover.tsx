import { GetFriendRequestsByReceiverId } from "@/api/friendRequestAPI/api";
import { GetAllUsers } from "@/api/userAPI/api";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Bell, Check, X } from "lucide-react";
import { useEffect } from "react";


export default function NotificationPopover(authId: any) {
    const { friendRequests, isLoadingFriendRequests, isErrorFriendRequests } = GetFriendRequestsByReceiverId(authId.authId);
    const { allUsers, isLoadingAllUsers, isErrorAllUsers } = GetAllUsers();
    const filteredUsers = allUsers?.filter((user: any) => friendRequests?.some((request: any) => request.sender_id === user.id));
    const notificationCount = filteredUsers?.length || 0;

    return (
        <Popover>
            <PopoverTrigger asChild className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell size={24} className="text-white" />
                    {notificationCount > 0 && (
                        <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {notificationCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Notifications</h4>
                        <Separator />
                        {filteredUsers?.map((user: any) => (
                            <div key={user.id} className="flex items-center justify-between gap-2 rounded-md p-2">
                                <div className="flex ">
                                    <p className="text-sm"> <span className="font-bold">{user.fullname}</span> sent you a friend request</p>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon"> <Check size={12} className="text-green-500" /></Button>
                                        <Button variant="ghost" size="icon"> <X size={12} className="text-red-500" /></Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}