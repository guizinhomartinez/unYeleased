import {
    EllipsisVertical,
    MoveDown,
    MoveLeft,
    MoveRight,
    MoveUp,
    SpaceIcon,
} from "lucide-react";
import { Menu, PopoverMenuItems } from "../player";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Drawer as DrawerPrimitive } from "vaul";
import { Dialog as DialogPrimitive, VisuallyHidden } from "radix-ui";
import InfoCard from "./info-card";
import { cn } from "@/lib/utils";
import DownloadSingle from "./download-single";

type KeyboardThing = {
    letter: any;
    type?: string;
    letter2?: any;
    description: string;
}[];

const PopoverMenu = ({
    backgroundLore,
    linkToGenius,
    lyrics,
    source,
    text,
}: Menu) => {
    const keyboardThing: KeyboardThing = [
        {
            letter: "S",
            type: "text",
            description: "for hiding/showing the explanation menu",
        },
        {
            letter: "R",
            type: "text",
            description: "for repeating the song",
        },
        {
            letter: <MoveLeft size="16" />,
            description: "for going back 5 seconds",
        },
        {
            letter: <MoveRight size="16" />,
            description: "for skipping 5 seconds",
        },
        {
            letter: <MoveUp size="16" />,
            description: "for making the volume 10% louder",
        },
        {
            letter: <MoveDown size="16" />,
            description: "for making the volume 10% quieter",
        },
        {
            letter: <SpaceIcon />,
            description: "for pausing the song",
        },
    ];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className="rounded-full min-w-9"
                    size="icon"
                    variant="secondary"
                    id="lyrics-button"
                >
                    <EllipsisVertical />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="min-w-[200px] h-full bg-background rounded-xl p-2 flex flex-col w-full gap-2"
                side="top"
                align="end"
            >
                <Button
                    className="w-full rounded-xl"
                    variant="secondary"
                    id="share-button"
                    onClick={() => {
                        navigator.clipboard.writeText(location.href);
                        toast("Copied song link to clipboard");
                    }}
                >
                    {PopoverMenuItems[0].icon}
                    {PopoverMenuItems[0].text}
                </Button>
                <DownloadSingle
                    className="w-full rounded-xl"
                    source={source}
                    songVal={text}
                />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="w-full rounded-xl"
                            variant="secondary"
                        >
                            {PopoverMenuItems[1].icon}
                            {PopoverMenuItems[1].text}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-xl">
                        <DialogHeader>
                            <DialogTitle>Keyboard shortcuts</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-2">
                            {keyboardThing.map((thing, index) => (
                                <div
                                    className="flex gap-2 items-center"
                                    key={index}
                                >
                                    <kbd className="text-muted-foreground text-xs font-medium bg-secondary px-2 py-1 rounded-md border border-muted flex gap-2 items-center justify-center text-center">
                                        <p
                                            className={cn(
                                                thing.type === "text" &&
                                                    "text-base flex justify-center items-center text-center ml-2"
                                            )}
                                        >
                                            {thing.letter}
                                        </p>
                                        <p>{thing.letter2}</p>
                                    </kbd>
                                    {thing.description}
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
                <DrawerPrimitive.Root direction="right">
                    <DrawerPrimitive.Trigger asChild>
                        <Button
                            className="w-full rounded-xl"
                            size="icon"
                            variant="secondary"
                        >
                            {PopoverMenuItems[2].icon}
                            {PopoverMenuItems[2].text}
                        </Button>
                    </DrawerPrimitive.Trigger>
                    <DrawerPrimitive.Portal>
                        <DrawerPrimitive.Overlay className="fixed inset-0 bg-black/40 z-[500]" />
                        <DrawerPrimitive.Content
                            className="right-4 top-4 bottom-4 fixed z-[501] outline-none w-[30%] group"
                            // The gap between the edge of the screen and the DrawerPrimitive is 8px in this case.
                            style={
                                {
                                    "--initial-transform": "calc(100% + 24px)",
                                } as React.CSSProperties
                            }
                        >
                            <DialogPrimitive.Title asChild>
                                <VisuallyHidden.Root>
                                    Info card containing single explanation and
                                    lyrics
                                </VisuallyHidden.Root>
                            </DialogPrimitive.Title>
                            <div className="mt-4 h-1 w-12 rounded-full bg-muted-foreground absolute rotate-90 top-1/2 -translate-y-1/2 -left-[1.1em] cursor-grab group-active:cursor-grabbing" />
                            <div className="bg-primary-foreground size-full grow flex flex-col rounded-[16px]">
                                <div className="max-w-md mx-auto overflow-y-auto">
                                    <InfoCard
                                        backgroundLore={backgroundLore}
                                        linkToGenius={linkToGenius}
                                        lyrics={lyrics}
                                        shouldShowClose={false}
                                    />
                                </div>
                            </div>
                        </DrawerPrimitive.Content>
                    </DrawerPrimitive.Portal>
                </DrawerPrimitive.Root>
            </PopoverContent>
        </Popover>
    );
};

export default PopoverMenu;
