import {
    DesktopSongControlsInterface,
    KeyboardThing,
    songControlsInterface,
} from "@/lib/interfaces";
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
    Share,
    SpaceIcon,
} from "lucide-react";
import { DownloadMenu } from "../../moreOptionsMenu";
import { toast } from "sonner";
import ShortcutsMenu from "@/components/ui-sections/shortcuts-menu";

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
    searchBarRef,
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
                            searchBarRef={searchBarRef}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}