import premiumMember from "../../../../public/premiumMember.svg"
import admin from "../../../../public/admin.svg"
import { useParams, useRouter } from "next/navigation";
import { CreditCard, Github, HelpCircle, Instagram, Linkedin, LogOut, Mail, MoveLeftIcon, Phone, Settings, Shield, Trash } from "lucide-react";
import Chat from "../../../../public/Chat.svg";
import Deneme from "../../../../public/deneme.jpeg";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import User from "@/app/interfaces/UserInterface";
import UserProfileInterface from "@/app/interfaces/UserProfileInterface";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserProfilePage() {
    const router = useRouter();
    const { userId } = useParams();
    const [authId, setAuthId] = useState<User | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfileInterface | null>(null);

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
            badge: Chat
        }
    ]

    const socialLinks = [
        {
            key: "linked_in",
            name: "Linkedin",
            icons: <Linkedin />,
            link: profile?.linked_in
        },
        {
            key: "instagram",
            name: "Instagram",
            icons: <Instagram />,
            link: profile?.instagram
        },
        {
            key: "mail",
            name: "Mail",
            icons: <Mail />,
            link: `mailto:${profile?.mail}`
        },
        {
            key: "github",
            name: "Github",
            icons: <Github />,
            link: profile?.github
        },
        {
            key: "phone",
            name: "Phone",
            icons: <Phone />,
            link: `tel:${profile?.phone}`
        },
    ]

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
        const getProfileWithId = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/getUserWithId/${userId}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const user = await response.json();
                    setUser(user);
                } else {
                    throw new Error('Failed to check user');
                }
            } catch (error) {
                console.error(error);
            }
        }
        const getUserProfile = async (userId: number) => {
            try {
                const response = await fetch(`http://localhost:8000/api/userProfiles/${userId}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const user = await response.json();
                    setProfile(user);
                } else {
                    throw new Error('Failed to get user profile');
                }
            } catch (error) {
                console.error(error);
            }

        }
        checkUser();
        getProfileWithId();

        if (userId) {
            getUserProfile(userId);
        }
    }, [user?.id])


    return (
        <div className="bg-white rounded-md h-5/6 p-5 flex items-center justify-center gap-2 relative">
            <Button size="icon" variant="ghost" className="absolute left-3 top-3" onClick={() => { router.push("/workspaces") }}>
                <MoveLeftIcon />
            </Button>
            <div className="flex flex-col items-center">
                <div className="w-52 h-52 rounded-full bg-[#8286cf] flex items-center justify-center">
                    <Image src={Deneme} alt="Profile Picture" width={200} height={200} className="rounded-full" />
                </div>
                <div className="p-3 w-full h-3/5  bg-gray-50/0 rounded-md flex flex-col">
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-newCustom font-bold">{user?.fullname}</h1>
                        <p className="text-sm text-gray-500">{`@${profile?.username}`}</p>
                        <p className="text-sm text-gray-500">{profile?.job}</p>
                    </div>
                    <div className="flex flex-row gap-16 mt-3 w-full">
                        <div>
                            <h1 className="text-xl mt-5 font-newCustom">Socials</h1>
                            <div className="flex flex-col gap-3 mt-3">
                                {
                                    socialLinks.filter((items) => {
                                        return items.link;
                                    }).map((items, index) => {
                                        let displayLink = items.link;
                                        if (items.key === "linked_in" || items.key === "instagram" || items.key === "github") {
                                            const username = items.link?.split("/").filter(Boolean).pop();
                                            displayLink = username || "";
                                        }
                                        if (items.key === "mail") {
                                            displayLink = displayLink?.replace("mailto:", "");
                                        } else if (items.key === "phone") {
                                            displayLink = displayLink?.replace("tel:", "") || "";
                                        }
                                        return (
                                            <div key={index} className="flex flex-row gap-2 items-center">
                                                {items.icons}
                                                <a href={items.link} target="_blank">
                                                    <span className="text-[#8286cf]">{displayLink}</span>
                                                </a>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <div >
                            <h1 className="text-xl mt-5 font-newCustom">
                                Achievements
                            </h1>
                            <div className="flex flex-row gap-3 mt-3">
                                {
                                    badgeItems.map((items, index) => (
                                        <TooltipProvider key={index} delayDuration={50}>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Image src={items.badge} alt={items.name} width={60} height={60} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{items.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <Button className="mt-12">
                        Send a Friend Request
                    </Button>
                </div>
            </div>
        </div>
    )
}