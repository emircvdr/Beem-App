"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useParams } from "next/navigation"
import { usePathname } from "next/navigation"
import BoringAvatar from "boring-avatars"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { DeleteDialog } from "../_components/DeleteDialog"
import { GetWorkspacesWithId } from "@/api/workspacesAPI/api"
import { useEffect, useState } from "react"
import { mutate } from "swr"
import { toast } from "sonner"
import { ChangeVisibilityDialog } from "../_components/ChangeVisibilityDialog"



export default function Settings() {
    const params = useParams()
    const pathname = usePathname()
    const { workspace, isErrorWorkspace, isLoadingWorkspace } = GetWorkspacesWithId(params.workspaceId as string)
    const [workspaceName, setWorkspaceName] = useState<string>("")
    const [showPrompt, setShowPrompt] = useState<boolean>(false);

    useEffect(() => {
        if (workspace?.name) {
            setWorkspaceName(workspace.name);
        }
    }, [workspace?.name]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWorkspaceName(e.target.value);
        setShowPrompt(e.target.value !== workspace?.name);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateWorkplace/${params.workspaceId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: workspaceName,
                }),
            });
            if (response.ok) {
                toast.success("Workspace updated successfully");
                setShowPrompt(false);
                mutate(`${process.env.NEXT_PUBLIC_API_URL}/workplaceWithId/${params.workspaceId}`);
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (error) {
            console.error(error)
        }
    };
    const handleCancel = () => {
        setWorkspaceName(workspace?.name || "");
        setShowPrompt(false);
    };

    return (
        <div className="w-full h-screen p-5">
            <div className="h-[350px] p-5 m-auto">
                <h1 className="font-newCustom text-xl">Workplace Overview</h1>
                <div className="flex flex-row items-center justify-between">
                    <Avatar className="w-[150px] h-[150px] mt-3">
                        {/* <AvatarImage src={imageUrl as any} alt="avatar" className="object-contain" /> */}
                        <AvatarFallback>
                            <BoringAvatar
                                name={params.workspaceId?.toString()}
                                variant="marble"
                                colors={["#40223c", "#42988f", "#b1c592", "#f1ddba", "#fb718a"]}
                                style={{ width: "150px", height: "150px" }}
                            />
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label>Workplace Name</Label>
                        <Input
                            value={workspaceName}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <Separator orientation="horizontal" className="w-full mt-5" />
                <div className="flex flex-row w-full items-center justify-between mt-5">
                    <Label>
                        <p className="font-newCustom text-lg">
                            Can members invite others?
                        </p>
                        <p className="text-muted-foreground">
                            Allow members to invite others to this workplace.
                        </p>
                    </Label>
                    <Switch />
                </div>
                <Separator orientation="horizontal" className="w-full mt-5 " />
                <div className="h-[350px] mt-5">
                    <h1 className="font-newCustom text-xl">Danger Zone</h1>
                    <div className="w-full  border border-red-500 rounded-md mt-3 p-3">
                        <div className="p-2 flex flex-col gap-5">
                            <div className="flex flex-row w-full items-center justify-between">
                                <Label>
                                    <p className="font-newCustom text-base">Change Workplace Visibility</p>
                                    <p className="text-muted-foreground">
                                        This Workplace is currently {
                                            workspace?.private === true ? "private" : "public"
                                        }.
                                    </p>
                                </Label>
                                <ChangeVisibilityDialog workplaceId={Number(params.workspaceId)} workplaceName={workspace?.name as string} visibility={workspace?.private as boolean} />
                            </div>
                            <div className="flex flex-row w-full items-center justify-between">
                                <Label>
                                    <p className="font-newCustom text-base">Transfer ownership</p>
                                    <p className="text-muted-foreground">
                                        Transfer ownership of this workplace to another member.
                                    </p>
                                </Label>
                                <Button variant="destructive">Transfer</Button>
                            </div>
                            <div className="flex flex-row w-full items-center justify-between">
                                <Label>
                                    <p className="font-newCustom text-base">Delete this workplace</p>
                                    <p className="text-muted-foreground">
                                        Once you delete a workplace, there is no going back. Please be certain.
                                    </p>
                                </Label>
                                <DeleteDialog workplaceName={workspace?.name as string} workplaceId={Number(params.workspaceId)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showPrompt && (
                <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-white shadow-md p-4 rounded-md flex items-center gap-3">
                    <p>Do you want to save changes?</p>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="friendRequest" onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            )}
        </div>
    )
}