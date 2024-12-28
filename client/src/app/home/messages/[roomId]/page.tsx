"use client";
import { GetAllAvatars, GetAllUsers, GetAvatar, GetUserById, GetUserProfile } from "@/api/userAPI/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import BoringAvatar from "boring-avatars";
import { useParams, useRouter } from "next/navigation";
// import { GetRoomWithId } from "@/api/roomAPI/api";
import { getCookie } from 'cookies-next/client';
import { Ban, SquareArrowOutUpRight } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import ChatBody from "../_components/ChatBody";
import { Input } from "@/components/ui/input";
import autosize from "autosize";
import { GetRoomWithId } from "@/api/roomAPI/api";

export type Message = {
    content: string;
    client_id: string;
    username: string;
    room_id: string;
    type: "recv" | "self";
    img?: any;
};

export default function MessagesPage() {
    const params = useParams();
    const router = useRouter();
    const authId = getCookie("authId");

    const { room, isErrorRoom, isLoadingRoom } = GetRoomWithId(params.roomId as string);
    const userId = room?.user1Id === authId ? room?.user2Id : room?.user1Id;

    const { userWithID, isError, isLoading } = GetUserById(userId);
    const { allUsers, isErrorAllUsers, isLoadingAllUsers } = GetAllUsers()
    const { userProfile, isErrorUserProfile, isLoadingUserProfile } = GetUserProfile(userId);
    const { avatar, isLoadingAvatar, isErrorAvatar } = GetAvatar(userId);
    const imageUrl = avatar?.FilePath ? `http://localhost:8000/${avatar.FilePath}` : null;

    const [users, setUsers] = useState<Array<{ username: string }>>([]);

    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState<string>(''); // Mesaj metni durumu
    const messageRef = useRef<HTMLInputElement>(null);

    const [ws, setWs] = useState<WebSocket | null>(null);

    const handleSendMessage = () => {
        if (ws && messageText) {
            const message: Message = {
                content: messageText,
                client_id: authId as string,
                username: allUsers.find((item: any) => item.id == authId).fullname || '',
                room_id: params.roomId as string,
                type: "self",
            };

            setMessages((prevMessages) => [...prevMessages, message]);
            ws.send(JSON.stringify(message));

            setMessageText("");
        }
    };


    useEffect(() => {
        const websocket = new WebSocket(
            `ws://localhost:8000/ws/${params.roomId as string}`
        );
        setWs(websocket);

        websocket.onopen = () => {
            console.log("WebSocket connected");
        };

        websocket.onclose = () => {
            console.log("WebSocket closed");
        };

        websocket.onmessage = (event) => {
            const newMessage: Message = JSON.parse(event.data);
            if (newMessage.client_id != authId) {
                newMessage.type = "recv";
                setMessages(
                    (prevMessages) => [...prevMessages, newMessage]
                )
            }
        };

        return () => {
            if (websocket) {
                websocket.close();
            }
        };
    }, [params.roomId]);

    return (
        <div className="w-[calc(100%-120px)] h-full flex flex-col">
            <div className="w-full h-[120px] p-4 flex">
                <div className="flex flex-row items-center justify-start gap-2">
                    <Avatar className="w-[50px] h-[50px]">
                        <AvatarImage src={imageUrl as any} alt="avatar" className="rounded-full object-contain" />
                        <AvatarFallback>
                            <BoringAvatar
                                name={userId?.toString()}
                                variant="beam"
                                colors={["#40223c", "#42988f", "#b1c592", "#f1ddba", "#fb718a"]}
                                style={{ width: "150px", height: "150px" }}
                            />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start justify-start">
                        <Select>
                            <SelectTrigger className="w-fit border-none shadow-none p-0 focus:ring-0">
                                <SelectValue placeholder={
                                    <h1 className="text-black text-[22px] mr-2 font-newCustom">{userWithID?.fullname}</h1>
                                } className="border-none" />
                            </SelectTrigger>
                            <SelectContent className="w-[200px] h-[160px]">
                                <div className="flex flex-row items-center justify-start gap-2 p-2">
                                    <Avatar className="w-[30px] h-[30px]">
                                        <AvatarImage src={imageUrl as any} alt="avatar" className="rounded-full object-contain" />
                                        <AvatarFallback>
                                            <BoringAvatar
                                                name={userId?.toString()}
                                                variant="beam"
                                                colors={["#40223c", "#42988f", "#b1c592", "#f1ddba", "#fb718a"]}
                                                style={{ width: "150px", height: "150px" }}
                                            />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start justify-start">
                                        <h3 className="text-black text-[15px]  font-newCustom">{userWithID?.fullname}</h3>
                                        <p className="text-muted-foreground text-[12px] font-newCustom">{userWithID?.email}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex flex-col items-start justify-start gap-2 p-2">
                                    <Button variant="secondary" size="sm" className="flex flex-row gap-2 justify-start w-full" onClick={() => router.push(`/profile/${userId}`)}>
                                        <SquareArrowOutUpRight /> View Profile
                                    </Button>
                                    <Button variant="destructive" size="sm" className="flex flex-row gap-2 justify-start w-full">
                                        <Ban /> Block User
                                    </Button>
                                </div>
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">@{userProfile?.username}</span>
                    </div>
                </div>
            </div>
            <Separator />
            <div className="w-full flex-1 overflow-y-auto p-4">
                <ChatBody data={messages} user_id={userId} />
            </div>
            <div className="w-full p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Type your message..."
                        className="flex-1"
                        style={{ maxWidth: 'calc(100% - 110px)', height: '40px', borderRadius: "50px" }}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        ref={messageRef}
                    />
                    <Button className="w-[100px]" onClick={handleSendMessage}>Send</Button>
                </div>
            </div>
        </div>
    );
}
