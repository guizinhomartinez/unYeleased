import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import Image from 'next/image'
import { Loader2, Pause, Play, Share, SkipBack, SkipForward, Volume, Volume1, Volume2, VolumeOff, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import ShareSong from "../shareSong";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";
import VolumeSlider from '@/components/songControlsSubcomponents/volumeSlider'

interface miniPlayerInterface {
    albumCover: string;
    songRef: any;
    songVal: string;
    isPlaying: boolean;
    setIsPlaying: any;
    volumeVal: number;
    setVolumeVal: any;
    songCreator: string;
    handleSkipSong: (back: boolean) => void;
}

export const MiniPlayer = ({
    albumCover,
    isPlaying,
    setIsPlaying,
    handleSkipSong,
    songCreator,
    songRef,
    songVal,
    setVolumeVal,
    volumeVal,
}: miniPlayerInterface) => {
    const [sliderValue, setSliderValue] = useState(0);
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

    const VolumeIcon = ({ ...props }) => {
        if (songRef.current && songRef.current.muted) {
            return <VolumeOff {...props} />;
        }

        if (volumeVal > 60) {
            return <Volume2 {...props} />;
        } else if (volumeVal < 60 && volumeVal > 30) {
            return <Volume1 {...props} />;
        } else if (volumeVal === 0) {
            return <VolumeX {...props} />;
        } else {
            return <Volume {...props} />;
        }
    }

    return (
        <ScrollArea className="-[calc(100vh-4rem)] w-full">
            <div className={`p-8 flex flex-col gap-2 transition-all bg-primary-foreground w-full`}>
                <div className="flex flex-col gap-4 mt-0">
                    <div className="flex flex-col relative items-center">
                        <Image src={albumCover} alt="Album Cover" width={345} height={340} priority={true} className="rounded-xl shadow-lg" />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <div className="flex flex-col overflow-hidden flex-1">
                            <div className="text-2xl font-semibold w-full scrolling-text relative select-none leading-none">{songVal || "No Track Found"}</div>
                            <div className="text-md text-muted-foreground">{songCreator || "Unknown"}</div>
                        </div>
                        <div className="items-center flex gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    {songRef.current ?
                                        <Button className="rounded-full" variant='secondary' size='icon'>
                                            <Share />
                                        </Button> :
                                        <Button className="rounded-full" variant='secondary' size='icon' disabled>
                                            <Share />
                                        </Button>
                                    }
                                </DialogTrigger>
                                <DialogContent className="max-w-[90%] rounded-xl">
                                    <DialogHeader>
                                        <DialogTitle>Share song</DialogTitle>
                                    </DialogHeader>
                                    <ShareSong />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center gap-8 w-full mt-10">
                    <div className="w-full">
                        <Slider value={[sliderValue]} max={100} step={1} className="w-full [&>:last-child>span]:bg-primary transition-all duration-500" onValueChange={handleSliderChange} />
                    </div>
                    <div className="flex gap-1 items-center">
                        <div className="w-full">{formatTime(currentTimeVal)}</div>
                        <div className="flex gap-2 items-center w-full scale-110">
                            <Button
                                size="icon"
                                className={cn('p-6 rounded-full bg-transparent focus:bg-transparent', songVal !== "" || songVal !== null && 'opacity-50 cursor-not-allowed')}
                                variant="ghost"
                                onClick={() => handleSkipSong(true)}
                            >
                                <SkipBack size='32' />
                            </Button>
                            <Button
                                className={cn('p-6 rounded-full focus:bg-primary', songVal !== "" || songVal !== null && 'opacity-50 cursor-not-allowed')}
                                size="icon"
                                onClick={() => setIsPlaying(songVal !== "" && !isPlaying)}
                            >
                                {!isPlaying ? <Play size='32' /> : <Pause size='32' />}
                            </Button>
                            <Button
                                size="icon"
                                className={cn('p-6 rounded-full bg-transparent focus:bg-transparent', songVal !== "" || songVal !== null && 'opacity-50 cursor-not-allowed')}
                                variant="ghost"
                                onClick={() => handleSkipSong(false)}
                            >
                                <SkipForward size='32' />
                            </Button>
                        </div>
                        <div className="w-full text-right">
                            {isNaN(songTime) ? '0:00' : formatTime(songTime)}
                        </div>
                    </div>
                </div>
                <div className="flex mt-12 md:mt-0 h-full items-center gap-2">
                    {songRef.current ? <Button onClick={() => {
                        const song = songRef.current;
                        if (!song) return;
                        song && (song.muted = !song.muted)
                    }
                    }
                        variant='outline' className="rounded-xl">
                        <VolumeIcon size='18' />
                    </Button> :
                        <Button variant='outline' className="rounded-xl" disabled>
                            <VolumeIcon size='18' />
                        </Button>}
                    <VolumeSlider className="[&>:last-child>span]:bg-primary [&>:first-child>span]:opacity-70" value={[Number(volumeVal)]} onValueChange={setVolumeVal} />
                    <Label className="w-12 text-right">{volumeVal}%</Label>
                </div>
            </div>
        </ScrollArea>
    );
};