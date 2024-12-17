import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider2 } from "@/components/ui/sidebar";
import { Bug, CreditCard, HelpCircle, MoveLeft, Settings, Shield, Trash } from "lucide-react";
import Logo from "../../../../public/logo.svg"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function UserProfileSidebar() {
    const router = useRouter();
    const leftButtons = [
        {
            name: "Report User",
            icons: <Bug />
        },
        {
            name: "You Need Help? Contact Us",
            icons: <HelpCircle />
        },
    ]
    const handleLogOut = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
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
        <SidebarProvider2>
            <Sidebar className="w-[260px]">
                <SidebarHeader className="flex flex-row justify-center items-center p-5">
                    <Image src={Logo} alt="logo" width={50} height={50} />
                </SidebarHeader>
                <SidebarContent>
                    <Button className="w-full" variant="ghost" onClick={() => { router.push("/home") }}>
                        <MoveLeft /> Back to Workspaces
                    </Button>
                    <SidebarGroup>
                        <SidebarGroupLabel>MENU</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="flex flex-col gap-2">
                                {leftButtons.map((item) => (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton asChild>
                                            <a href="/">
                                                {item.icons}
                                                <span>{item.name}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <Button className="w-full" onClick={handleLogOut}>Logout</Button>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider2 >
    )
}