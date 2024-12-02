import { SearchInput } from "@/components/ui/searchInput";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import DirectMessageBox from "./DirectMessageBox";
import logo from "../../../../public/logo.svg";


export default function Messages() {
    const items = [
        {
            name: "Emir",
            // doğru logo yolu kullanılıyor
            lastm: "hahahahah harika"
        },
        {
            name: "Betul",
            img: logo,
            lastm: "napiyonn"
        },
        {
            name: "ediz",
            img: logo,
            lastm: "su getirsene"
        },
    ]
    return (
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel className="text-gray-200 font-bold">DIRECT MESSAGES</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SearchInput type="search" placeholder="Search" className="mb-5 mt-3 border-none bg-[#6668a0] text-white  placeholder-black" />
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.name} className="mb-4 transition-colors hover:bg-[#6668a0] rounded-lg">
                                <SidebarMenuButton asChild>
                                    <DirectMessageBox image={item.img} name={item.name} lastMessage={item.lastm} />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    )
}