"use client";
import { GetAllUsers, GetAvatar } from "@/api/userAPI/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import BoringAvatar from "boring-avatars";
import { GetFriends } from "@/api/friendsAPI/api";
import { GetFriendRequestsBySenderId } from "@/api/friendRequestAPI/api";

export function AddFriendDialog() {
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [authId, setAuthId] = useState(null);
    const { friends, isLoadingFriends, isErrorFriends } = GetFriends(authId);
    const { friendRequestsBySenderId, isLoadingFriendRequestsBySenderId, isErrorFriendRequestsBySenderId } = GetFriendRequestsBySenderId(authId);

    const { allUsers, isLoadingAllUsers, isErrorAllUsers } = GetAllUsers();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                    credentials: "include",
                });

                const data = await response.json();

                if (response.ok) {
                    setAuthId(data.id);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
        if (!allUsers || searchTerm.trim() === "") {
            setFilteredUsers([]);
        } else {
            const filtered = allUsers.filter((user: any) => user.id !== authId).filter(
                (user: any) =>
                    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, allUsers]);

    const handleSendFriendRequest = async (profileId: number) => {
        try {

            const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/createFriendRequest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sender_id: authId,
                    receiver_id: profileId,
                    status: "pending",
                })
            });
            if (result.ok) {
                console.log("Friend request sent successfully");
                mutate(`${process.env.NEXT_PUBLIC_API_URL}/getFriendRequestsBySenderId/${authId}`)
                mutate(`${process.env.NEXT_PUBLIC_API_URL}/getPendingFriendRequests/${authId}`);

            }
            if (!result.ok) {
                throw new Error("Error while sending friend request");
            }
        } catch (error) {
            console.error("Error while sending friend request:", error);
        }
        toast.success("Friend request sent successfully");
    }

    return (
        <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                    <Plus size={12} className="text-black" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Friend</DialogTitle>
                    <DialogDescription>
                        Add a friend by entering their full name or email.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="items-center gap-4">
                        <Input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div>
                        {isLoadingAllUsers ? (
                            <p>Loading users...</p>
                        ) : isErrorAllUsers ? (
                            <p>Error fetching users</p>
                        ) : filteredUsers.length > 0 ? (
                            <ul className="space-y-2">
                                {filteredUsers.map((user: any) => (
                                    <li
                                        key={user.id}
                                        className="flex justify-between items-center p-2 border rounded-md"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <Avatar className="w-[30px] h-[30px] rounded-full">
                                                    <BoringAvatar
                                                        name={user.id.toString()}
                                                        variant="beam"
                                                        colors={["#40223c", "#42988f", "#b1c592", "#f1ddba", "#fb718a"]}
                                                        style={{ width: "30px", height: "30px" }}
                                                    />
                                                </Avatar>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{user.fullname}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="secondary" onClick={() => router.push(`/profile/${user.id}`)}>View Profile</Button>
                                            {
                                                friends.length > 0 && friends?.some((friend: any) => friend.friend_id === user.id || friend.user_id === user.id) ? (
                                                    null
                                                ) : (
                                                    friendRequestsBySenderId?.some((friendRequest: any) => friendRequest.sender_id === authId && friendRequest.receiver_id === user.id && friendRequest.status === "pending") ? (
                                                        <Button size="sm" variant="secondary" disabled={true}>Add</Button>
                                                    ) : (
                                                        <Button size="sm" onClick={() => handleSendFriendRequest(user.id)}>Add</Button>
                                                    )
                                                )
                                            }
                                        </div>

                                    </li>
                                ))}
                            </ul>
                        ) : searchTerm.trim() !== "" ? (
                            <p>No user found</p>
                        ) : null}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
