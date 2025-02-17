"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import AvatarEditor, { type Position } from "react-avatar-editor";
import { ChangeEvent, useRef, useState } from "react";
import Dropzone from 'react-dropzone'
import { Trash2 } from "lucide-react";
import { mutate } from "swr";
import { toast } from "sonner";


type State = {
    image: string | File
    allowZoomOut: boolean
    position: Position
    scale: number
    rotate: number
    borderRadius: number
    preview?: {
        img: string
        rect: {
            x: number
            y: number
            width: number
            height: number
        }
        scale: number
        width: number
        height: number
        borderRadius: number
    }
    width: number
    height: number
    disableCanvasRotation: boolean
    isTransparent: boolean
    backgroundColor?: string
    showGrid: boolean
}

export function EditAvatarDialog({ openAvatarDialog, setOpenAvatarDialog, imageUrl, userID }: { openAvatarDialog: boolean, setOpenAvatarDialog: (open: boolean) => void, imageUrl: string, userID: string }) {
    const editor = useRef<AvatarEditor>(null)
    const [state, setState] = useState<State>({
        image: imageUrl,
        allowZoomOut: false,
        position: { x: 0.5, y: 0.5 },
        scale: 1,
        rotate: 0,
        borderRadius: 100,
        preview: undefined,
        width: 150,
        height: 150,
        disableCanvasRotation: false,
        isTransparent: false,
        backgroundColor: undefined,
        showGrid: false,
    })
    const handleNewImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setState({ ...state, image: e.target.files[0] })
        }
    }
    const handleSave = async () => {
        const img = editor.current?.getImageScaledToCanvas().toDataURL();
        const rect = editor.current?.getCroppingRect();

        if (img && rect) {
            const originalWidth = state.width;
            const originalHeight = state.height;

            const croppedWidth = rect.width * originalWidth;
            const croppedHeight = rect.height * originalHeight;
            const croppedX = rect.x * originalWidth;
            const croppedY = rect.y * originalHeight;

            const formData = new FormData();
            formData.append('avatar', img);  // img: base64 encoded image
            formData.append('croppedWidth', croppedWidth.toString());
            formData.append('croppedHeight', croppedHeight.toString());
            formData.append('croppedX', croppedX.toString());
            formData.append('croppedY', croppedY.toString());

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploadAvatar/${userID}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Avatar saved successfully');
                mutate(`${process.env.NEXT_PUBLIC_API_URL}/getAvatar/${userID}`)
                setOpenAvatarDialog(false)
                toast.success('Avatar saved successfully')
            }
            else {
                console.log('Avatar failed to save');
            }
        }
    };

    const handleDelete = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteAvatar/${userID}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log('Avatar deleted successfully');
            mutate(`${process.env.NEXT_PUBLIC_API_URL}/getAvatar/${userID}`)
            setOpenAvatarDialog(false)
            setState({ ...state, image: "" })
            toast.success('Avatar deleted successfully')
        }
        else {
            console.log('Avatar failed to delete');
        }
    }

    const handleScale = (e: ChangeEvent<HTMLInputElement>) => {
        const scale = parseFloat(e.target.value)
        setState({ ...state, scale })
    }

    const handlePositionChange = (position: Position) => {
        setState({ ...state, position })
    }

    return (
        <Dialog onOpenChange={setOpenAvatarDialog} open={openAvatarDialog}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit your avatar</DialogTitle>
                    <DialogDescription>
                        Dont have an image? Drag and drop an image to upload an image.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Dropzone
                            onDrop={([image]) => setState({ ...state, image })}
                            noClick
                            multiple={false}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps()} className="preview">
                                    <AvatarEditor
                                        ref={editor}
                                        scale={state.scale}
                                        width={state.width}
                                        height={state.height}
                                        position={state.position}
                                        onPositionChange={handlePositionChange}
                                        rotate={state.rotate}
                                        borderRadius={state.width / (100 / state.borderRadius)}
                                        backgroundColor={state.backgroundColor}
                                        image={state.image}
                                        disableCanvasRotation={state.disableCanvasRotation}
                                    />
                                    <input
                                        name="newImage"
                                        type="file"
                                        onChange={handleNewImage}
                                        {...getInputProps()}
                                    />
                                </div>
                            )}
                        </Dropzone>

                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="scale" className="text-sm">Scale</label>
                        <input
                            name="scale"
                            type="range"
                            onChange={handleScale}
                            min={state.allowZoomOut ? '0.1' : '1'}
                            max="2"
                            step="0.01"
                            defaultValue="1"
                        />
                        <span>{state.scale}</span>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSave}>Save changes</Button>
                    <Button type="button" variant="destructive" onClick={handleDelete}><Trash2 className="w-4 h-4" /></Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}
