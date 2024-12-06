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
    const handleAcceptFriendRequest = async (id: any, sender_id: any) => {
        try {
            const postResponse = await fetch('http://localhost:8000/api/acceptFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: authId,
                    friend_id: sender_id,
                }),
            });

            if (!postResponse.ok) {
                throw new Error("Failed to accept friend request");
            }
            const putResponse = await fetch(`http://localhost:8000/api/acceptFriendRequestWithId/${id}`, {
                method: 'PUT',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender_id: sender_id,
                    receiver_id: authId,
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
        toast.success("Friend request accepted successfully");

    }
    const handleRejectFriendRequest = async (id: any) => {
        try {
            await fetch(`http://localhost:8000/api/rejectFriendRequestWithId/${id}`, { method: 'DELETE' });
        } catch (error) {
            toast.error("An error occurred while rejecting the friend request");
            console.error(error);
        }
        toast.success("Friend request rejected successfully");
    }


    if (isLoadingFriendRequest) {
        return <p>Loading...</p>;
    }

    if (!friendRequest?.exists) {
        return <Button className="mt-12 m-auto" variant="default" onClick={handleSendFriendRequest}>Send Friend Request</Button>;
    }
    if (friendRequest.status === "accepted") {
        return <Button className="mt-12 m-auto" variant="default">Start Chat</Button>;
    }

    if (friendRequest.senderId === authId) {
        return <Button className="mt-12 m-auto" onClick={handleCancelFriendRequest}>Cancel Friend Request</Button>;
    }

    if (friendRequest.receiverId === authId && friendRequest.status === "pending") {
        return (
            <div className="flex flex-row gap-4 ">
                <Button variant="friendRequest" onClick={() => handleAcceptFriendRequest(friendRequest.id, friendRequest.senderId)}>Accept Request</Button>
                <Button variant="destructive" onClick={() => handleRejectFriendRequest(friendRequest.id)}>Reject Request</Button>
            </div>
        );
    }


    return null;
}