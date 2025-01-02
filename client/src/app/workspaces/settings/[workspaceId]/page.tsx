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



export default function Settings() {
    const params = useParams()
    const pathname = usePathname()
    const { workspace, isErrorWorkspace, isLoadingWorkspace } = GetWorkspacesWithId(params.workspaceId as string)
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
                        <Input id="name" />
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
                                        This Workplace is currently private.
                                    </p>
                                </Label>
                                <Button variant="destructive">Make Public</Button>
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
        </div>
    )
}