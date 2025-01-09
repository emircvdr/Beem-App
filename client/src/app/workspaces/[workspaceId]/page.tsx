"use client"
import { GetWorkplaceMember } from "@/api/workspacesAPI/api"
import { getCookie } from "cookies-next/client"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"



export default function WorkplaceId() {
    const authId = getCookie("authId")
    const route = useRouter()
    const { workspaceId } = useParams()
    const { workplaceMembers, isErrorWorkplaceMembers, isLoadingWorkplaceMembers } = GetWorkplaceMember(workspaceId)

    useEffect(() => {
        if (workplaceMembers && !isLoadingWorkplaceMembers) {
            const isMember = workplaceMembers.some((member: any) =>
                Number(member.user_id) === Number(authId)
            )
            // Eğer authId bulunmuyorsa home'a yönlendir
            if (!isMember) {
                route.push(`/home`)
            }
        }
    }, [workplaceMembers, isLoadingWorkplaceMembers, authId, route])

    return (
        <div>
            {workspaceId}
        </div>
    )
}