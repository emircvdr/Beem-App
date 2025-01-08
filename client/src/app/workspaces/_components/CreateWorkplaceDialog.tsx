"use client"
import User from "@/app/interfaces/UserInterface";
import Workplace from "@/app/interfaces/WorkplaceInterface";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MoveRight, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";


export default function CreateWorkplaceDialog() {
    const pathname = usePathname()
    const authId = getCookie("authId");


    const [error, setError] = useState<any>(null);

    const [cworkplace, setCworkplace] = useState(false)
    const [jworkplace, setJworkplace] = useState(false)

    const [form, setForm] = useState<Workplace>({
        name: "",
        admin_id: 0,
        private: false
    });

    const [invCode, setInvCode] = useState<string>("");

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
                try {
                    const workplaceMemberResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/createWorkplaceMember`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            workplace_id: data.id,
                            admin_id: Number(authId),
                            user_id: Number(authId),
                            role: "admin"
                        }),
                    });
                    const workplaceMemberData = await workplaceMemberResponse.json();
                    if (workplaceMemberResponse.ok) {
                        router.push(`/workspaces/${data.id}`);
                    }
                } catch (error) {
                    setError(error);

                }
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
                <DialogHeader className="flex flex-col items-center">
                    <DialogTitle className="mb-2">{
                        jworkplace === false ? "Create a Workplace" : "Join Workplace"
                    }</DialogTitle>
                    <DialogDescription className="text-center">
                        {
                            jworkplace === false ? "Create a new workplace for your team" : "Join a workplace using the invite code"
                        }
                    </DialogDescription>
                </DialogHeader>
                {
                    jworkplace === false ? (cworkplace ? (
                        <div>
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
                                <Button variant="outline" onClick={() => setCworkplace(false)}>Cancel</Button>
                                <Button type="submit" variant="special" onClick={handleCreateWorkplace}>Create</Button>
                            </DialogFooter>
                        </div>) : (
                        <div className="w-full flex flex-col gap-4">
                            <div className="w-full flex items-center justify-between border rounded-md p-2 cursor-pointer hover:bg-gray-100 transition-all" onClick={() => setCworkplace(true)}>
                                <div className="flex flex-row items-center gap-4">
                                    <div className="w-[30px] h-[30px] flex items-center justify-center">
                                        <Plus style={
                                            {
                                                width: "30px",
                                                height: "30px",
                                                color: "#000"
                                            }
                                        } />
                                    </div>
                                    <span className="font-newCustom">Create My Own Workplace</span>
                                </div>
                                <MoveRight />
                            </div>
                            <div className="w-full flex flex-col items-center mt-2">
                                <h1>Have an Invite Already?</h1>
                                <Button size="lg" variant="special" className="mt-4" onClick={() => { setJworkplace(true) }}>Join Workplace</Button>
                            </div>
                        </div>
                    )) : (
                        <div>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name">
                                        Invitation Code
                                    </Label>
                                    <Input
                                        id="invCode"
                                        className="col-span-3"
                                        type="text"
                                        value={invCode}
                                        onChange={(e) => setInvCode(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setJworkplace(false)}>Cancel</Button>
                                <Button type="submit" variant="special" onClick={() => console.log("join")}>Join</Button>
                            </DialogFooter>
                        </div>
                    )
                }
            </DialogContent>
        </Dialog>
    )
}


