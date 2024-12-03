import { GetFriendRequestWithSenderandReceiverId } from "@/api/friendRequestAPI/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mutate } from "swr";

export default function FriendRequestButton({ authId, profileId }: { authId: number; profileId: number }) {
    const { friendRequest, isLoadingFriendRequest } = GetFriendRequestWithSenderandReceiverId(authId, profileId);
    const handleCancelFriendRequest = async () => {
        try {
            const result = await fetch(`http://localhost:8000/api/cancelFriendRequest/${authId}/${profileId}`, {
                method: "DELETE",
            });
            if (result.ok) {
                mutate(`http://localhost:8000/api/getFriendRequestWithSenderandReceiverId/${authId}/${profileId}`);
            }
            if (!result.ok) {
                throw new Error("Error while cancelling friend request");
            }
        } catch (error) {
            console.error("Error while cancelling friend request:", error);
        }
    }
    const handleSendFriendRequest = async () => {
        try {

            const result = await fetch("http://localhost:8000/api/createFriendRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sender_id: authId,
                    receiver_id: Number(profileId),
                    status: "pending",
                })
            });
            if (result.ok) {
                mutate(`http://localhost:8000/api/getFriendRequestWithSenderandReceiverId/${authId}/${profileId}`);
            }
            if (!result.ok) {
                throw new Error("Error while sending friend request");
            }
        } catch (error) {
            console.error("Error while sending friend request:", error);
        }
        toast.success("Friend request sent successfully");
    }

    if (isLoadingFriendRequest) {
        return <p>Loading...</p>;
    }

    if (!friendRequest?.exists) {
        return <Button className="mt-12" variant="default" onClick={handleSendFriendRequest}>Send Friend Request</Button>;
    }

    if (friendRequest.senderId === authId) {
        return <Button className="mt-12" onClick={handleCancelFriendRequest}>Cancel Friend Request</Button>;
    }

    if (friendRequest.receiverId === authId && friendRequest.status === "pending") {
        return (
            <div className="flex flex-row gap-4 items-center justify-center">
                <Button variant="friendRequest" className="mt-12">Accept Request</Button>
                <Button variant="destructive" className="mt-12">Reject Request</Button>
            </div>
        );
    }
    if (friendRequest.receiverId === authId && friendRequest.status === "accepted") {
        return <Button className="mt-12" variant="default">Start Chat</Button>;
    }

    return null;
}