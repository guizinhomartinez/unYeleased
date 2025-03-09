import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import Image from 'next/image'
import { Pause, Play, Share, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import ShareSong from "../shareSong";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";
import VolumeSlider from '@/components/songControlsSubcomponents/volumeSlider'
import { formattedSongTime, formatTime, handleSliderChange, muteSong, RepeatIcon, VolumeIcon } from "@/lib/songControlsFunctions";
import { Marquee } from "@/components/magicui/marquee";

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
    repeat: number;
    setRepeat: any;
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
    repeat,
    setRepeat,
    volumeVal,
}: miniPlayerInterface) => {
    const [sliderValue, setSliderValue] = useState(0);
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

    useEffect(() => {
        useEffectConst();
    }, []);

    useEffect(() => {
        useEffectConst();
    }, [handleSkipSong]);

    return (
        <ScrollArea className="-[calc(100vh-4rem)] w-full">
            <div className={`p-8 flex flex-col gap-2 transition-all bg-primary-foreground w-full`}>
                <div className="flex flex-col gap-4 mt-0">
                    <div className="flex flex-col relative items-center">
                        <Image src={albumCover} alt="Album Cover" width={345} height={340} priority={true} className="rounded-xl shadow-lg" />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <div className="flex flex-col overflow-hidden flex-1">
                            <Marquee className="text-2xl font-semibold max-w-[70vw] relative select-none leading-none [--duration:30s] shadowed-song-name-2" pauseOnHover>{songVal || "No Track Found"}</Marquee>
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
                    <div className="w-full flex flex-col gap-3">
                        <Slider value={[sliderValue]} max={100} step={1} className="w-full [&>:last-child>span]:bg-primary transition-all duration-500" onValueChange={(value) => handleSliderChange(value, setSliderValue, songRef, setCurrentTimeVal)} />
                        <div className="flex justify-between items-center">
                            <div className="w-full text-primary/50 text-sm select-none">{formatTime(currentTimeVal) || '0:00'}</div>
                            <div className="w-full text-right text-primary/50 text-sm select-none" onClick={() => setSongTimeType(songTimeType === 1 ? 0 : 1)}>{formattedSongTime(songTime, songTimeType, currentTimeVal)}</div>
                        </div>
                    </div>
                    <div className="flex gap-1 items-center">
                        <div className="flex gap-2 items-center w-full scale-110 justify-between">
                            <Button
                                size="icon"
                                className={cn('p-6 rounded-full bg-transparent focus:bg-transparent', 'opacity-50 cursor-not-allowed')}
                                variant="ghost"
                                onClick={() => handleSkipSong(true)}
                                disabled
                            >
                                <Shuffle />
                            </Button>
                            <div className="flex gap-4 items-center w-full justify-center">
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
                            <Button
                                size="icon"
                                className={cn('p-6 rounded-full bg-transparent focus:bg-transparent', repeat === 0 && 'opacity-50')}
                                variant="ghost"
                                onClick={() => setRepeat(repeat >= 2 ? 0 : repeat + 1)}
                            >
                                <RepeatIcon repeat={repeat} />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex mt-12 md:mt-0 h-full items-center gap-2">
                        <Button onClick={() => {songRef.current && muteSong(songRef)}}
                            variant='outline' className="rounded-full bg-transparent px-4" size='icon' disabled={!songRef.current}>
                            <VolumeIcon size='18' repeat={repeat} songRef={songRef} volumeVal={volumeVal} />
                        </Button>
                    <VolumeSlider className="[&>:last-child>span]:bg-primary [&>:first-child>span]:opacity-70" value={[Number(volumeVal)]} onValueChange={setVolumeVal} />
                    <Label className="w-12 text-right">{volumeVal}%</Label>
                </div>
            </div>
        </ScrollArea>
    );
};