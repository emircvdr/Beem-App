import { GetPendingFriendRequests } from "@/api/friendRequestAPI/api";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Mail } from "lucide-react";
import { useEffect } from "react";


export default function PendingInvitesPopover(authId: any) {
    const { pendingFriendRequests, isLoadingPendingFriendRequests, isErrorPendingFriendRequests } = GetPendingFriendRequests(authId.authId);


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
                    {pendingFriendRequests?.map((friendRequest: any) => (
                        <div key={friendRequest.id}>
                            <h1>{friendRequest?.sender_id}</h1>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}