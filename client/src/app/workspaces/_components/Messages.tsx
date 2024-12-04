import { SearchInput } from "@/components/ui/searchInput";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import DirectMessageBox from "./DirectMessageBox";
import logo from "../../../../public/logo.svg";
import deneme from "../../../../public/deneme.jpeg";


export default function Messages() {
    const items = [
        {
            name: "Emir",
            img: undefined,
            lastm: "hahahahah harika"
        },
        {
            name: "Betul",
            img: deneme,
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
                <SidebarGroupLabel className="text-black font-newCustom">DIRECT MESSAGES</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SearchInput type="search" placeholder="Search" className="mb-5 mt-3 border border-muted-foreground bg-transparent text-black font-newCustom placeholder:text-black" />
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.name} className="mb-4 transition-colors  rounded-lg hover:bg-[#6668a0]">
                                <SidebarMenuButton asChild>
                                    <DirectMessageBox image={item.img?.src} name={item.name} lastMessage={item.lastm} />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    )
}