import premiumMember from "../../../../public/premiumMember.svg"
import admin from "../../../../public/admin.svg"
import chat from "../../../../public/chat.svg"
import { useParams, useRouter } from "next/navigation";
import { CreditCard, Github, HelpCircle, Instagram, Linkedin, LogOut, Mail, Pencil, Phone, Settings, Shield, Trash } from "lucide-react";
import Chat from "../../../../public/Chat.svg";
import Deneme from "../../../../public/deneme.jpeg";
import banner from "../../../../public/banner.png";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import User from "@/app/interfaces/UserInterface";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditProfileDialog } from "./EditProfileDialog";
import { GetUserById, GetUserProfile } from "@/api/userAPI/api";
import { CreateProfileDialog } from "./CreateProfileDialog";
import ProfileSidebar from "./ProfileSidebar";
import FriendRequestButton from "./FriendRequestButton";
import UserProfileSidebar from "./UserProfileSidebar";

export default function MeUserProfilePage() {
    const router = useRouter();
    const { userId } = useParams();
    const [authId, setAuthId] = useState<User | null>(null);

    const { userWithID, isError, isLoading } = GetUserById(userId);
    const { userProfile, isErrorUserProfile, isLoadingUserProfile } = GetUserProfile(userId);
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
                const response = await fetch('http://localhost:8000/api/user', {
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
    }, [userId]);


    return (
        <div className="flex w-full h-full bg-white">
            <UserProfileSidebar />
            <div className="flex flex-col gap-3 flex-1 w-full h-full">
                <div className="w-full h-[500px]  bg-white">
                    <div className="w-full h-1/2 relative rounded-md">
                        <Image src={banner} alt="banner" className="w-full h-[180px]" />
                        <Image src={Deneme} alt="profile" className="w-[150px] h-[150px] object-cover rounded-full absolute top-1/2 left-12 border border-black" />
                        <div className="w-full h-[30px] flex items-center justify-end p-6">
                        </div>
                    </div>
                    <div className="w-full h-1/2 p-5 flex flex-col mt-2">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col items-start ml-5">
                                <h1 className="text-black text-[24px] font-newCustom">{userWithID?.fullname}</h1>
                                <p className="text-muted-foreground text-[14px] font-newCustom">{userProfile?.job}</p>
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
                            <div>
                                {
                                    authId != Number(userId) && (<FriendRequestButton authId={authId} profileId={Number(userId)} />)
                                }
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
        </div>
    );
}
