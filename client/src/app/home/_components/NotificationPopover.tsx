import { GetFriendRequestsByReceiverId } from "@/api/friendRequestAPI/api";
import { GetAllUsers } from "@/api/userAPI/api";
import { GetWorkplaceReqWithReceiverId } from "@/api/workplaceRequestAPI/api";
import { GetAllWorkplaces, GetWorkspacesWithAdminID, GetWorkspacesWithId } from "@/api/workspacesAPI/api";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Bell, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";



export default function NotificationPopover(authId: any) {
    const router = useRouter();
    const { friendRequests, isLoadingFriendRequests, isErrorFriendRequests } = GetFriendRequestsByReceiverId(authId.authId);
    const { isErrorworkplaceReqReceiver, isLoadingworkplaceReqReceiver, workplaceReqReceiver } = GetWorkplaceReqWithReceiverId(authId.authId);
    const { allUsers, isLoadingAllUsers, isErrorAllUsers } = GetAllUsers();
    const { allWorkspaces, isErrorAllWorkspaces, isLoadingAllWorkspaces } = GetAllWorkplaces();
    const filteredUsers = allUsers?.filter((user: any) => friendRequests?.some((request: any) => request.sender_id === user.id));
    const workplaceReqFilteredUsers = allUsers?.filter((user: any) => workplaceReqReceiver?.some((request: any) => request.sender_id === user.id))

    const notificationCount = workplaceReqFilteredUsers && filteredUsers ? filteredUsers.length + workplaceReqFilteredUsers.length : workplaceReqFilteredUsers ? workplaceReqFilteredUsers.length : filteredUsers ? filteredUsers.length : 0;

    const [error, setError] = useState<any>(null);

    const handleAcceptFriendRequest = async (id: any, sender_id: any) => {
        try {
            const postResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/acceptFriend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: authId.authId,
                    friend_id: sender_id,
                }),
            });

            if (!postResponse.ok) {
                throw new Error("Failed to accept friend request");
            }
            const putResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/acceptFriendRequestWithId/${id}`, {
                method: 'PUT',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender_id: sender_id,
                    receiver_id: authId.authId,
                    status: "accepted",
                }),
            });

            if (!putResponse.ok) {
                throw new Error("Failed to update friend status");
            }
            toast.success("Friend request accepted successfully");

        } catch (error) {
            toast.error("An error occurred while accepting the friend request");
            console.error(error);
        }
        mutate(`${process.env.NEXT_PUBLIC_API_URL}/getFriendRequestsByReceiverId/${authId.authId}`)
        mutate(`${process.env.NEXT_PUBLIC_API_URL}/getFriends/${authId.authId}`)
        toast.success("Friend request accepted successfully");

    }

    const handleRejectFriendRequest = async (id: any) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rejectFriendRequestWithId/${id}`, { method: 'DELETE' });
        } catch (error) {
            toast.error("An error occurred while rejecting the friend request");
            console.error(error);
        }
        toast.success("Friend request rejected successfully");
    }

    const handleAcceptWorkplaceRequest = async (id: any, sender_id: any, workplace_id: any) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/acceptWorkplaceReq/${id}`, {
                method: 'PUT',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender_id: sender_id,
                    receiver_id: authId.authId,
                    status: "accepted",
                }),
            });
            if (response.ok) {
                try {
                    const workplaceMemberResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/createWorkplaceMember`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            workplace_id: Number(workplace_id),
                            admin_id: Number(sender_id),
                            user_id: authId.authId,
                            role: "member"
                        }),
                    });
                    const workplaceMemberData = await workplaceMemberResponse.json();
                    if (workplaceMemberResponse.ok) {
                        router.push(`/workspaces/${workplace_id}`);
                    }
                } catch (error) {
                    setError(error);

                }
            }

        } catch (error) {
            setError(error);
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell size={24} className="text-black" />
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
                        <h3>Friend Requests</h3>
                        {
                            friendRequests?.length === 0 ? (
                                <p className="text-center text-sm text-gray-500">No notifications</p>
                            ) : (
                                friendRequests?.map((request: any) => (
                                    <div key={request.id} className="flex items-center justify-between gap-2 rounded-md p-2">
                                        <p className="text-sm"> <span className="font-bold cursor-pointer" onClick={() => router.push(`/profile/${request.sender_id}`)}>{
                                            allUsers?.find((user: any) => user.id === request.sender_id)?.fullname
                                        }</span> sent you a friend request</p>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleAcceptFriendRequest(request.id, request.sender_id)}> <Check size={12} className="text-green-500" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleRejectFriendRequest(request.id)}> <X size={12} className="text-red-500" /></Button>
                                        </div>
                                    </div>
                                ))
                            )
                        }
                        <Separator />
                        <h3>Workplace Requests</h3>
                        {
                            workplaceReqReceiver?.length === 0 ? (
                                <p className="text-center text-sm text-gray-500">No notifications</p>
                            ) : (
                                workplaceReqReceiver?.map((request: any) => (
                                    <div key={request.id} className="flex items-center justify-between gap-2 rounded-md p-2">
                                        <p className="text-sm"> <span className="font-bold cursor-pointer" onClick={() => router.push(`/profile/${request.sender_id}`)}>{
                                            allUsers?.find((user: any) => user.id === request.sender_id)?.fullname
                                        }</span> sent you a workplace <span className="font-bold">({
                                            allWorkspaces?.find((workspace) => Number(workspace.id) == Number(request.workplace_id))?.name
                                        })</span> invite</p>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleAcceptWorkplaceRequest(request.id, request.sender_id, request.workplace_id)}> <Check size={12} className="text-green-500" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleRejectFriendRequest(request.id)}> <X size={12} className="text-red-500" /></Button>
                                        </div>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}