import { GetPendingFriendRequests } from "@/api/friendRequestAPI/api";
import { GetAllUsers } from "@/api/userAPI/api";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Mail, X } from "lucide-react";
import { mutate } from "swr";



export default function PendingInvitesPopover(authId: any) {
    const { pendingFriendRequests, isLoadingPendingFriendRequests, isErrorPendingFriendRequests } = GetPendingFriendRequests(authId.authId);
    const { allUsers, isLoadingAllUsers, isErrorAllUsers } = GetAllUsers();
    const filteredUsers = allUsers?.filter((user: any) => pendingFriendRequests?.some((request: any) => request.receiver_id === user.id));


    const handleCancelFriendRequest = async (userId: any) => {
        try {
            const result = await fetch(`http://localhost:8000/api/cancelFriendRequest/${authId.authId}/${userId}`, {
                method: "DELETE",
            });
            if (result.ok) {
                mutate(`http://localhost:8000/api/getPendingFriendRequests/${authId.authId}`);
            }
            if (!result.ok) {
                throw new Error("Error while cancelling friend request");
            }
        } catch (error) {
            console.error("Error while cancelling friend request:", error);
        }
    }


    return (
        <Popover>
            <PopoverTrigger asChild className="flex items-center gap-2">
                <Button variant="ghost" size="icon"> <Mail size={12} className="text-white" /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Pending Invites</h4>
                    </div>
                    <Separator />
                    {
                        pendingFriendRequests?.length === 0 ? (
                            <p className="text-center text-sm text-gray-500">No pending invites</p>
                        ) : (
                            filteredUsers?.map((user: any) => (
                                <div key={user.id} className="flex items-center justify-between gap-2 rounded-md p-2">
                                    <div className="flex flex-col ">
                                        <p className="text-sm">{user.fullname}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleCancelFriendRequest(user.id)}>
                                        <X size={12} className="text-black" />
                                    </Button>
                                </div>
                            ))
                        )
                    }
                </div>
            </PopoverContent>
        </Popover>
    )
}