import React from 'react'
import { Message } from '../[roomId]/page'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import BoringAvatar from 'boring-avatars'
import { GetAvatar } from '@/api/userAPI/api'


const ChatBody = ({ data, user_id }: { data: Array<Message>, user_id: string }) => {
    const { avatar, isLoadingAvatar, isErrorAvatar } = GetAvatar(user_id);
    const imageUrl = avatar?.FilePath ? `http://localhost:8000/${avatar.FilePath}` : null;

    return (
        <>
            {data.map((message: Message, index: number) => {
                if (message.type == 'self') {
                    return (
                        <div
                            className='flex flex-col mt-2 w-full text-right justify-end'
                            key={index}
                        >
                            <div>
                                <div className='bg-blue-500 text-white px-4 py-1 ml-10 rounded-md inline-block mt-1 '>
                                    {message.content}
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div className='mt-2' key={index}>
                            <div className='flex flex-row items-center justify-start gap-2'>
                                <Avatar>
                                    <AvatarImage src={imageUrl as any} alt="avatar" className="object-contain" />
                                    <AvatarFallback>
                                        <BoringAvatar
                                            name={user_id}
                                            variant="beam"
                                            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                                            style={{ width: "150px", height: "150px" }}
                                        />
                                    </AvatarFallback>
                                </Avatar>
                                <div className='text-sm !opacity-100'>
                                    {message.username}
                                </div>
                            </div>
                            <div>
                                <div className='bg-gray-200 !text-black px-4 py-1 ml-10 rounded-md inline-block mt-1'>
                                    {message.content}
                                </div>
                            </div>
                        </div>
                    )
                }
            })}
        </>
    )
}

export default ChatBody