import { GetAvatar } from "@/api/userAPI/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import BoringAvatar from "boring-avatars";

interface FriendsBoxProps {
    image: string;
    name: string;
    id: string;
    userId: string;
    authId: string;
}

export default function FriendList({ name, userId, }: FriendsBoxProps) {
    const { avatar, isLoadingAvatar, isErrorAvatar } = GetAvatar(userId);
    const imageUrl = avatar?.FilePath ? `http://localhost:8000/${avatar.FilePath}` : null;

    const handleClick = () => {

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
                        <Button variant="friendRequest" size="sm"
                            onClick={handleClick}
                        >
                            Invite
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    );
}
