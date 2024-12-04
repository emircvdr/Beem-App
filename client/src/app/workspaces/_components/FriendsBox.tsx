import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import { EllipsisVertical, MessageCircle, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";


interface FriendsBoxProps {
    image: string;
    name: string;
    id: string;
    userId: string;
}

export default function FriendsBox({ image, name, id, userId }: FriendsBoxProps) {
    const router = useRouter();
    const handleDeleteFriend = async () => {
        try {
            const result = await fetch(`http://localhost:8000/api/deleteFriend/${id}`, {
                method: "DELETE",
            });
            if (result.ok) {
                console.log("Friend deleted")
            }
            if (!result.ok) {
                throw new Error("Error while cancelling friend request");
            }
        } catch (error) {
            console.error("Error while cancelling friend request:", error);
        }
    }
    return (
        <div className="w-full h-[50px] rounded-sm flex gap-3 p-3 items-center  cursor-pointer">
            <div className="w-8 h-8  rounded-full flex items-center justify-center">
                <Avatar>
                    <AvatarImage src={image} alt="avatar" />
                    <AvatarFallback>
                        {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="w-3/4 h-full">
                <div className="w-full flex items-start">
                    <h1 className="text-white text-[14px] self-start">{name}</h1>
                    <div className="ml-auto w-full  flex flex-row justify-end  gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="rounded-full  hover:bg-[#b9bbfb]">
                                    <MessageCircle className="text-white" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Message
                            </TooltipContent>
                        </Tooltip>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="rounded-full  hover:bg-[#b9bbfb]">
                                    <EllipsisVertical className="text-white" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent side="right" className=" border-none w-full bg-[#6668a0]">
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
