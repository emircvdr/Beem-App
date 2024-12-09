import { Sidebar, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";
import Image from "next/image";
import logo from "../../../../public/logo.svg";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronUp, LogOut, MessageCircle, User2, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import User from "@/app/interfaces/UserInterface";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Messages from "./Messages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Friends from "./Friends";
import { GetAvatar } from "@/api/userAPI/api";

export default function SidebarComponent() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<any>(null);
    const { avatar, isLoadingAvatar, isErrorAvatar } = GetAvatar(user?.id);
    const imageUrl = avatar?.FilePath ? `${process.env.NEXT_PUBLIC_API_URL}/${avatar.FilePath}` : null;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user', {
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
            const response = await fetch('http://localhost:8000/api/logout', {
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
            <SidebarHeader className="flex flex-row justify-center items-center p-5">
                <Image src={logo} alt="logo" width={50} height={50} />
                <h1 className="font-bold text-black font-custom text-[20px]">beemApp</h1>
            </SidebarHeader>
            <Tabs defaultValue="dms" className="w-full p-2 h-full">
                <TabsList className="flex w-full justify-evenly bg-transparent">
                    <TabsTrigger value="dms"><MessageCircle size={16} className="text-black" /></TabsTrigger>
                    <TabsTrigger value="friends"><UsersRound size={16} className="text-black" /></TabsTrigger>
                </TabsList>
                <SidebarSeparator className="mt-2 mb-2" />
                <TabsContent value="dms">
                    <Messages />
                </TabsContent>
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
                                    {imageUrl ? <Image src={imageUrl} alt="avatar" width={35} height={35} /> :
                                        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-slate-200  text-lg text-black">
                                            {
                                                user?.fullname?.split(" ").map((item) => item[0].toUpperCase()).join("")
                                            }
                                        </div>
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
                                        imageUrl ? <Image src={imageUrl} alt="avatar" width={35} height={35} /> :
                                            <div className="w-8 h-8 rounded-md flex items-center justify-center bg-slate-200  text-lg text-black">
                                                {
                                                    user?.fullname?.split(" ").map((item) => item[0].toUpperCase()).join("")
                                                }
                                            </div>
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
