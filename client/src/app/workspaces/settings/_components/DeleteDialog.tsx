"use client";
import { GetAllUsers, GetAvatar } from "@/api/userAPI/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TriangleAlert, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteDialog({ workplaceName, workplaceId }: { workplaceName: string, workplaceId: number }) {
    const router = useRouter();
    const [iwtdtw, setIwtdtw] = useState(true);
    const [cta, setCta] = useState(true)
    const [inputValue, setInputValue] = useState("");
    const confirmationText = workplaceName
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleDelete = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteWorkplace/${workplaceId}`, { method: 'DELETE' });
        } catch (error) {
            toast.error("An error occurred while rejecting the friend request");
            console.error(error);
        }
        toast.success("Friend request rejected successfully");
        router.push("/home");
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete this workplace</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete {workplaceName}</DialogTitle>
                </DialogHeader>
                <Separator orientation="horizontal" className="w-full" />
                {
                    cta ? (
                        (iwtdtw ? (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                                {workplaceName}
                                <div className="flex flex-row gap-2">
                                    <User /> <span>30</span>
                                </div>
                            </div>
                        ) : (<div className="w-full h-full flex flex-col">
                            <div className="p-2 w-full  border border-yellow-500 bg-yellow-500/55 rounded-md flex flex-row items-center gap-2">
                                <TriangleAlert className="text-yellow-500" size={15} />
                                <span className="text-[13px]  font-newCustom">
                                    Unexpected bad things will happen if you don’t read this!
                                </span>
                            </div>
                            <div className="p-2">
                                <span className="text-[13px]  font-newCustom text-muted-foreground">
                                    This will permanently delete the <span className="text-black font-bold">{workplaceName}</span> workplace, all workspaces, tasks, and members.
                                </span>
                            </div>

                        </div>))) : (<div className="w-full h-full flex flex-col">
                            <span className="font-newCustom text-[14px] mb-2">To confirm, type <strong>"{confirmationText}"</strong> in the bow below</span>
                            <Input
                                className="w-full border-red-500"
                                onChange={handleChange}
                                value={inputValue}
                            />
                        </div>)
                }
                <DialogFooter>
                    {
                        cta ? (
                            iwtdtw ? (
                                <Button onClick={() => { setIwtdtw(false) }} className="w-full mt-2" size="sm">I want to delete this workplace</Button>
                            ) : (
                                <Button onClick={() => { setCta(false) }} className="w-full" size="sm">I have read and understand these effects.</Button>
                            )
                        ) : (<Button onClick={handleDelete} className="w-full" size="sm" variant="destructive" disabled={
                            inputValue !== confirmationText
                        }>Delete this workplace</Button>)

                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
