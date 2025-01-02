import { Sidebar, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";
import Image from "next/image";
import logo from "../../../../public/logo.svg";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronUp, LogOut, MessageCircle, Settings, User2, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import User from "@/app/interfaces/UserInterface";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Messages from "./Messages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Friends from "./Friends";
import { GetAvatar } from "@/api/userAPI/api";
import Avatar from "boring-avatars";
import { getCookie } from "cookies-next/client";

export default function SidebarComponent() {
    const authId = getCookie("authId");
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<any>(null);
    const { avatar, isLoadingAvatar, isErrorAvatar } = GetAvatar(user?.id);
    const imageUrl = avatar?.FilePath ? `http://localhost:8000/${avatar.FilePath}` : null;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                    credentials: "include",
                });

                const data = await response.json();

                if (response.ok) {
                    setUser(data);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                setError(error);
            }
        };
        fetchData();
    }, []);


    const handleLogOut = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                router.push('/login');
            } else {
                setError("Something went wrong");
            }
        } catch (error) {
            setError(error);
        }
    }
    const handleGoProfile = () => {
        router.push(`/profile/${user?.id}`);
    }
    return (
        <Sidebar variant="sidebar" collapsible="offcanvas" >
            <SidebarHeader className="flex flex-row justify-center items-center p-5 cursor-pointer" onClick={() => {
                router.push("/home")
            }}>
                <Image src={logo} alt="logo" width={50} height={50} />
                <h1 className="font-bold text-black font-custom text-[20px]">beemApp</h1>
            </SidebarHeader>
            <Tabs defaultValue="friends" className="w-full p-2 h-full">
                <TabsList className="flex w-full justify-evenly bg-transparent">
                    <TabsTrigger value="friends"><UsersRound size={16} className="text-black" /></TabsTrigger>
                </TabsList>
                <SidebarSeparator className="mt-2 mb-2" />
                <TabsContent value="friends">
                    <Friends authId={user?.id} />
                </TabsContent>
            </Tabs>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="text-black  border " variant="default" size="lg">
                                    {imageUrl ? <Image src={imageUrl as string} alt="avatar" width={40} height={40} className="object-contain" /> :
                                        <Avatar
                                            name={user?.id?.toString()}
                                            variant="beam"
                                            colors={["#40223c", "#42988f", "#b1c592", "#f1ddba", "#fb718a"]}
                                            style={{ width: "40px", height: "40px" }}
                                        />
                                    }
                                    <div className="flex flex-col items-start justify-center">
                                        <p className="text-[14px] text-black font-newCustom">{user?.fullname}</p>
                                        <p className="text-[10px] text-muted-foreground font-newCustom">{user?.email}</p>
                                    </div>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width] "
                            >
                                <div className="flex flex-row gap-3 p-3">
                                    {
                                        imageUrl ? <Image src={imageUrl} alt="avatar" width={40} height={40} className="object-contain" /> :
                                            <Avatar
                                                name={user?.id?.toString()}
                                                variant="beam"
                                                colors={["#40223c", "#42988f", "#b1c592", "#f1ddba", "#fb718a"]}
                                                style={{ width: "40px", height: "40px" }}
                                            />
                                    }
                                    <div className="flex flex-col">
                                        <p className="text-[16px]">{user?.fullname}</p>
                                        <p className="text-[10px]">{user?.email}</p>
                                    </div>

                                </div>
                                <Separator orientation="horizontal" className="w-full mb-2" />
                                <DropdownMenuItem onClick={handleGoProfile}>
                                    <User2 />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <Separator orientation="horizontal" className="w-full" />
                                <DropdownMenuItem onClick={handleLogOut}>
                                    <LogOut />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
