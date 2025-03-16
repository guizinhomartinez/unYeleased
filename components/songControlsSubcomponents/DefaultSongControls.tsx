import { useEffect, useState } from "react";
import { songControlsInterface } from "../songControls";
import Image from 'next/image'
import { Button } from "../ui/button";
import { ArrowBigUp, ChevronDown, Command, EllipsisVertical, KeyboardIcon, MicVocal, MoveDown, MoveLeft, MoveRight, MoveUp, Pause, Play, Repeat, Repeat1, Share, Shuffle, SkipBack, SkipForward, Volume, Volume1, Volume2, VolumeOff, VolumeX } from "lucide-react";
import { Slider } from "../ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import Lyrics from "./lyrics";
import ShareSong from "../shareSong";
import VolumeSlider from "./volumeSlider";
import '@public/CSS/song-controls.css';
import { formattedSongTime, formatTime, handleSliderChange, muteSong, RepeatIcon, VolumeIcon } from "@/lib/songControlsFunctions";
import { toast } from "sonner"

type KeyboardThing = {
    letter: any;
    type?: string;
    letter2?: any;
    description: string;
}[];

export const DefaultSongControls = ({
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
    id
}: songControlsInterface) => {
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [songTime, setSongtime] = useState(0);
    const [songTimeType, setSongTimeType] = useState(0);

    const useEffectConst = () => {
        const song = songRef.current;
        if (!song) return;

        const updateTime = () => {
            if (song.duration) {
                setSliderValue((song.currentTime / song.duration) * 100);
            }
            setCurrentTimeVal(song.currentTime);
        };

        setSongtime(song.duration);

        song.addEventListener("timeupdate", updateTime);

        return () => {
            song.removeEventListener("timeupdate", updateTime);
        };
    }

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
                case "s":
                    navigator.clipboard.writeText(location.href); toast("Copied song link to clipboard");
                case "l":
                    lyricsButton?.click();
                case "h":
                    setAppearBar(!appearBar);
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

    const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setVolumeVal((prev: number) => {
            let newValue = prev + (event.deltaY > 0 ? -5 : 5);
            return Math.min(100, Math.max(0, newValue));
        });
    };

    useEffect(() => {
        useEffectConst();
    }, []);

    useEffect(() => {
        useEffectConst();
    }, [handleSkipSong]);

    const keyboardThing: KeyboardThing = [
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

    return (
        <>
            <div className="flex w-full justify-between items-center" onKeyDown={(e) => handleKeyDown}>
                <Button className={cn('absolute -top-4 right-0 bg-primary-foreground rounded-full duration-500 border-2 border-secondary', !appearBar && 'rotate-180 -top-14')} size='icon' variant='outline' onClick={() => setAppearBar(!appearBar)}><ChevronDown /></Button>
                <div className="flex items-center gap-3 select-none w-full">
                    <Image src={image} alt={image} width={80} height={80} className="rounded-lg" />
                    <div>
                        <p className="font-semibold text-md" title={songVal || "No Track Found"}>
                            {songVal || "No Track Found"}
                        </p>
                        <p className="text-sm text-muted-foreground" title={songCreator || "Unknown"}>
                            {songCreator || "Unknown"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-3 w-full" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center gap-3 ml-2 items-center">
                        <Button
                            size="icon"
                            className={cn('p-5 rounded-full bg-transparent focus:bg-transparent', 'opacity-50 cursor-not-allowed')}
                            variant="ghost"
                            onClick={() => handleSkipSong(true)}
                            disabled
                        >
                            <Shuffle />
                        </Button>
                        <Button
                            size="icon"
                            className={`p-5 rounded-full ${songVal !== "" ? "" : "opacity-50 cursor-not-allowed"}`}
                            variant="ghost"
                            onClick={() => handleSkipSong(true)}
                        >
                            <SkipBack />
                        </Button>
                        <Button
                            className={`p-5 rounded-full ${songVal !== "" ? "" : "opacity-50 cursor-not-allowed"}`}
                            size="icon"
                            onClick={() => setIsPlaying(songVal !== "" && !isPlaying)}
                        >
                            {!isPlaying ? <Play /> : <Pause />}
                        </Button>
                        <Button
                            size="icon"
                            className={`p-5 rounded-full ${songVal !== "" ? "" : "opacity-50 cursor-not-allowed"}`}
                            variant="ghost"
                            onClick={() => handleSkipSong(false)}
                        >
                            <SkipForward />
                        </Button>
                        <Button
                            size="icon"
                            className={cn('p-5 rounded-full bg-transparent focus:bg-transparent', repeat === 0 && 'opacity-50')}
                            variant="ghost"
                            onClick={() => setRepeat(repeat >= 2 ? 0 : repeat + 1)}
                        >
                            <RepeatIcon repeat={repeat} />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground/80 w-12 text-right">{formatTime(currentTimeVal)}</div>
                        <Slider value={[sliderValue]} max={100} step={1} className="w-full [&>:last-child>span]:bg-primary" onValueChange={(value) => handleSliderChange(value, setSliderValue, songRef, setCurrentTimeVal)} />
                        <div className="text-sm text-muted-foreground/80 select-none cursor-pointer w-12" onClick={() => setSongTimeType(songTimeType === 1 ? 0 : 1)}>{formattedSongTime(songTime, songTimeType, currentTimeVal)}</div>
                    </div>
                </div>

                <div className="flex items-center justify-end w-full select-none" onClick={(e) => e.stopPropagation()}>
                    <div className="items-center flex gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="rounded-full" size='icon' variant='secondary' disabled={!songRef.current} id="lyrics-button">
                                    <EllipsisVertical />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="min-w-[200px] h-full bg-background rounded-xl p-2 flex flex-col w-full gap-2" side='top'>
                                <Button className="w-full rounded-xl" variant='secondary' disabled={!songRef.current} id="share-button" onClick={() => { navigator.clipboard.writeText(location.href); toast("Copied song link to clipboard"); }}>
                                    <Share />
                                    Share song
                                </Button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-full rounded-xl" variant='secondary' disabled={!songRef.current} id="share-button">
                                            <KeyboardIcon />
                                            Shortcuts
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Keyboard shortcuts</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-2">
                                            {keyboardThing.map((thing, index) => (
                                                <div className="flex gap-2 items-center" key={index}>
                                                    <kbd className="text-muted-foreground text-xs font-medium bg-secondary px-2 py-1 rounded-md border border-muted flex gap-2 items-center justify-center text-center">
                                                        <p className={cn(thing.type === "text" && "text-base flex justify-center items-center text-center ml-2")}>
                                                            {thing.letter}
                                                        </p>
                                                        <p>
                                                            {thing.letter2}
                                                        </p>
                                                    </kbd>
                                                    {thing.description}
                                                </div>
                                            ))}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </PopoverContent>
                        </Popover>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="rounded-full" size='icon' variant='secondary' disabled={!songRef.current} id="lyrics-button">
                                    <MicVocal />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="min-w-[350px] h-full rounded-xl bg-background p-2" side='top'>
                                <Lyrics currentTimeVal={currentTimeVal} id={id} songVal={songVal} />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="h-6 w-2 border-l-2 border-primary/30 ml-4 mr-2" />
                    <div className="w-1/2 flex gap-3 items-center">
                        <Button onClick={() => muteSong(songRef)}
                            variant='outline' className="rounded-full bg-transparent px-4" size='icon' disabled={!songRef.current}>
                            <VolumeIcon size='18' songRef={songRef} volumeVal={volumeVal} repeat={repeat} />
                        </Button>
                        <VolumeSlider className="[&>:last-child>span]:bg-primary [&>:last-child>span]:border-transparent [&>:first-child>span]:opacity-70" value={[volumeVal]} onValueChange={setVolumeVal} onWheel={handleWheel} />
                        <Label className="w-12 text-right">{volumeVal}%</Label>
                    </div>
                </div>
            </div>
        </>
    );
};