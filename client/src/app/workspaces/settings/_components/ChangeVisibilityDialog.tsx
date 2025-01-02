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
import { mutate } from "swr/_internal";

export function ChangeVisibilityDialog({ workplaceName, workplaceId, visibility }: { workplaceName: string, workplaceId: number, visibility: boolean }) {
    const router = useRouter();
    const [iwtdtw, setIwtdtw] = useState(true);
    const [vsblty, setVsblty] = useState(true)
    const [inputValue, setInputValue] = useState("");
    const confirmationText = workplaceName
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    const [open, setOpen] = useState(false);

    const handleSave = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateWorkplaceVisibility/${workplaceId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    private: !visibility,
                }),
            });
            if (response.ok) {
                toast.success("Workspace updated successfully");
                mutate(`${process.env.NEXT_PUBLIC_API_URL}/workplaceWithId/${workplaceId}`);
                setOpen(false);
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (error) {
            console.error(error)
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    {
                        visibility ? "Make this workplace public" : "Make this workplace private"
                    }
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Visibility {workplaceName}</DialogTitle>
                </DialogHeader>
                <Separator orientation="horizontal" className="w-full" />
                {
                    vsblty ? (
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
                                    {
                                        visibility ? "Making this workplace public will allow anyone to join this workplace." : "Making this workplace private will restrict access to only invited members."
                                    }
                                </span>
                            </div>

                        </div>))) : (<div className="w-full h-full flex flex-col">
                            <span className="font-newCustom text-[14px] mb-2">To confirm, type <strong>"{confirmationText}"</strong> in the bow below</span>
                            <Input
                                className="w-full"
                                onChange={handleChange}
                                value={inputValue}
                            />
                        </div>)
                }
                <DialogFooter>
                    {
                        vsblty ? (
                            iwtdtw ? (
                                <Button onClick={() => { setIwtdtw(false) }} className="w-full mt-2" size="sm">I want to make this workplace {
                                    visibility ? "public" : "private"
                                }</Button>
                            ) : (
                                <Button onClick={() => { setVsblty(false) }} className="w-full" size="sm">I have read and understand these effects.</Button>
                            )
                        ) : (<Button onClick={handleSave} className="w-full" size="sm" variant="friendRequest" disabled={
                            inputValue !== confirmationText
                        }>Change Visibility</Button>)

                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
