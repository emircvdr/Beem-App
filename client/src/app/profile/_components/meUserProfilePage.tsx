import premiumMember from "../../../../public/premiumMember.svg"
import admin from "../../../../public/admin.svg"
import chat from "../../../../public/chat.svg"
import { useParams, useRouter } from "next/navigation";
import { CreditCard, Github, HelpCircle, Instagram, Linkedin, LogOut, Mail, Phone, Settings, Shield, Trash } from "lucide-react";
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

export default function MeUserProfilePage() {
    const router = useRouter();
    const { userId } = useParams();
    const [authId, setAuthId] = useState<User | null>(null);

    const { userWithID, isError, isLoading } = GetUserById(userId);
    const { userProfile, isErrorUserProfile, isLoadingUserProfile } = GetUserProfile(userId);
    const badgeItems = [
        {
            name: "Premium Member",
            badge: premiumMember
        },
        {
            name: "Administer a workspace server at least a one time",
            badge: admin
        },
        {
            name: "Chat with 5 different people",
            badge: chat
        }
    ]
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
            <ProfileSidebar />
            <div className="flex flex-col flex-1 w-full h-full">
                <div className="relative w-full h-[200px]">
                    <Image src={banner} alt="Kapak Resmi" className="w-full h-full object-cover" />
                </div>
                <div className="flex lg:flex-row items-start lg:items-center mt-6 px-6">
                    <div className="lg:mr-6">
                        <Image
                            src={Deneme}
                            alt="Profil Resmi"
                            className="w-[150px] h-[150px] rounded-full border-4 border-white shadow-lg"
                        />
                    </div>
                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl font-bold">{userWithID?.fullname || "Kullanıcı Adı"}</h1>
                        <p className="text-gray-600">{userProfile?.job || ""}</p>
                        <div className="flex justify-center lg:justify-start mt-4 space-x-4">
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
                        <div className="mt-6">
                            <EditProfileDialog />
                        </div>
                    </div>
                </div>

                {/* Diğer İçerikler */}
                <div className="mt-10 w-full px-6">
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle>Hakkımda</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Merhaba, ben {userWithID?.name || "Kullanıcı"}! Frontend alanında çalışıyorum ve yeni teknolojiler öğrenmeyi seviyorum.</p>
                        </CardContent>
                    </Card>
                </div>
                <div className=" mt-10 w-full px-6 flex flex-row items-start justify-start gap-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Achievements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-3 flex flex-row items-center justify-center gap-3">
                                {
                                    badgeItems.map((items, index) => (
                                        <TooltipProvider key={index} delayDuration={50}>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Image src={items.badge} alt={items.name} width={70} height={70} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{items.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
