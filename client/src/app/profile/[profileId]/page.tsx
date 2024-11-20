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
import { useRouter } from "next/navigation";

export default function ProfileId() {
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
                    <div className=" w-1/3 h-full flex flex-col items-start">
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
                    </div>
                    <div className="w-1/3 h-full flex flex-col items-center border-r border-l ">
                        <div className="w-52 h-52 rounded-full bg-[#8286cf] flex items-center justify-center">
                            <Image src={Deneme} alt="Profile Picture" width={200} height={200} className="rounded-full" />
                        </div>
                        <div className="p-3 w-full h-3/5  bg-gray-50/0 rounded-md flex flex-col">
                            <div className="flex flex-col items-center">
                                <h1 className="text-2xl font-newCustom font-bold">Emir Çavdar</h1>
                                <p className="text-sm text-gray-500">Frontend Developer</p>
                                <Button size="sm" className="mt-2 w-full">
                                    Edit Profile
                                </Button>
                            </div>
                            <h1 className="text-xl mt-5 font-newCustom">Socials</h1>
                            <div className="flex flex-col gap-3 mt-3">
                                <div className="flex flex-row gap-2 items-center">
                                    <Linkedin />
                                    <p>Emir Çavdar</p>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                    <Instagram />
                                    <p>@emircavdar</p>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                    <Mail />
                                    <p>emircvdr@gmail.com</p>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                    <Github />
                                    <p>@emircvdr</p>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                    <Phone />
                                    <p>532 494 03 41</p>
                                </div>
                            </div>
                            <Button className="mt-12" size="sm">
                                Share Your Profile
                            </Button>
                        </div>
                    </div>
                    <div className=" w-1/3 h-full flex flex-col items-center gap-5">
                        {
                            badgeItems.map((items, index) => (
                                <TooltipProvider key={index}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Image src={items.badge} alt={items.name} width={130} height={130} />
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