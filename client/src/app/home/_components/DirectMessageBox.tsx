import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import BoringAvatar from "boring-avatars";
import { GetAvatar } from "@/api/userAPI/api";
interface DirectMessageBoxProps {
    name: string;
    lastMessage: string;
    userId: any;
}

export default function DirectMessageBox({ userId, name, lastMessage }: DirectMessageBoxProps) {
    const { avatar, isLoadingAvatar, isErrorAvatar } = GetAvatar(userId);
    const imageUrl = avatar?.FilePath ? `http://localhost:8000/${avatar.FilePath}` : null;

    return (
        <div className="w-full h-[50px] rounded-sm flex gap-3 p-3 items-center  cursor-pointer">
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
            <div className="flex flex-col w-3/4">
                <div className="w-full  flex">
                    <h1 className="text-black text-[14px]">{name}</h1>
                    <p className="ml-auto text-[11px]">11:00 PM</p>
                </div>

                <p className="text-muted-foreground text-[13px]">{lastMessage}</p>
            </div>

        </div>
    );
}
