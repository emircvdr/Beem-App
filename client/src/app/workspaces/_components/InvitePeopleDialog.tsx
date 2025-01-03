"use client";

import { GetFriends } from "@/api/friendsAPI/api";
import { GetAllUsers } from "@/api/userAPI/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getCookie } from "cookies-next/client";
import { UserPlus } from "lucide-react";
import FriendList from "./FriendsList";
import { useState } from "react";

export default function InvitePeopleDialog({ inviteCode, name, authId }: { inviteCode: string, name: string, authId: string }) {
    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation()
    };

    const { allUsers, isErrorAllUsers, isLoadingAllUsers } = GetAllUsers();
    const { friends, isLoadingFriends, isErrorFriends } = GetFriends(authId);
    const filteredUsers = allUsers?.filter((item: any) => item.id !== authId)



    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex text-sm text-blue-500 p-2 w-full justify-between items-center cursor-pointer hover:bg-gray-100 transition-all rounded-md" onClick={handleClick}>
                    Invite People <UserPlus className="text-blue-500" size={20} />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Invite Friends to {name}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col h-[300px] overflow-y-auto">
                        {
                            friends?.length > 0 ? (friends?.map((item: any) => (
                                <FriendList key={item.id} image={item.img?.src} name={filteredUsers.find((user: any) => user.id == item.friend_id || user.id == item.user_id).fullname} id={item.id} userId={filteredUsers.find((user: any) => user.id == item.friend_id || user.id == item.user_id).id} authId={authId as string} />

                            ))) : <div className="flex justify-center items-center h-full">
                                <p className="text-black">No friends found</p>
                            </div>
                        }
                    </div>
                </div>
                <DialogFooter>
                    <div className="w-full h-full flex flex-col">
                        <span className="text-muted-foreground text-sm">
                            Share this code with your friends
                        </span>
                        <Input value={inviteCode} readOnly className="w-full relative h-[35px]" id="codeInput" />
                        <Button variant="special" className="absolute right-6 bottom-6" onClick={() => {
                            const codeInput = document.getElementById("codeInput") as HTMLInputElement;
                            codeInput.select();
                            document.execCommand("copy");
                        }}>
                            Copy
                        </Button>
                    </div>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

