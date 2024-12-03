import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell } from "lucide-react";


export default function NotificationPopover() {
    return (
        <Popover>
            <PopoverTrigger asChild className="flex items-center gap-2">
                <Button variant="ghost" size="icon"> <Bell size={12} className="text-white" /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                            Set the dimensions for the layer.
                        </p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}