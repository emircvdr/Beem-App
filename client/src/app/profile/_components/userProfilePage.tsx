import { useParams, useRouter } from "next/navigation";
import { Github, Instagram, Linkedin, Mail, Phone, Trash2, User2, } from "lucide-react";
import Deneme from "../../../../public/deneme.jpeg";
import banner from "../../../../public/banner.png";
import { useEffect, useState } from "react";
import User from "@/app/interfaces/UserInterface";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetAvatar, GetBanner, GetUserById, GetUserProfile } from "@/api/userAPI/api";
import FriendRequestButton from "./FriendRequestButton";
import UserProfileSidebar from "./UserProfileSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BoringAvatar from "boring-avatars";

export default function UserProfilePage() {
    const router = useRouter();
    const { userId } = useParams();
    const [authId, setAuthId] = useState<number | null>(null);

    const { userWithID, isError, isLoading } = GetUserById(userId);
    const { userProfile, isErrorUserProfile, isLoadingUserProfile } = GetUserProfile(userId);
    const { avatar, isLoadingAvatar, isErrorAvatar } = GetAvatar(userId);
    const { banner, isLoadingBanner, isErrorBanner } = GetBanner(userId);
    const imageUrl = avatar?.FilePath ? `http://localhost:8000/${avatar.FilePath}` : null;
    const bannerUrl = banner?.FilePath ? `http://localhost:8000/${banner.FilePath}` : null;
    const socialLinks = [
        {
            key: "linked_in",
            name: "Linkedin",
            icons: <Linkedin />,
            link: userProfile?.linked_in
        },
        {
            key: "instagram",
            name: "Instagram",
            icons: <Instagram />,
            link: userProfile?.instagram
        },
        {
            key: "mail",
            name: "Mail",
            icons: <Mail />,
            link: `mailto: ${userProfile?.mail}`
        },
        {
            key: "github",
            name: "Github",
            icons: <Github />,
            link: userProfile?.github
        },
        {
            key: "phone",
            name: "Phone",
            icons: <Phone />,
            link: `tel: ${userProfile?.phone}`
        },
    ];

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const user = await response.json();
                    setAuthId(user.id);
                } else {
                    throw new Error('Failed to check user');
                }
            } catch (error) {
                console.error(error);
            }
        }
        checkUser();
        console.log(avatar);

    }, [userId]);


    return (
        <div className="flex w-fit m-auto h-full bg-white">
            <UserProfileSidebar />
            <div className="flex flex-col gap-3 flex-1 w-full h-full p-5">
                <div className="w-full h-[500px]  bg-white">
                    <div className="w-full h-1/2 relative rounded-md">
                        {
                            bannerUrl ? (
                                <img src={bannerUrl as any} alt="banner" className="w-fit h-[200px] rounded-md" />
                            ) : (
                                <div className="w-full h-[200px] rounded-md bg-gray-200 flex items-center justify-center">
                                    <p className="text-gray-500"></p>
                                </div>
                            )
                        }
                        <Avatar className="w-[150px] h-[150px] rounded-full absolute top-1/2 left-12">
                            <AvatarImage src={imageUrl as any} alt="avatar" className="w-[150px] !h-[150px] rounded-full object-contain" />
                            <AvatarFallback>
                                <BoringAvatar
                                    name={userId?.toString()}
                                    variant="beam"
                                    colors={["#40223c", "#42988f", "#b1c592", "#f1ddba", "#fb718a"]}
                                    style={{ width: "150px", height: "150px" }}
                                />
                            </AvatarFallback>
                        </Avatar>
                        <div className="w-full h-[30px] flex items-center justify-end p-6">
                        </div>
                    </div>
                    <div className="w-full h-1/2 p-5 flex flex-col mt-5">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col items-start ml-5">
                                <Select >
                                    <SelectTrigger className="w-fit border-none shadow-none p-0 focus:ring-0">
                                        <SelectValue placeholder={
                                            <h1 className="text-black text-[22px] mr-2 font-newCustom">{userWithID?.fullname}</h1>
                                        } className="border-none" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            authId !== null && authId !== Number(userId) && (
                                                <FriendRequestButton authId={authId} profileId={Number(userId)} />
                                            )
                                        }
                                    </SelectContent>
                                </Select>
                                <p className="text-muted-foreground text-[14px] font-newCustom">@{userProfile?.username}</p>
                                <p className="text-muted-foreground text-[16px] font-newCustom">{userProfile?.job}</p>
                            </div>
                            <div className="flex flex-row gap-2 justify-center items-center ">
                                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                                    <p className="text-white font-newCustom">A</p>
                                </div>
                                <p className="text-black font-newCustom">ABO Sunucusu</p>
                            </div>
                        </div>
                        <div className="w-full p-5 flex flex-col gap-8">
                            <div>
                                <p className="text-blue-500 font-newCustom">Socials</p>
                                <div className="flex justify-center lg:justify-start mt-2 space-x-4">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.key}
                                            href={link.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-500 hover:text-[#8185f3]"
                                        >
                                            {link.icons}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ml-auto mr-auto w-full p-5">
                    <Card className="mb-4 bg-white">
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Merhaba, ben {userWithID?.name || "Kullanıcı"}! Frontend alanında çalışıyorum ve yeni teknolojiler öğrenmeyi seviyorum.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
}
