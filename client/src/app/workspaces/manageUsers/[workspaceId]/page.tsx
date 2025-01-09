"use client"
import { GetWorkplaceMember } from "@/api/workspacesAPI/api";
import { columns, User } from "../_components/columns";
import { DataTable } from "../_components/data-table";
import { useParams } from "next/navigation";
import { GetAllAvatars, GetAllUsers, GetAvatar } from "@/api/userAPI/api";
import { getCookie } from "cookies-next/client";
import { Crown, Headset, User as UserIcon, } from "lucide-react";



export default function ManageUsersPage() {
    const { workspaceId } = useParams()
    const authId = getCookie("authId")
    const { workplaceMembers, isErrorWorkplaceMembers, isLoadingWorkplaceMembers } = GetWorkplaceMember(workspaceId)
    const { allUsers, isErrorAllUsers, isLoadingAllUsers } = GetAllUsers()
    const { allAvatars, isErrorAllAvatars, isLoadingAllAvatars } = GetAllAvatars()





    const data: User[] = workplaceMembers?.map((member: any) => {
        const user = allUsers?.find((user: any) => user.id === member.user_id)

        return {
            id: member?.id,
            workspace_id: member?.workplace_id,
            user_id: user?.id || "",
            name: user?.id == authId ? `${user?.fullname || "Unknown"} (You)` : user?.fullname || "Unknown",
            email: user?.email || "Unknown",
            role: member?.role === "admin" ? (
                <div className="flex items-center gap-2 border border-[#f5a623] rounded-md w-fit p-1 bg-[#fff4e6] text-[#d48806]">
                    <Crown size={15} color="#d48806" />Owner
                </div>
            ) : member?.role === "head" ? (
                <div className="flex items-center gap-2 border border-[#38a169] rounded-md w-fit p-1 bg-[#e6fffa] text-[#2f855a]">
                    <Headset size={15} color="#2f855a" />Head
                </div>
            ) : (
                <div className="flex items-center gap-2 border border-[#cbd5e0] rounded-md w-fit p-1 bg-[#f7fafc] text-[#4a5568]">
                    <UserIcon size={15} color="#4a5568" />Member
                </div>
            )
        }
    }) || [];


    return (
        <div className="w-full h-screen p-5">
            <div className="h-[350px] p-5 m-auto">
                <h1 className="font-newCustom text-2xl">Manage Users</h1>
                <div className="mt-5">
                    <DataTable columns={columns} data={data} />
                </div>

            </div>
        </div>
    );
}

