"use client"
import { Button } from "@/components/ui/button";
import { Bell, CreditCard, Github, HelpCircle, Instagram, Linkedin, LogOut, Mail, MoveLeft, Phone, Settings, Shield, Trash } from "lucide-react";
import premiumMember from "../../../../public/premiumMember.svg"
import admin from "../../../../public/admin.svg"
import Image from "next/image";
import Logo from "../../../../public/mainPageLogo.svg";
import Chat from "../../../../public/Chat.svg";
import Deneme from "../../../../public/deneme.jpeg";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import User from "@/app/interfaces/UserInterface";
import UserProfileInterface from "@/app/interfaces/UserProfileInterface";

export default function ProfileId() {
    const { userId } = useParams();
    const [authId, setAuthId] = useState<User | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfileInterface | null>(null);
    const router = useRouter();

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
    const leftButtons = [
        {
            name: "Settings",
            icons: <Settings />
        },
        {
            name: "My Subscriptions",
            icons: <CreditCard />
        },
        {
            name: "Enable  Two-Step Verification",
            icons: <Shield />
        },
        {
            name: "Deleted Messages",
            icons: <Trash />
        },
        {
            name: "You Need Help? Contact Us",
            icons: <HelpCircle />
        },
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

    const handleLogOut = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/logout', {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                router.push('/login');
            } else {
                throw new Error('Failed to log out');
            }
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        console.log(userId)
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
    }, [user?.id,])

    return (
        <div className="w-full h-screen bg-[#8286cf]">
            <div className="flex flex-col w-full  h-full items-center justify-center">
                <div className="bg-white rounded-md w-11/12 p-5 mb-3">
                    <div className="w-11/12 flex items-center justify-between">
                        <Button onClick={() => { router.push("/workspaces") }}>
                            <MoveLeft />
                            Back to home
                        </Button>
                        <Image src={Logo} alt="Logo" width={60} height={60} />
                        <div className="flex flex-row gap-2 items-center">
                            <Button size="icon" variant="ghost"  >
                                <Bell />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-md w-11/12 h-5/6 p-5 flex gap-2">
                    {
                        authId === user?.id && (<div className=" w-1/3 h-full flex flex-col items-start">
                            {
                                leftButtons.map((items, index) => (
                                    <Button key={index} variant="ghost">
                                        {items.icons}
                                        <p>{items.name}</p>
                                    </Button>
                                ))
                            }
                            <div className="mt-auto">
                                <Button variant="default" onClick={handleLogOut}>
                                    <LogOut /> <p className="font-bold">Log Out</p>
                                </Button>
                            </div>
                        </div>)
                    }
                    <div className="w-1/3 h-full flex flex-col items-center border-r border-l ">
                        <div className="w-52 h-52 rounded-full bg-[#8286cf] flex items-center justify-center">
                            <Image src={Deneme} alt="Profile Picture" width={200} height={200} className="rounded-full" />
                        </div>
                        <div className="p-3 w-full h-3/5  bg-gray-50/0 rounded-md flex flex-col">
                            <div className="flex flex-col items-center">
                                <h1 className="text-2xl font-newCustom font-bold">{user?.fullname}</h1>
                                <p className="text-sm text-gray-500">{`@${profile?.username}`}</p>
                                <p className="text-sm text-gray-500">{profile?.job}</p>
                                <Button size="sm" className="mt-2 w-full">
                                    Edit Profile
                                </Button>
                            </div>
                            <div className="flex flex-col gap-16 mt-3">
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
                                <Button className="mt-auto" size="lg">
                                    Share Your Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className=" w-1/3 h-full flex flex-col items-center justify-center gap-5">
                        {
                            badgeItems.map((items, index) => (
                                <TooltipProvider key={index} delayDuration={50}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Image src={items.badge} alt={items.name} width={100} height={100} />
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
        </div>
    )
}