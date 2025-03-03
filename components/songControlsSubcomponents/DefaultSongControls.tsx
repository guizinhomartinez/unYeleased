import { useEffect, useState } from "react";
import { songControlsInterface } from "../songControls";
import Image from 'next/image'
import { Button } from "../ui/button";
import { MicVocal, Pause, Play, Share, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "../ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import Lyrics from "./lyrics";
import ShareSong from "../shareSong";
import VolumeSlider from "./volumeSlider";
import '@public/CSS/song-controls.css';

export const DefaultSongControls = ({
    songRef,
    songVal,
    isPlaying,
    setIsPlaying,
    volumeVal,
    setVolumeVal,
    image,
    songCreator,
    handleSkipSong
}: songControlsInterface) => {
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [songTime, setSongtime] = useState(0);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    };

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

    useEffect(() => {
        useEffectConst();
    }, []);

    useEffect(() => {
        useEffectConst();
    }, [handleSkipSong]);

    const handleSliderChange = (value: number[]) => {
        const newValue = value[0];
        setSliderValue(newValue)
        if (songRef.current) {
            const newTime = (newValue / 100) * songRef.current.duration;
            songRef.current.currentTime = newTime;
            setCurrentTimeVal(newTime);
        }
    }

    return (
        <>
            <div className="flex w-full justify-between items-center">
                <div className="flex items-center gap-3 select-none w-full">
                    <Image src={image} alt={image} width={80} height={80} className="rounded-lg" />
                    <div>
                        <div className="font-semibold text-md">
                            {songVal || "No Track Found"}
                        </div>
                        <div className="text-sm text-muted-foreground">{songCreator || "Unknown"}</div>
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center gap-2 ml-2">
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
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground/80 w-12 text-right">{formatTime(currentTimeVal)}</div>
                        <Slider value={[sliderValue]} max={100} step={1} className={cn("w-full [&>:last-child>span]:bg-primary")} onValueChange={handleSliderChange} />
                        <div className="text-sm text-muted-foreground/80">{isNaN(songTime) ? '0:00' : formatTime(songTime)}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3 justify-end w-full select-none" onClick={(e) => e.stopPropagation()}>
                    <div className="items-center flex gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                {songRef.current ?
                                    <Button className="rounded-full" variant='secondary' >
                                        <Share />
                                    </Button> :
                                    <Button className="rounded-full cursor-not-allowed" variant='secondary' disabled>
                                        <Share />
                                    </Button>
                                }
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
                                {songRef.current ?
                                    <Button className="rounded-full" variant='secondary'>
                                        <MicVocal />
                                    </Button> :
                                    <Button className="rounded-full cursor-not-allowed" variant='secondary' disabled>
                                        <MicVocal />
                                    </Button>}
                            </PopoverTrigger>
                            <PopoverContent className="w-48 h-full rounded-xl bg-background">
                                <Lyrics />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="w-1/2 flex gap-3 items-center">
                        <VolumeSlider className="[&>:last-child>span]:bg-primary [&>:last-child>span]:border-transparent [&>:first-child>span]:opacity-70" value={[volumeVal]} onValueChange={setVolumeVal} />
                        <Label className="w-12 text-right">{volumeVal}%</Label>
                    </div>
                </div>
            </div>
        </>
    );
};