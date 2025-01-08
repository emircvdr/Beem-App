"use client"
import { GetAvatar } from "@/api/userAPI/api";
import { GetWorkplaceReqWithSenderId } from "@/api/workplaceRequestAPI/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import BoringAvatar from "boring-avatars";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

interface FriendsBoxProps {
    image: string;
    name: string;
    id: string;
    userId: string;
    authId: string;
    workplaceId: string;
}

interface FriendsRequestProps {
    sender_id: string;
    receiver_id: string;
    status: string;
}

export default function FriendList({ name, userId, authId, workplaceId }: FriendsBoxProps) {
    const { avatar, isLoadingAvatar, isErrorAvatar } = GetAvatar(userId);
    const imageUrl = avatar?.FilePath ? `http://localhost:8000/${avatar.FilePath}` : null;
    const [error, setError] = useState(null);

    const { workplaceReq, isErrorWorkplaceReq, isLoadingWorkplaceReq } = GetWorkplaceReqWithSenderId(authId);

    const disabledButton = workplaceReq?.some((item: FriendsRequestProps) => item.receiver_id === userId && item.status === "pending");

    const handleClick = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/createWorkplaceRequest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    receiver_id: userId,
                    sender_id: authId,
                    status: "pending",
                    workplace_id: Number(workplaceId),
                }),
            });
            const data = response.json();
            if (response.ok) {
                mutate(`${process.env.NEXT_PUBLIC_API_URL}/getWorkplaceReqWithSenderId/${authId}`);
                toast.success("Your request has been sent");
            }
        } catch (error) {
            setError(error as any);
        }
    };

    const handleCancel = async () => {
        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cancelWorkplaceReq/${authId}/${userId}`, {
                method: "DELETE",
            });
            if (result.ok) {
                mutate(`${process.env.NEXT_PUBLIC_API_URL}/getWorkplaceReqWithSenderId/${authId}`);
            }
            if (!result.ok) {
                throw new Error("Error while cancelling workplace request");
            }
        } catch (error) {
            console.error("Error while cancelling workplace request:", error);
        }
    }


    return (
        <div className="w-full h-auto rounded-sm flex gap-3 p-3 items-center  cursor-pointer">
            <div className="w-10 h-10 shadow-[#232445] shadow rounded-full flex items-center justify-center">
                <Avatar>
                    <AvatarImage src={imageUrl as any} alt="avatar" className="object-contain" />
                    <AvatarFallback>
                        <BoringAvatar
                            name={userId?.toString()}
                            variant="beam"
                            colors={["#40223c", "#42988f", "#b1c592", "#f1ddba", "#fb718a"]}
                            style={{ width: "150px", height: "150px" }}
                        />
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="w-3/4 h-full">
                <div className="w-full flex">
                    <h1 className="text-black text-[14px] self-start">{name}</h1>
                    <div className="ml-auto w-full h-full  flex flex-row justify-end items-start">
                        <Button variant={disabledButton ? ("destructive") : ("friendRequest")} size="sm"
                            onClick={() => (
                                disabledButton ? handleCancel() : handleClick()
                            )}
                        >
                            {disabledButton ? "Cancel" : "Invite"}
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    );
}
