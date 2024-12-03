"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useParams } from "next/navigation";
import { useState } from "react";
import { mutate } from "swr";



export function CreateProfileDialog() {
    const userId = useParams()
    const [dialogOpen, setDialogOpen] = useState(
        false
    );
    const [form, setForm] = useState({
        username: "",
        job: "",
        github: "",
        linked_in: "",
        instagram: "",
        mail: "",
        phone: "",
    });
    const handleCreateUserProfile = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/createUserProfile`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: Number(userId.userId),
                    ...form
                }),
            });
            if (response.ok) {
                console.log("Profile updated successfully");
                mutate(`http://localhost:8000/api/userProfiles/${userId.userId}`);
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (error) {
            console.error(error)
        }
        setForm({
            username: "",
            job: "",
            github: "",
            linked_in: "",
            instagram: "",
            mail: "",
            phone: "",
        });
        setDialogOpen(false);
    }
    return (
        <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="mt-2 w-full">
                    Create Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create your profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when yore done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            placeholder="Username"
                            id="username"
                            className="col-span-3"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            placeholder="Job"
                            id="job"
                            className="col-span-3"
                            value={form.job}
                            onChange={(e) => setForm({ ...form, job: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            placeholder="Github"
                            id="github"
                            className="col-span-3"
                            value={form.github}
                            onChange={(e) => setForm({ ...form, github: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            placeholder="LinkedIn"
                            id="linked_in"
                            className="col-span-3"
                            value={form.linked_in}
                            onChange={(e) => setForm({ ...form, linked_in: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            placeholder="Instagram"
                            id="instagram"
                            className="col-span-3"
                            value={form.instagram}
                            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            placeholder="Mail"
                            id="mail"
                            className="col-span-3"
                            value={form.mail}
                            onChange={(e) => setForm({ ...form, mail: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            placeholder="Phone"
                            id="phone"
                            className="col-span-3"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleCreateUserProfile}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}