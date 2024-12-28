import { GetAllUsers, GetAvatar, GetUserById } from "@/api/userAPI/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import { EllipsisVertical, MessageCircle, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "swr";
import BoringAvatar from "boring-avatars";
import { v4 as uuidv4 } from 'uuid'

import { useContext } from "react";
import { GetRooms } from "@/api/roomAPI/api";


interface FriendsBoxProps {
    image: string;
    name: string;
    id: string;
    userId: string;
    authId: string;
}

export default function FriendsBox({ image, name, id, userId, authId }: FriendsBoxProps) {
    const router = useRouter();
    const { avatar, isLoadingAvatar, isErrorAvatar } = GetAvatar(userId);
    const imageUrl = avatar?.FilePath ? `http://localhost:8000/${avatar.FilePath}` : null;
    const handleDeleteFriend = async () => {
        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteFriend/${id}`, {
                method: "DELETE",
            });
            if (result.ok) {
                console.log("Friend deleted")
                mutate(`${process.env.NEXT_PUBLIC_API_URL}/getFriends/${authId}`)
                toast.success("Friend deleted")
            }
            if (!result.ok) {
                throw new Error("Error while cancelling friend request");
            }
        } catch (error) {
            console.error("Error while cancelling friend request:", error);
        }
    }

    const { userWithID, isError, isLoading } = GetUserById(authId)
    const { rooms, isErrorRooms, isLoadingRooms } = GetRooms()


    const handleClick = () => {
        const room = rooms?.find((room: any) =>
            (room.user2Id.includes(userId) && room.user1Id.includes(authId)) ||
            (room.user1Id.includes(userId) && room.user2Id.includes(authId))
        );
        const roomId = uuidv4();

        // Eğer oda yoksa yeni bir oda oluşturun
        if (!room) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/createRoom`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: roomId,
                    name: `${authId}-${userId}`,
                    user1Id: authId.toString(),
                    user2Id: userId.toString(),
                })
            }).then(() => {
                router.push(`/home/messages/${roomId}`);
            });
        } else {
            router.push(`/home/messages/${room?.id}`);
        }
    };







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
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="rounded-full"
                                    onClick={handleClick}
                                >
                                    <MessageCircle className="text-black" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Message
                            </TooltipContent>
                        </Tooltip>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="rounded-full">
                                    <EllipsisVertical className="text-black" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent side="right" className=" border-none w-full">
                                <div className="flex flex-col gap-2">
                                    <Button variant="secondary" size="sm" className="flex flex-row gap-2 justify-start" onClick={() => router.push(`/profile/${userId}`)}>
                                        <SquareArrowOutUpRight /> View Profile
                                    </Button>
                                    <Button variant="destructive" size="sm" className="flex flex-row gap-2 justify-start" onClick={handleDeleteFriend}>
                                        <Trash2 /> Remove Friend
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
        </div >
    );
}
