import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface DirectMessageBoxProps {
    image: string;
    name: string;
    lastMessage: string;
}

export default function DirectMessageBox({ image, name, lastMessage }: DirectMessageBoxProps) {
    return (
        <div className="w-full h-[50px] rounded-sm flex gap-3 p-3 items-center  cursor-pointer">
            <div className="w-10 h-10 shadow-[#232445] shadow rounded-full flex items-center justify-center">
                <Avatar>
                    <AvatarImage src={image} alt="avatar" />
                    <AvatarFallback>
                        {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="flex flex-col w-3/4">
                <div className="w-full  flex">
                    <h1 className="text-white text-[14px]">{name}</h1>
                    <p className="ml-auto text-[11px]">11:00 PM</p>
                </div>

                <p className="text-black text-[13px]">{lastMessage}</p>
            </div>

        </div>
    );
}
