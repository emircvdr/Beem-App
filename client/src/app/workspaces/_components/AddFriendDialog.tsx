"use client";
import { GetAllUsers } from "@/api/userAPI/api";
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
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function AddFriendDialog() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [authId, setAuthId] = useState(null);

    const { allUsers, isLoadingAllUsers, isErrorAllUsers } = GetAllUsers();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user', {
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

            const result = await fetch("http://localhost:8000/api/createFriendRequest", {
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
                                        <div>
                                            <p className="text-sm font-medium">{user.fullname}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <Button size="sm" onClick={() => handleSendFriendRequest(user.id)}>Add</Button>
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
