import { useParams, useRouter } from "next/navigation";
import { Github, Instagram, Linkedin, Mail, Phone, User2 } from "lucide-react";
import deneme from "../../../../public/deneme.jpeg";
import banner from "../../../../public/banner.png";
import { useEffect, useState } from "react";
import User from "@/app/interfaces/UserInterface";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditProfileDialog } from "./EditProfileDialog";
import { GetAvatar, GetUserById, GetUserProfile } from "@/api/userAPI/api";
import { CreateProfileDialog } from "./CreateProfileDialog";
import ProfileSidebar from "./ProfileSidebar";

export default function MeUserProfilePage() {
    const { userId } = useParams();
    const [authId, setAuthId] = useState<User | null>(null);

    const { userWithID, isError, isLoading } = GetUserById(userId);
    const { userProfile, isErrorUserProfile, isLoadingUserProfile } = GetUserProfile(userId);
    const { avatar, isLoadingAvatar, isErrorAvatar } = GetAvatar(userId);
    const imageUrl = avatar?.FilePath ? `http://localhost:8000/${avatar.FilePath}` : null;

    const socialLinks = [
        {
            key: "linked_in",
            name: "Linkedin",
            icons: <Linkedin />,
            link: userProfile?.linked_in
        },
        {
            key: "instagram",
            name: "Instagram",
            icons: <Instagram />,
            link: userProfile?.instagram
        },
        {
            key: "mail",
            name: "Mail",
            icons: <Mail />,
            link: `mailto: ${userProfile?.mail}`
        },
        {
            key: "github",
            name: "Github",
            icons: <Github />,
            link: userProfile?.github
        },
        {
            key: "phone",
            name: "Phone",
            icons: <Phone />,
            link: `tel: ${userProfile?.phone}`
        },
    ];

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
    }, [userId]);
    return (
        <div className="flex w-11/12 m-auto h-full bg-white">
            <ProfileSidebar />
            <div className="flex flex-col gap-3 flex-1 w-full h-full p-5">
                <div className="w-full h-[500px]  bg-white ">
                    <div className="w-full h-1/2 relative rounded-md">
                        <Image src={banner} alt="banner" className="w-full h-[180px] rounded-md" />
                        {imageUrl ? (
                            <Image
                                priority
                                src={imageUrl}
                                alt="Profile Avatar"
                                width={150}
                                height={150}
                                className="object-cover rounded-full absolute top-1/2 left-12 border border-black"
                            />
                        ) : (
                            <div className="w-[150px] h-[150px] rounded-full absolute top-1/2 left-12 border border-black flex items-center justify-center bg-gray-200">
                                <User2 className="w-[100px] h-[100px] text-white" />
                            </div>
                        )}
                        <div className="w-full h-[30px] flex items-center justify-end p-6">
                            {!userProfile.error ? (<EditProfileDialog />) : <CreateProfileDialog />}
                        </div>
                    </div>
                    <div className="w-full h-1/2 p-5 flex flex-col mt-2">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col items-start ml-5">
                                <h1 className="text-black text-[22px] font-newCustom">{userWithID?.fullname}</h1>
                                <p className="text-muted-foreground text-[14px] font-newCustom">@{userProfile?.username}</p>
                                <p className="text-muted-foreground text-[16px] font-newCustom">{userProfile?.job}</p>
                            </div>
                            <div className="flex flex-row gap-2 justify-center items-center ">
                                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                                    <p className="text-white font-newCustom">A</p>
                                </div>
                                <p className="text-black font-newCustom">ABO Sunucusu</p>
                            </div>
                        </div>
                        <div className="w-full p-5 flex flex-col gap-8">
                            <div>
                                <p className="text-blue-500 font-newCustom">Socials</p>
                                <div className="flex justify-center lg:justify-start mt-2 space-x-4">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.key}
                                            href={link.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-500 hover:text-[#8185f3]"
                                        >
                                            {link.icons}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ml-auto mr-auto w-full p-5">
                    <Card className="mb-4 bg-white">
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Merhaba, ben {userWithID?.name || "Kullanıcı"}! Frontend alanında çalışıyorum ve yeni teknolojiler öğrenmeyi seviyorum.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
