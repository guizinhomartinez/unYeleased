import { songControlsInterface } from "@/lib/interfaces";
import Image from 'next/image';
import { AutoMarquee } from "../../autoMarquee";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Command, EllipsisVertical, KeyboardIcon, MoveDown, MoveLeft, MoveRight, MoveUp, Share } from "lucide-react";
import { DownloadMenu } from "../../moreOptionsMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { RefObject } from "react";
import { Kbd } from "@/components/ui/kbd";

type KeyboardThing = {
    letter: any;
    type?: string;
    letter2?: any;
    description: string;
}[];

const keyboardThing: KeyboardThing = [
    {
        letter: "F",
        type: "text",
        description: "for entering/exiting into fullscreen mode"
    },
    {
        letter: "H",
        type: "text",
        description: "for hiding/showing the music bar"
    },
    {
        letter: "R",
        type: "text",
        description: "has 3 states: none, repeat album or repeat song"
    },
    {
        letter: "C",
        type: "text",
        description: "for copying the song's URL to your clipboard"
    },
    {
        letter: "S",
        type: "text",
        description: "for enabling shuffle"
    },
    {
        letter: "L",
        type: "text",
        description: "for seeing the song's lyrics"
    },
    {
        letter: <ArrowLeft size='16' />,
        description: "for going back 5 seconds"
    },
    {
        letter: <ArrowRight size='16' />,
        description: "for skipping 5 seconds"
    },
    {
        letter: <ArrowUp size='16' />,
        description: "for making the volume 10% louder"
    },
    {
        letter: <ArrowDown size='16' />,
        description: "for making the volume 10% quieter"
    },
    {
        letter: <Command size='16' />,
        letter2: <ArrowLeft size='16' />,
        description: "for going back a song"
    },
    {
        letter: <Command size='16' />,
        letter2: <ArrowRight size='16' />,
        description: "for skipping a song"
    },
    {
        letter: <ArrowBigUp size='20' />,
        letter2: <ArrowUp size='16' />,
        description: "for making the volume 5% louder"
    },
    {
        letter: <ArrowBigUp size='20' />,
        letter2: <ArrowDown size='16' />,
        description: "for making the volume 5% quieter"
    },
]

export default function LeftSectionSongControls({ image, songCreator, songRef, songVal, id }: songControlsInterface) {
    return (
        <div className="flex items-center gap-4 select-none overflow-hidden md:!max-w-[25%] lg:!max-w-[73%] w-full">
            <Image src={image} alt={image} width={80} height={80} className="rounded-lg" />
            <div className="flex gap-5 items-center md:!max-w-[40%] lg:!max-w-[73%] overflow-hidden">
                <div className="md:!max-w-[40%] lg:!max-w-[73%] w-full">
                    <AutoMarquee text={songVal || "No Track Found"} className="font-semibold text-md" number={0} />
                    <AutoMarquee text={songCreator || "Unknown"} className="text-sm text-muted-foreground" number={0} />
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="rounded-full min-w-9 bg-primary/10 hover:bg-primary/5" size='icon' variant='secondary' disabled={!songRef.current}>
                            <EllipsisVertical />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="min-w-[200px] h-full bg-background rounded-2xl p-2 flex flex-col w-full gap-1" side='top'>
                        <Button
                            className="w-full rounded-xl"
                            variant='secondary'
                            disabled={!songRef.current}
                            onClick={() => {
                                navigator.clipboard.writeText(location.href);
                                toast("Copied song link to clipboard");
                            }}>
                            <Share />
                            Share song
                        </Button>
                        <DownloadMenu id={id} songVal={songVal} className="rounded-xl w-full h-9" />
                        <ShortcutsMenu keyboardThing={keyboardThing} songRef={songRef} />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

const ShortcutsMenu = (props: { keyboardThing: KeyboardThing, songRef: RefObject<HTMLAudioElement | null> }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full rounded-xl" variant='secondary' disabled={!props.songRef.current} id="share-button">
                    <KeyboardIcon />
                    Shortcuts
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90%] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Keyboard shortcuts</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2 relative">
                    {props.keyboardThing.map((thing, index) => (
                        <div
                            className="flex items-center gap-2"
                            key={index}
                        >
                            <div className="flex items-center gap-1">
                                {thing.letter && (
                                    <Kbd>
                                        {thing.letter}
                                    </Kbd>
                                )}
                                {thing.letter2 && (
                                    <Kbd>
                                        {thing.letter2}
                                    </Kbd>
                                )}
                            </div>
                            <span className="text-sm">{thing.description}</span>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}