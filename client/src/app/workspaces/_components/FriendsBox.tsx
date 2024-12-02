import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface FriendsBoxProps {
    image: string;
    name: string;
}

export default function FriendsBox({ image, name }: FriendsBoxProps) {
    return (
        <div className="w-full h-[50px] rounded-sm flex gap-3 p-3 items-center  cursor-pointer">
            <div className="w-8 h-8  rounded-full flex items-center justify-center">
                {/* {image ? (
                    <Image src={image} alt="avatar" width={30} height={30} className="rounded-full" />
                ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white  text-lg text-black">A</div>
                )} */}
                <Avatar>
                    <AvatarImage src={image} alt="avatar" />
                    <AvatarFallback>
                        {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="w-3/4 h-full">
                <div className="w-full items-start  flex">
                    <h1 className="text-white text-[14px]">{name}</h1>
                </div>
            </div>
        </div>
    );
}
