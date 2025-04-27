"use client"

import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import Image from 'next/image'
import { EllipsisVertical, Maximize2Icon, Pause, Play, Share, Shuffle, SkipBack, SkipForward, X } from "lucide-react";
import { cn, lyricsDelay } from "@/lib/utils";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import VolumeSlider from '@/components/songControlsSubcomponents/volumeSlider'
import { formattedSongTime, formatTime, handleSliderChange, muteSong, RepeatIcon, VolumeIcon } from "@/lib/songControlsFunctions";
import { Marquee } from "@/components/magicui/marquee";
import { toast } from "sonner";
import { Drawer, DrawerTrigger, DrawerContent } from "../ui/drawer";
import Lyrics from "./lyrics";

interface miniPlayerInterface {
    albumCover: string;
    songRef: any;
    songVal: string;
    isPlaying: boolean;
    setIsPlaying: any;
    volumeVal: number;
    setVolumeVal: any;
    songCreator: string;
    handleSkipSong: any;
    repeat: number;
    setRepeat: any;
    id: string;
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
    id
}: miniPlayerInterface) => {
    const [sliderValue, setSliderValue] = useState(0);
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [songTimeType, setSongTimeType] = useState(0);
    const [showLyrics, setShowLyrics] = useState<boolean>(false);

    // console.log(songVal);

    const useEffectConst = () => {
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
    }

    useEffect(() => {
        useEffectConst();
    }, []);

    useEffect(() => {
        useEffectConst();
    }, [handleSkipSong]);

    return (
        <ScrollArea className="w-full h-full flex flex-col justify-center items-center">
            <div className={`p-8 flex flex-col gap-2 transition-all bg-primary-foreground w-full justify-center`}>
                <div className="flex flex-col gap-4 mt-0">
                    <div className="flex flex-col relative items-center" style={{clipPath: 'inset(0 round 1em)'}} onClick={() => setShowLyrics(true)}>
                        <div className={cn("h-full w-full bg-black/80 backdrop-blur-md transition-opacity duration-500 absolute inset-0 overflow-hidden rounded-xl", showLyrics ? "opacity-100" : "opacity-0")}>
                            <div className="relative w-full h-full">
                                {showLyrics && <Lyrics currentTimeVal={Math.floor(currentTimeVal * lyricsDelay)} id={id} songVal={songVal} />}
                                <div className="absolute top-1 right-1 inline-flex items-center gap-3 px-2 py-1 rounded-full bg-primary-foreground">
                                    <div onClick={(e) => { e.stopPropagation(); setShowLyrics(false) }} className="relative">
                                        <X size='14' />
                                    </div>
                                    <Drawer>
                                        <DrawerTrigger asChild>
                                            <div>
                                                <EllipsisVertical className="rotate-90" size='16' />
                                            </div>
                                        </DrawerTrigger>
                                        <DrawerContent className="max-h-[100%] rounded-xl">
                                            <div className="p-8 w-full flex flex-col gap-2">
                                                <Drawer>
                                                    <DrawerTrigger asChild>
                                                        <Button className="rounded-full" variant='secondary' disabled={!songRef.current}>
                                                            <Maximize2Icon />
                                                            Fullscreen
                                                        </Button>
                                                    </DrawerTrigger>
                                                    <DrawerContent className="max-h-full h-full">
                                                        <div className="bg-secondary rounded-xl relative scroll-smooth" style={{ margin: '1em', height: '100%' }}>
                                                            <div className="relative rounded-xl overflow-hidden">
                                                                <Image src={albumCover} alt={albumCover} width={0} height={0} className="absolute inset-0 bg-cover bg-center opacity-10 blur-2xl size-full" />
                                                                {showLyrics && <Lyrics currentTimeVal={Math.floor(currentTimeVal * lyricsDelay)} id={id} songVal={songVal} />}
                                                            </div>
                                                        </div>
                                                    </DrawerContent>
                                                </Drawer>
                                            </div>
                                        </DrawerContent>
                                    </Drawer>
                                </div>
                            </div>
                        </div>
                        <Image src={albumCover} alt="Album Cover" width={345} height={340} priority={true} className="rounded-xl shadow-lg pointer-events-none w-full" />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <div className="flex flex-col overflow-hidden flex-1 gap-1">
                            {/* <AutoMarquee text={songVal} /> */}
                            <p className="text-2xl font-semibold max-w-[70vw] relative select-none leading-none">
                                {songVal || "No Track Found"}
                            </p>
                            <div className="text-md text-muted-foreground">{songCreator || "Unknown"}</div>
                        </div>
                        <div className="items-center flex gap-2">
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <Button className="rounded-full" variant='secondary' size='icon' disabled={!songRef.current}>
                                        <EllipsisVertical size='24' />
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent className="max-h-[100%] rounded-xl">
                                    <div className="p-8 w-full flex flex-col gap-2">
                                        <Button className="rounded-full" variant='secondary' disabled={!songRef.current} id="share-button" onClick={() => { navigator.clipboard.writeText(location.href); toast("Copied song link to clipboard"); }}>
                                            <Share />
                                            Share
                                        </Button>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center gap-8 w-full mt-10">
                    <div className="w-full flex flex-col gap-3">
                        <Slider value={[sliderValue]} max={100} step={1} className="w-full [&>:last-child>span]:bg-primary transition-all duration-500" onValueChange={(value) => handleSliderChange(value, setSliderValue, songRef, setCurrentTimeVal)} />
                        <div className="flex justify-between items-center">
                            <div className="w-full text-primary/50 text-sm select-none">{formatTime(currentTimeVal) || '0:00'}</div>
                            <div className="w-full text-right text-primary/50 text-sm select-none" onClick={() => setSongTimeType(songTimeType === 1 ? 0 : 1)}>{formattedSongTime(songRef.current ? songRef.current.duration : 0, songTimeType, currentTimeVal)}</div>
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
                    <Button onClick={() => { songRef.current && muteSong(songRef) }}
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

const AutoMarquee = ({ text, }: { text: string }) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef(null);
    const [dummyEl, setDummyEl] = useState<boolean>(false);

    React.useMemo(() => {
        const checkWrap = () => {
            if (textRef.current && text) {
                const { offsetWidth, scrollWidth } = textRef.current;
                const THRESHOLD = 0;
                // setIsOverflowing(scrollWidth > offsetWidth + THRESHOLD);
                setIsOverflowing(dummyEl);
            }
        };

        checkWrap();

        window.addEventListener("resize", checkWrap);
        return () => window.removeEventListener("resize", checkWrap);
    }, [text, dummyEl]);

    return isOverflowing ? (
        <Marquee className="text-2xl font-semibold max-w-[70vw] relative select-none leading-none [--duration:30s] shadowed-song-name-2 whitespace-nowrap animate-marquee" onClick={() => setDummyEl(!dummyEl)}>
            {text || "No Track Found"}
        </Marquee>
    ) : (
        <span ref={textRef} className="text-2xl font-semibold max-w-[70vw] relative select-none leading-none whitespace-nowrap" onClick={() => setDummyEl(!dummyEl)}>
            {text || "No Track Found"}
        </span>
    );
};