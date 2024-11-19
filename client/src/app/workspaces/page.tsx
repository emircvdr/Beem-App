"use client"

import Image from "next/image"
import noDm from "../../../public/noDmSelected.svg"
import { Button } from "@/components/ui/button"
import { MessageCircleMore } from "lucide-react"

export default function Workspaces() {
    return (
        <div className="w-full h-full flex flex-col items-center  bg-[#6668a0]">
            <Image src={noDm} alt="workspaces" width={350} height={350} />
            <h1 className="text-white/90 font-bold text-xl mt-5">
                Sorry! You need to start chatting to see your messages.
            </h1>
            <Button size="lg" className="mt-6" variant="homePage">
                <MessageCircleMore size={20} className="mr-2" />
                Start Chatting</Button>
        </div>
    )
}