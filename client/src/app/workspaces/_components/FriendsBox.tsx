import { GetAvatar } from "@/api/userAPI/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import { EllipsisVertical, MessageCircle, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "swr";


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
    return (
        <div className="w-full h-auto rounded-sm flex gap-3 p-3 items-center  cursor-pointer">
            <div className="w-10 h-10 shadow-[#232445] shadow rounded-full flex items-center justify-center">
                <Avatar>
                    <AvatarImage src={imageUrl as any} alt="avatar" className="object-contain" />
                    <AvatarFallback>
                        {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="w-3/4 h-full">
                <div className="w-full flex">
                    <h1 className="text-black text-[14px] self-start">{name}</h1>
                    <div className="ml-auto w-full h-full  flex flex-row justify-end items-start">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="rounded-full">
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
