import { useEffect, useState } from "react";
import Image from 'next/image'
import { Button } from "../ui/button";
import { ArrowBigUp, ChevronDown, Command, EllipsisVertical, KeyboardIcon, Maximize2, Maximize2Icon, MicVocal, Minimize2Icon, MoveDown, MoveLeft, MoveRight, MoveUp, Share } from "lucide-react";
import { Slider } from "../ui/slider";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { cn, lyricsDelay } from "@/lib/utils";
import { Label } from "../ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import Lyrics from "./lyrics";
import VolumeSlider from "./volumeSlider";
import '@/app/CSS-files/song-controls.css';
import { formattedSongTime, formatTime, handleSliderChange, muteSong, VolumeIcon } from "@/lib/songControlsFunctions";
import { toast } from "sonner"
import { motion } from "motion/react";
import { songControlsInterface } from "@/lib/interfaces";
import PlayerButtons from "./playerButtons";
import { fetchAlbumLyrics } from "@/lib/fetching";
import { AutoMarquee } from "./autoMarquee";
import useAlbumAverageColor from "../getAverageColor";
import { DownloadMenu } from "./moreOptionsMenu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type KeyboardThing = {
    letter: any;
    type?: string;
    letter2?: any;
    description: string;
}[];

export const DesktopSongControls = ({
    songRef,
    songVal,
    isPlaying,
    setIsPlaying,
    volumeVal,
    setVolumeVal,
    image,
    repeat,
    setRepeat,
    songCreator,
    handleSkipSong,
    appearBar,
    setAppearBar,
    id,
    isLoading,
    isFullscreenMode,
    setIsFullscreenMode,
    showLyricsFullscreen,
    setShowLyricsFullscreen,
    shuffle,
    setShuffle
}: songControlsInterface) => {
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [songTimeType, setSongTimeType] = useState(0);
    const [isSynced, setIsSynced] = useState(true);
    const [lyricsStr, setLyricsStr] = useState("");
    const [fullscreenLyricsStr, setFullscreenLyricsStr] = useState("");
    const [hoveredVolumeIcon, setHoveredVolumeIcon] = useState(false);

    useEffect(() => {
        async function fetchLyrics() {
            const data = await fetchAlbumLyrics(id, songVal);
            setFullscreenLyricsStr(data || "LYRICS NOT FOUND");
        }
        fetchLyrics();
    }, [songVal, id])

    const handleKeyDown = useEffect(() => {
        const lyricsButton = document.getElementById("lyrics-button");
        const handleKey = (e: KeyboardEvent) => {
            switch (e.key) {
                case " ":
                    setIsPlaying(!isPlaying);
                    e.preventDefault();
                    break;
                case "ArrowLeft":
                    songRef.current.currentTime -= 5;
                    e.preventDefault();
                    break;
                case "ArrowRight":
                    songRef.current.currentTime += 5;
                    e.preventDefault();
                    break;
                case "r":
                    setRepeat(repeat >= 2 ? 0 : repeat + 1);
                    break;
                case "c":
                    navigator.clipboard.writeText(location.href);
                    toast("Copied song link to clipboard");
                    break;
                case "l":
                    lyricsButton?.click();
                    break;
                case "h":
                    setAppearBar(!appearBar);
                    break;
                case "f":
                    setIsFullscreenMode(!isFullscreenMode);
                    setFullscreen(!isFullscreenMode || false);
                    break;
                case "Escape":
                    setIsFullscreenMode(false);
                    setFullscreen(false);
                    break;
                case "s":
                    setShuffle(!shuffle);
                    break;
            }

            if (e.metaKey || e.ctrlKey) {
                if (e.key === "ArrowRight") {
                    e.preventDefault();
                    handleSkipSong(false);
                } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    handleSkipSong(true);
                }
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();
                setVolumeVal(volumeVal + 10);
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setVolumeVal(volumeVal - 10);
            }

            if (e.shiftKey) {
                if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setVolumeVal(volumeVal + 5);
                } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setVolumeVal(volumeVal - 5);
                }
            }
        };

        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    })

    // got this function from the beautiful lyrics spicetify extension
    // shoutout to the goat who made it
    const setFullscreen = (shouldBeFullscreen: boolean) => {
        const notFullscreen = (document.fullscreenElement === null);
        if (shouldBeFullscreen === notFullscreen) {
            if (shouldBeFullscreen) {
                document.documentElement.requestFullscreen();
                document.documentElement.style.scrollbarWidth = "none";
            } else {
                document.exitFullscreen();
                document.documentElement.style.scrollbarWidth = "";
            }
        }
    }

    const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setVolumeVal((prev: number) => {
            let newValue = prev + (event.deltaY > 0 ? -5 : 5);
            return Math.min(100, Math.max(0, newValue));
        });
    };

    useEffect(() => {
        const song = songRef.current;
        if (!song) return;

        const updateTime = () => {
            if (song.duration) {
                setSliderValue((song.currentTime / song.duration) * 100);
            }
            setCurrentTimeVal(song.currentTime);
        };

        song.addEventListener("timeupdate", updateTime);

        return () => {
            song.removeEventListener("timeupdate", updateTime);
        };
    }, [songVal, handleSkipSong]);

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
            letter: "S",
            type: "text",
            description: "for copying the song's URL to your clipboard"
        },
        {
            letter: "L",
            type: "text",
            description: "for seeing the song's lyrics"
        },
        {
            letter: <MoveLeft size='16' />,
            description: "for going back 5 seconds"
        },
        {
            letter: <MoveRight size='16' />,
            description: "for skipping 5 seconds"
        },
        {
            letter: <MoveUp size='16' />,
            description: "for making the volume 10% louder"
        },
        {
            letter: <MoveDown size='16' />,
            description: "for making the volume 10% quieter"
        },
        {
            letter: <Command size='16' />,
            letter2: <MoveLeft size='16' />,
            description: "for going back a song"
        },
        {
            letter: <Command size='16' />,
            letter2: <MoveRight size='16' />,
            description: "for skipping a song"
        },
        {
            letter: <ArrowBigUp size='20' />,
            letter2: <MoveUp size='16' />,
            description: "for making the volume 5% louder"
        },
        {
            letter: <ArrowBigUp size='20' />,
            letter2: <MoveDown size='16' />,
            description: "for making the volume 5% quieter"
        },
    ]

    const averageColors: string[] = useAlbumAverageColor(image);

    if (isFullscreenMode) {
        return (
            <div className="flex flex-col w-full justify-between items-center gap-4 pb-4 h-full relative before:absolute before:-top-5 before:-left-10 before:size-[150%] before:blur-md before:bg-[rgba(30,30,30,0.3)] before:-z-10" onKeyDown={(e) => handleKeyDown}>
                <div className="flex items-center justify-center w-full px-6">
                    <div className="text-sm text-muted-foreground/80 w-12">{formatTime(songRef.current ? songRef.current.currentTime : 0)}</div>
                    <Slider value={[sliderValue]} max={100} step={1} className="w-full [&>:last-child>span]:bg-primary [&>div]:transition-all [&>div]:duration-500" onValueChange={(value) => handleSliderChange(value, setSliderValue, songRef, setCurrentTimeVal)} />
                    <div className="text-sm text-muted-foreground/80 select-none cursor-pointer w-12 text-right" onClick={() => setSongTimeType(songTimeType === 1 ? 0 : 1)}>{formattedSongTime(songRef.current ? songRef.current.duration : 0, songTimeType, currentTimeVal)}</div>
                </div>
                <div className="flex w-full justify-between items-center px-4">
                    <div className="w-[34%]" />
                    <div className="flex justify-center gap-3 ml-2 items-center">
                        <PlayerButtons
                            shuffle={shuffle}
                            setShuffle={setShuffle}
                            handleSkipSong={handleSkipSong}
                            songVal={songVal}
                            isLoading={isLoading}
                            isPlaying={isPlaying}
                            setIsPlaying={setIsPlaying}
                            songRef={songRef}
                            repeat={repeat}
                            setRepeat={setRepeat}
                            biggerPadding={true}
                            buttonVariant={"link"}
                            extraButtons={true}
                        />
                    </div>
                    <div />
                    <div className="flex justify-center gap-3 w-[25%] items-center">
                        <Button className={cn("rounded-full p-6")} variant='link' onClick={() => setShowLyricsFullscreen(!showLyricsFullscreen)}>
                            <MicVocal size='36' />
                        </Button>
                        <Button
                            onClick={() => muteSong(songRef)}
                            variant='link'
                            className="rounded-full bg-transparent px-4"
                            size='icon'
                            disabled={!songRef.current}
                        >
                            <VolumeIcon size='18' songRef={songRef} volumeVal={volumeVal} repeat={repeat} />
                        </Button>
                        <VolumeSlider className="[&>:last-child>span]:bg-primary [&>:last-child>span]:border-transparent [&>:first-child>span]:opacity-70" value={[volumeVal]} onValueChange={setVolumeVal} onWheel={handleWheel} />
                        <Label className="w-12 text-right">{volumeVal}%</Label>
                        <Button className="rounded-full p-6" size='icon' variant='link' onClick={() => { setIsFullscreenMode(!isFullscreenMode); setFullscreen(!isFullscreenMode || false) }}>
                            {!isFullscreenMode ? <Maximize2Icon size='36' /> : <Minimize2Icon size='36' />}
                        </Button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <>
                <div
                    className="absolute top-0 left-0 w-full h-full opacity-15 z-10 rounded-l-xl"
                    style={{
                        background: `linear-gradient(90deg, rgb(${averageColors[0]}, ${averageColors[1]}, ${averageColors[2]}), transparent 75%)`
                    }}
                />
                <div className="flex w-full justify-between items-center z-20 px-1 md:gap-2 lg:gap-0" onKeyDown={(e) => handleKeyDown}>
                    {/* Little arrow to hide the bar */}
                    {!isFullscreenMode &&
                        <Button className={cn(
                            'absolute -top-4 right-0 bg-primary-foreground rounded-full duration-500 border-2 border-secondary z-50',
                            !appearBar && 'rotate-180 -top-14')}
                            size='icon'
                            variant='outline'
                            onClick={() => setAppearBar(!appearBar)}
                        >
                            <ChevronDown />
                        </Button>
                    }
                    {/* Left section */}
                    <div className="flex items-center gap-3 select-none lg:w-full md:w-[30%]">
                        <Image src={image} alt={image} width={80} height={80} className="rounded-lg" />
                        <div className="flex gap-5 items-center">
                            <div className="md:max-w-[40%] lg:max-w-full w-full">
                                <AutoMarquee text={songVal || "No Track Found"} className="font-semibold text-md" number={0} />
                                <AutoMarquee text={songCreator || "Unknown"} className="text-sm text-muted-foreground" number={0} />
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button className="rounded-full min-w-9" size='icon' variant='secondary' disabled={!songRef.current}>
                                        <EllipsisVertical />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="min-w-[200px] h-full bg-background rounded-2xl p-2 flex flex-col w-full gap-1" side='top'>
                                    <Button className="w-full rounded-xl" variant='secondary' disabled={!songRef.current} id="share-button" onClick={() => { navigator.clipboard.writeText(location.href); toast("Copied song link to clipboard"); }}>
                                        <Share />
                                        Share song
                                    </Button>
                                    <DownloadMenu id={id} songVal={songVal} className="rounded-xl w-full h-9" />
                                    <ShortcutsMenu keyboardThing={keyboardThing} songRef={songRef} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    {/* Middle section */}
                    <div className="flex flex-col justify-center gap-3 lg:w-full min-w-0 md:w-[35%]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center gap-3 ml-2 items-center">
                            <PlayerButtons
                                shuffle={shuffle}
                                setShuffle={setShuffle}
                                handleSkipSong={handleSkipSong}
                                songVal={songVal}
                                isLoading={isLoading}
                                isPlaying={isPlaying}
                                setIsPlaying={setIsPlaying}
                                songRef={songRef}
                                repeat={repeat}
                                setRepeat={setRepeat}
                                biggerPadding={false}
                                buttonVariant={"ghost"}
                                extraButtons={true}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-muted-foreground/80 w-12 text-right">{formatTime(songRef.current ? songRef.current.currentTime : 0)}</div>
                            <Slider value={[sliderValue]} max={100} step={1} className="w-full [&>:last-child>span]:bg-primary" onValueChange={(value) => handleSliderChange(value, setSliderValue, songRef, setCurrentTimeVal)} />
                            <div className="text-sm text-muted-foreground/80 select-none cursor-pointer w-12" onClick={() => setSongTimeType(songTimeType === 1 ? 0 : 1)}>{formattedSongTime(songRef.current ? songRef.current.duration : 0, songTimeType, currentTimeVal)}</div>
                        </div>
                    </div>
                    {/* Right section */}
                    <div className="flex items-center justify-end select-none gap-2 lg:w-full md:w-[25%]" onClick={(e) => e.stopPropagation()}>
                        <div className="items-center flex gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button className={cn("rounded-full", fullscreenLyricsStr === "LYRICS NOT FOUND" && "opacity-50 cursor-not-allowed")} size='icon' variant='secondary' disabled={!songRef.current || fullscreenLyricsStr === "LYRICS NOT FOUND"} id="lyrics-button">
                                        <MicVocal />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[450px] max-h-[80vh] overflow-hidden mr-20 h-full rounded-2xl p-2 flex justify-center group" side='top'>
                                    <div className="relative rounded-lg size-full overflow-hidden">
                                        <Image src={image} alt={image} width={0} height={0} className="absolute inset-0 bg-cover bg-center opacity-10 blur-2xl size-full" />
                                        <Lyrics currentTimeVal={Math.floor(currentTimeVal * lyricsDelay)} id={id} songVal={songVal} isSynced={!isSynced} isFullscreenMode={false} />
                                        <div className="absolute flex justify-center items-center bottom-4 left-1/2 -translate-x-1/2 rounded-full group-hover:opacity-90 opacity-0 transition-opacity duration-500 bg-primary-foreground py-1 w-[60%] px-2">
                                            <div className="rounded-full flex justify-center items-center w-full relative">
                                                <div onClick={() => setIsSynced(true)} className={cn("w-full text-center transition-colors duration-500 rounded-full cursor-default select-none", !isSynced && "cursor-pointer")}>
                                                    Synced
                                                </div>
                                                <div onClick={() => setIsSynced(false)} className={cn("w-full text-center transition-colors duration-500 rounded-full cursor-default select-none", isSynced && "cursor-pointer")}>
                                                    Normal
                                                </div>
                                            </div>
                                            <motion.span
                                                className="absolute top-0 bg-primary mix-blend-difference w-1/2 h-full"
                                                animate={{
                                                    left: isSynced ? "0%" : "50%",
                                                }}
                                                transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
                                                style={{ borderRadius: 9999 }}
                                            />
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex gap-2 items-center h-full">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant='secondary'
                                        className="rounded-full py-5 pr-0 cursor-pointer"
                                        disabled={!songRef.current}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            muteSong(songRef);
                                        }}
                                    >
                                        <VolumeIcon size='18' songRef={songRef} volumeVal={volumeVal || 100} repeat={repeat} />
                                        <Label className="w-12 text-left cursor-pointer">{volumeVal}%</Label>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="rounded-2xl max-w-[80%]">
                                    <div className="flex items-center gap-2 justify-center">
                                        <TooltipProvider>
                                            <Tooltip open={hoveredVolumeIcon}>
                                                <TooltipTrigger>
                                                    <Button onMouseLeave={() => setTimeout(() => setHoveredVolumeIcon(false), 150)} onMouseOver={() => setTimeout(() => setHoveredVolumeIcon(true), 250)} onClick={() => muteSong(songRef)} variant='ghost' className="rounded-full bg-transparent px-4" size='icon' disabled={!songRef.current}>
                                                        <VolumeIcon size='18' songRef={songRef} volumeVal={volumeVal || 100} repeat={repeat} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent className="rounded-xl border">
                                                    <p>{songRef.current ? (!songRef.current.muted ? "Mute" : "Unmute") : "Choose a song first"}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <VolumeSlider className="[&>:last-child>span]:bg-primary [&>:last-child>span]:border-transparent [&>:first-child>span]:opacity-70" value={[volumeVal]} onValueChange={setVolumeVal} onWheel={handleWheel} />
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <div className="h-7 w-2 border-l border-primary/30 ml-2" />
                            <Button
                                variant='outline'
                                size='icon'
                                className="p-5 rounded-full bg-transparent"
                                onClick={() => {
                                    setIsFullscreenMode(!isFullscreenMode);
                                    setFullscreen(!isFullscreenMode || false);
                                }}>
                                {!isFullscreenMode ? <Maximize2 /> : <Minimize2Icon />}
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
};

const ShortcutsMenu = (props: { keyboardThing: KeyboardThing, songRef: any }) => {
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
                                    <kbd className="font-mono text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md border border-muted min-w-[2rem] text-center">
                                        {thing.letter}
                                    </kbd>
                                )}
                                {thing.letter2 && (
                                    <kbd className="font-mono text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md border border-muted min-w-[2rem] text-center">
                                        {thing.letter2}
                                    </kbd>
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