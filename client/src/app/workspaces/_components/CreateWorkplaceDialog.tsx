"use client"
import User from "@/app/interfaces/UserInterface";
import Workplace from "@/app/interfaces/WorkplaceInterface";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";


export default function CreateWorkplaceDialog() {
    const pathname = usePathname()
    const authId = getCookie("authId");


    const [error, setError] = useState<any>(null);

    const [form, setForm] = useState<Workplace>({
        name: "",
        admin_id: 0,
        private: false
    });

    const router = useRouter();

    useEffect(() => {
        if (!authId) {
            router.push("/login")
        }

        const getWorkspaces = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workplaces/${authId}`, {
                    credentials: "include",
                });

                const data = await response.json();
                if (pathname === "/" && authId) {
                    if (response.ok) {
                        if (data.length > 0) {
                            router.push(`/home`);
                        }
                    } else {
                        router.push("/");
                        setError(await response.json());
                    }
                }
            } catch (error) {
                setError(error);
            }
        };

        if (authId) {
            getWorkspaces();
        }

    }, [authId]);

    const handleCreateWorkplace = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/createWorkplace`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...form,
                    admin_id: Number(authId),
                }),
            });
            const data = await response.json();
            if (response.ok) {
                router.push(`/workspaces/${data.id}`);
            } else {
                setError(await response.json());
            }
        } catch (error) {
            setError(error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {
                    pathname === "/" ? (<Button size="lg" className="mt-6" variant="homePage">Create a Workplace</Button>) : (<div className="w-[50px] h-[50px] border rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-all">
                        <Plus style={
                            {
                                width: "30px",
                                height: "30px",
                                color: "#000"
                            }
                        } />
                    </div>)
                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a Workplace</DialogTitle>
                    <DialogDescription>
                        Create a workplace to start managing your tasks and communicate with your team.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name">
                            Workplace Name
                        </Label>
                        <Input
                            id="workplace Name"
                            className="col-span-3"
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-row justify-between items-center gap-4">
                        <Label htmlFor="private">
                            Private Workplace ?
                        </Label>
                        <Switch id="private"
                            checked={form.private}
                            onCheckedChange={(checked) => setForm({ ...form, private: checked })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" variant="special" onClick={handleCreateWorkplace}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}