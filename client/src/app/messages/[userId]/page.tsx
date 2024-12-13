import { GetAvatar, GetUserById, GetUserProfile } from "@/api/userAPI/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import BoringAvatar from "boring-avatars";
import { useRouter } from "next/navigation";

export default function MessagesPage({ userId, authId }: { userId: any, authId: any }) {
    const router = useRouter()
    const { userWithID, isLoading, isError } = GetUserById(userId);
    const { userProfile, isLoadingUserProfile, isErrorUserProfile } = GetUserProfile(userId);
    const { avatar, isLoadingAvatar, isErrorAvatar } = GetAvatar(userId);
    const imageUrl = avatar?.FilePath ? `http://localhost:8000/${avatar.FilePath}` : null;

    return (
        <div className="w-[calc(100%-90px)] h-full flex flex-col">
            {/* Header kısmı */}
            <div className="w-full h-[120px] p-4 flex">
                <div className="flex flex-row items-center justify-start gap-2">
                    <Avatar className="w-[50px] h-[50px]">
                        <AvatarImage src={imageUrl as any} alt="avatar" className="rounded-full object-contain" />
                        <AvatarFallback>
                            <BoringAvatar
                                name={userId?.toString()}
                                variant="beam"
                                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                                style={{ width: "150px", height: "150px" }}
                            />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start justify-start">
                        <Select >
                            <SelectTrigger className="w-fit border-none shadow-none p-0 focus:ring-0">
                                <SelectValue placeholder={
                                    <h1 className="text-black text-[22px] mr-2 font-newCustom">{userWithID?.fullname}</h1>
                                } className="border-none" />
                            </SelectTrigger>
                            <SelectContent>
                                <Button onClick={() => router.push(`/profile/${userId}`)} className="w-full">View Profile</Button>
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">@{userProfile?.username}</span>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <Separator />

            {/* Mesajlar kısmı */}
            <div className="message-container w-full flex-1 overflow-y-auto  bg-gray-100">
                {/* Burada mesajlar listelenebilir */}
                <div className="w-full h-full">
                    {/* Mesaj içeriği buraya gelir */}
                </div>
            </div>

            {/* Alt kısım - Mesaj gönderme kısmı */}
            <div className="w-full p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Type your message..."
                        className="flex-1"
                        style={{ maxWidth: 'calc(100% - 110px)' }} // Input alanı genişliği ayarlandı
                    />
                    <Button className="w-[100px]">Send</Button>
                </div>
            </div>
        </div>
    );
}
