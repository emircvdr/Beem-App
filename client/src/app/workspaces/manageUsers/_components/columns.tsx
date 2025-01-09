"use client"

import { ColumnDef, flexRender } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { AtSign, Award, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { getCookie } from "cookies-next/client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import BoringAvatar from "boring-avatars"
import { GetAllAvatars, GetAvatar } from "@/api/userAPI/api"
import { toast } from "sonner"
import { mutate } from "swr"

export type User = {
    id: string
    user_id: string
    name: string
    email: string
    role: string
    img: string
    workspace_id: string
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const user = row.original;
            const { avatar, isLoadingAvatar, isErrorAvatar } = GetAvatar(user.user_id);
            const imageUrl = avatar?.FilePath ? `http://localhost:8000/${avatar.FilePath}` : null;
            return (
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={imageUrl as any} alt="avatar" className="object-contain" />
                        <AvatarFallback>
                            <BoringAvatar
                                name={user.user_id?.toString()}
                                variant="beam"
                                colors={["#40223c", "#42988f", "#b1c592", "#f1ddba", "#fb718a"]}
                                style={{ width: "150px", height: "150px" }}
                            />
                        </AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                </div >
            );
        },
    },
    {
        accessorKey: "email",
        header: () => <div className="flex items-center gap-2">
            <AtSign size={20} color="#8286cf" />
            <span>Email</span>
        </div>,
        cell: ({ row }) => <div className="underline text-blue-5">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "role",
        header: () => <div className="flex items-center gap-2">
            <Award size={20} color="#8286cf" />
            <span>Role</span>
        </div>,
        cell: ({ row }) => <div className="">{row.getValue("role")}</div>,

    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const user = row.original
            const route = useRouter()
            const authId = getCookie("authId")
            const handleKick = async () => {
                try {
                    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteWorkplaceMember/${user.id}`, {
                        method: "DELETE",
                    });
                    if (result.ok) {
                        mutate(`${process.env.NEXT_PUBLIC_API_URL}/getWorkplaceMemberWithWorkplaceId/${user.workspace_id}`)
                        toast.success("User kicked from the workspace")
                    }
                    if (!result.ok) {
                        throw new Error("Error while kicked user");
                    }
                } catch (error) {
                    console.error("Error while kicked user:", error);
                }
            }
            return (
                authId == user.id ? null :
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => route.push(`/profile/${user.user_id}`)}>View User Profile</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500" onClick={handleKick}>Kick From The Workspace</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
            )
        },
    },
]
