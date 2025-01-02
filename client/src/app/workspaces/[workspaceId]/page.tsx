"use client"
import { useParams, usePathname } from "next/navigation"



export default function WorkplaceId() {
    const params = useParams()
    const pathname = usePathname()
    return (
        <div>
            {params.workspaceId}
        </div>
    )
}