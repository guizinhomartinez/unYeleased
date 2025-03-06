import { useEffect, useState } from "react";
import { songControlsInterface } from "../songControls";
import Image from 'next/image'
import { Button } from "../ui/button";
import { MicVocal, Pause, Play, Repeat, Repeat1, Share, Shuffle, SkipBack, SkipForward, Volume, Volume1, Volume2, VolumeOff, VolumeX } from "lucide-react";
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
    handleSkipSong
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
        const shareButton = document.getElementById("share-button");
        const lyricsButton = document.getElementById("lyrics-button");
        const handleKey = (e: KeyboardEvent) => {
            e.preventDefault();
            switch (e.key) {
                case " ":
                    setIsPlaying(!isPlaying);
                    break;
                case "ArrowLeft":
                    songRef.current.currentTime -= 5;
                    break;
                case "ArrowRight":
                    songRef.current.currentTime += 5;
                    break;
                case "r":
                    setRepeat(repeat >= 2 ? 0 : repeat + 1);
                    break;
                case "s":
                    shareButton?.click();
                case "l":
                    lyricsButton?.click();
            }

            if (e.metaKey || e.ctrlKey) {
                if (e.key === "ArrowRight") {
                    handleSkipSong(false);
                } else if (e.key === "ArrowLeft") {
                    handleSkipSong(true);
                }
            }

            if (e.key === "ArrowUp") {
                setVolumeVal(volumeVal + 10);
            } else if (e.key === "ArrowDown") {
                setVolumeVal(volumeVal - 10);
            }

            if (e.shiftKey) {
                if (e.key === "ArrowUp") {
                    setVolumeVal(volumeVal + 5);
                } else if (e.key === "ArrowDown") {
                    setVolumeVal(volumeVal - 5);
                }
            }
        };

        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    })

    useEffect(() => {
        useEffectConst();
    }, []);

    useEffect(() => {
        useEffectConst();
    }, [handleSkipSong]);

    return (
        <>
            <div className="flex w-full justify-between items-center" onKeyDown={(e) => handleKeyDown}>
                <div className="flex items-center gap-3 select-none w-full">
                    <Image src={image} alt={image} width={80} height={80} className="rounded-lg" />
                    <div>
                        <div className="font-semibold text-md">
                            {songVal || "No Track Found"}
                        </div>
                        <div className="text-sm text-muted-foreground">{songCreator || "Unknown"}</div>
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
<<<<<<< HEAD
                        <Slider value={[sliderValue]} max={100} step={1} className="w-full [&>:last-child>span]:bg-primary" onValueChange={(value) => handleSliderChange(value, setSliderValue, songRef, setCurrentTimeVal)} />
=======
                        <Slider value={[sliderValue]} max={100} step={1} className={cn("w-full [&>:last-child>span]:bg-primary")} onValueChange={(value) => handleSliderChange(value, setSliderValue, songRef, setCurrentTimeVal)} />
>>>>>>> de944e2 (Backend update)
                        <div className="text-sm text-muted-foreground/80 sleect" onClick={() => setSongTimeType(songTimeType === 1 ? 0 : 1)}>{formattedSongTime(songTime, songTimeType, currentTimeVal)}</div>
                    </div>
                </div>

                <div className="flex items-center justify-end w-full select-none" onClick={(e) => e.stopPropagation()}>
                    <div className="items-center flex gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="rounded-full" variant='secondary' disabled={!songRef.current} id="share-button">
                                    <Share />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Share song</DialogTitle>
                                </DialogHeader>
                                <ShareSong />
                            </DialogContent>
                        </Dialog>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="rounded-full" variant='secondary' disabled={!songRef.current} id="lyrics-button">
                                    <MicVocal />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 h-full rounded-xl bg-background">
                                <Lyrics />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="h-6 w-2 border-l-2 border-primary/30 ml-4 mr-2" />
                    <div className="w-1/2 flex gap-3 items-center">
                        <Button onClick={() => muteSong(songRef)}
                            variant='outline' className="rounded-full bg-transparent px-4" size='icon' disabled={!songRef.current}>
                            <VolumeIcon size='18' songRef={songRef} volumeVal={volumeVal} repeat={repeat} />
                        </Button>
                        <VolumeSlider className="[&>:last-child>span]:bg-primary [&>:last-child>span]:border-transparent [&>:first-child>span]:opacity-70" value={[volumeVal]} onValueChange={setVolumeVal} />
                        <Label className="w-12 text-right">{volumeVal}%</Label>
                    </div>
                </div>
            </div>
        </>
    );
};