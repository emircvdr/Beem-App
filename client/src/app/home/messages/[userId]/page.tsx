"use client"
import { GetAvatar, GetUserById, GetUserProfile } from "@/api/userAPI/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import BoringAvatar from "boring-avatars";
import { useRouter } from "next/navigation";
import { Ban, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import BgChat from "../../../../../public/bg-c.jpeg"

export default function MessagesPage() {
    const router = useRouter()
    // const { userWithID, isLoading, isError } = GetUserById(userId);
    // const { userProfile, isLoadingUserProfile, isErrorUserProfile } = GetUserProfile(userId);
    // const { avatar, isLoadingAvatar, isErrorAvatar } = GetAvatar(userId);
    // const imageUrl = avatar?.FilePath ? `http://localhost:8000/${avatar.FilePath}` : null;

    return (
        <div className="w-[calc(100%-90px)] h-full flex flex-col">
            {/* Header kısmı */}
            <div className="w-full h-[120px] p-4 flex">
                <div className="flex flex-row items-center justify-start gap-2">
                    {/* <Avatar className="w-[50px] h-[50px]">
                        <AvatarImage src={imageUrl as any} alt="avatar" className="rounded-full object-contain" />
                        <AvatarFallback>
                            <BoringAvatar
                                name={userId?.toString()}
                                variant="beam"
                                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                                style={{ width: "150px", height: "150px" }}
                            />
                        </AvatarFallback>
                    </Avatar> */}
                    <div className="flex flex-col items-start justify-start">
                        {/* <Select>
                            <SelectTrigger className="w-fit border-none shadow-none p-0 focus:ring-0">
                                <SelectValue placeholder={
                                    <h1 className="text-black text-[22px] mr-2 font-newCustom">{userWithID?.fullname}</h1>
                                } className="border-none" />
                            </SelectTrigger>
                            <SelectContent className="w-[200px] h-[150px]">
                                <div className="flex flex-row items-center justify-start gap-2 p-2">
                                    <Avatar className="w-[30px] h-[30px]">
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
                                        <h3 className="text-black text-[15px]  font-newCustom">{userWithID?.fullname}</h3>
                                        <p className="text-muted-foreground text-[12px] font-newCustom">{userProfile?.mail}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex flex-col items-start justify-start gap-2 p-2">
                                    <Button variant="secondary" size="sm" className="flex flex-row gap-2 justify-start w-full" onClick={() => router.push(`/profile/${userId}`)}>
                                        <SquareArrowOutUpRight /> View Profile
                                    </Button>
                                    <Button variant="destructive" size="sm" className="flex flex-row gap-2 justify-start w-full">
                                        <Ban /> Block User
                                    </Button>
                                </div>

                            </SelectContent>
                        </Select> */}
                        {/* <span className="text-sm text-muted-foreground">@{userProfile?.username}</span> */}
                    </div>
                </div>
            </div>

            {/* Separator */}
            <Separator />

            {/* Mesajlar kısmı */}
            <div className="message-container w-full flex-1 overflow-y-auto">
                <Image src={BgChat} alt="bg-chat" className="w-full h-full object-cover opacity-30" />
                {/* Burada mesajlar listelenebilir */}
                <div className="w-full h-full">
                    {/* Mesaj içeriği buraya gelir */}
                </div>
            </div>
            <div className="w-full p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Type your message..."
                        className="flex-1"
                        style={{ maxWidth: 'calc(100% - 110px)', height: '40px', borderRadius: "50px", }}
                    />
                    <Button className="w-[100px]">Send</Button>
                </div>
            </div>
        </div>
    );
}
