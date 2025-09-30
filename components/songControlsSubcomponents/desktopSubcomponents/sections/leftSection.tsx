import { DesktopSongControlsInterface, songControlsInterface } from "@/lib/interfaces";
import Image from "next/image";
import { AutoMarquee } from "../../autoMarquee";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    ArrowBigUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    Command,
    EllipsisVertical,
    KeyboardIcon,
    Share,
    SpaceIcon,
} from "lucide-react";
import { DownloadMenu } from "../../moreOptionsMenu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { RefObject, useMemo, useState } from "react";
import { Kbd } from "@/components/ui/kbd";
import { VisuallyHidden } from "radix-ui";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useDebounce } from "react-use";

type KeyboardThing = {
    letter: any;
    type?: string;
    letter2?: any;
    description: string;
}[];

const keyboardThing: KeyboardThing = [
    {
        letter: <SpaceIcon />,
        description: "play/pause song",
    },
    {
        letter: <Command size="16" />,
        letter2: <ArrowLeft size="16" />,
        description: "rewind a song",
    },
    {
        letter: <Command size="16" />,
        letter2: <ArrowRight size="16" />,
        description: "skip a song",
    },
    {
        letter: <ArrowLeft size="16" />,
        description: "rewind 5 seconds",
    },
    {
        letter: <ArrowRight size="16" />,
        description: "skip 5 seonds forward",
    },
    {
        letter: <ArrowUp size="16" />,
        description: "increase volume by 10%",
    },
    {
        letter: <ArrowDown size="16" />,
        description: "decrease volume by 10%",
    },
    {
        letter: <ArrowBigUp size="20" />,
        letter2: <ArrowUp size="16" />,
        description: "increase volume by 5%",
    },
    {
        letter: <ArrowBigUp size="20" />,
        letter2: <ArrowDown size="16" />,
        description: "decrease volume by 5%",
    },
    {
        letter: "F",
        type: "text",
        description: "enter/exit fullscreen mode",
    },
    {
        letter: "H",
        type: "text",
        description: "hide/show music player",
    },
    {
        letter: "R",
        type: "text",
        description: "repeat song/album",
    },
    {
        letter: "S",
        type: "text",
        description: "shuffle",
    },
    {
        letter: "L",
        type: "text",
        description: "toggle song lyrics",
    },
    {
        letter: "C",
        type: "text",
        description: "copy song's URL to clipboard",
    },
];

export default function LeftSectionSongControls({
    image,
    songCreator,
    songRef,
    songVal,
    id,
    searchBarRef
}: songControlsInterface & DesktopSongControlsInterface) {
    return (
        <div className="flex items-center gap-4 select-none overflow-hidden md:!max-w-[25%] lg:!max-w-[73%] w-full">
            <Image
                src={image}
                alt={image}
                width={80}
                height={80}
                className="rounded-lg"
            />
            <div className="flex gap-5 items-center md:!max-w-[40%] lg:!max-w-[73%] overflow-hidden">
                <div className="md:!max-w-[40%] lg:!max-w-[73%] w-full">
                    <AutoMarquee
                        text={songVal || "No Track Found"}
                        className="font-semibold text-md"
                        number={0}
                    />
                    <AutoMarquee
                        text={songCreator || "Unknown"}
                        className="text-sm text-muted-foreground"
                        number={0}
                    />
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            className="rounded-full min-w-9 bg-primary/10 hover:bg-primary/5"
                            size="icon"
                            variant="secondary"
                            disabled={!songRef.current}
                        >
                            <EllipsisVertical />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="min-w-[200px] h-full bg-background rounded-2xl p-2 flex flex-col w-full gap-1"
                        side="top"
                    >
                        <Button
                            className="w-full rounded-xl"
                            variant="secondary"
                            disabled={!songRef.current}
                            onClick={() => {
                                navigator.clipboard.writeText(location.href);
                                toast("Copied song link to clipboard");
                            }}
                        >
                            <Share />
                            Share song
                        </Button>
                        <DownloadMenu
                            id={id}
                            songVal={songVal}
                            className="rounded-xl w-full h-9"
                        />
                        <ShortcutsMenu
                            keyboardThing={keyboardThing}
                            songRef={songRef}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}

const ShortcutsMenu = (props: {
    keyboardThing: KeyboardThing;
    songRef: RefObject<HTMLAudioElement | null>;
    searchBarRef: React.RefObject<HTMLInputElement | null>;
}) => {
    const [searchValue, setSearchValue] = useState("");

    const filteredKeyboardThing = useMemo(() => {
        return props.keyboardThing.filter((e) =>
            e.description.includes(searchValue)
        );
    }, [props.keyboardThing, searchValue]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="w-full rounded-xl"
                    variant="secondary"
                    disabled={!props.songRef.current}
                    id="share-button"
                >
                    <KeyboardIcon />
                    Shortcuts
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90%] overflow-auto p-6">
                <DialogPrimitive.Title asChild>
                    <VisuallyHidden.Root>Album explanation</VisuallyHidden.Root>
                </DialogPrimitive.Title>
                <div className="flex flex-col gap-3 relative">
                    <h1 className="text-xl font-semibold leading-none tracking-tight text-center">
                        Keyboard Shortcuts
                    </h1>
                    <div className="-mx-4 p-4 pb-2 rounded-b-xl shadow-xl bg-background">
                        <Input
                            type="search"
                            className="w-full p-4 rounded-xl"
                            placeholder="Search shortcuts..."
                            id="shortcuts-search"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            ref={props.searchBarRef}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        {filteredKeyboardThing.map((thing, index) => (
                            <div
                                className="flex items-center justify-between gap-2 bg-secondary/50 px-3 py-2.5 rounded-xl"
                                key={thing.description + index}
                            >
                                <span className="text-sm">
                                    {capitalizeFirstLetter(thing.description)}
                                </span>
                                <div className="flex items-center gap-1">
                                    {thing.letter && <Kbd>{thing.letter}</Kbd>}
                                    {thing.letter2 && (
                                        <Kbd className="shadow-xl">
                                            {thing.letter2}
                                        </Kbd>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
