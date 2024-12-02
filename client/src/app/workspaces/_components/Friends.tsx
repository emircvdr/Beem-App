import { SearchInput } from "@/components/ui/searchInput";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import DirectMessageBox from "./DirectMessageBox";
import logo from "../../../../public/logo.svg";
import FriendsBox from "./FriendsBox";


export default function Friends() {
    const items = [
        {
            name: "Emir",
            // doğru logo yolu kullanılıyor
        },
        {
            name: "Betul",
            img: logo,
        },
        {
            name: "ediz",
            img: logo,
        },
    ]
    return (
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel className="text-gray-200 font-bold">FRIENDS LIST</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SearchInput type="search" placeholder="Search" className="mb-5 mt-3 border-none bg-[#6668a0] text-white  placeholder-black" />
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.name} className="mb-4 transition-colors hover:bg-[#6668a0] rounded-lg">
                                <SidebarMenuButton asChild>
                                    <FriendsBox image={item.img} name={item.name} />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    )
}