"use client"
import { Button } from "@/components/ui/button";
import { Bell, CreditCard, HelpCircle, MoveLeft, Settings, Shield, Trash } from "lucide-react";
import Image from "next/image";
import Logo from "../../../../public/mainPageLogo.svg";
import { useParams, useRouter } from "next/navigation";
import MeUserProfilePage from "../_components/meUserProfilePage";
import { useEffect, useState } from "react";
import UserProfilePage from "../_components/userProfilePage";
import User from "@/app/interfaces/UserInterface";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import ProfileSidebar from "../_components/ProfileSidebar";

export default function ProfileId() {
    const router = useRouter();
    const { userId } = useParams();
    const [authId, setAuthId] = useState<User | null>(null);


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
    }, [])

    return (
        <div className="w-full h-screen">
            {authId == userId ? (<MeUserProfilePage />) : (<UserProfilePage />)}
        </div>



    )
}