"use client"
import { Button } from "@/components/ui/button";
import { Bell, MoveLeft } from "lucide-react";
import Image from "next/image";
import Logo from "../../../../public/mainPageLogo.svg";
import { useParams, useRouter } from "next/navigation";
import MeUserProfilePage from "../_components/meUserProfilePage";
import { useEffect, useState } from "react";
import UserProfilePage from "../_components/userProfilePage";
import User from "@/app/interfaces/UserInterface";

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
        <div className="w-full h-screen bg-[#8286cf]">
            <div className="flex flex-col w-full  h-full items-center justify-center">
                {
                    authId == userId ? (<div className="bg-white rounded-md w-11/12 p-5 mb-3">
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
                    </div>) : null
                }
                {
                    authId == userId ? (<MeUserProfilePage />) : (<UserProfilePage />)
                }
            </div>
        </div>

    )
}