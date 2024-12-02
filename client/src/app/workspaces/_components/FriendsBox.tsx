import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import { EllipsisVertical, MessageCircle, Trash2 } from "lucide-react";
import Image from "next/image";

interface FriendsBoxProps {
    image: string;
    name: string;
}

export default function FriendsBox({ image, name }: FriendsBoxProps) {
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
                                <div>
                                    <Button variant="destructive" size="sm">
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
