"use client"

import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import Image from 'next/image'
import { Info, LoaderCircleIcon, X } from "lucide-react";
import { cn, lyricsDelay } from "@/lib/utils";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import VolumeSlider from '@/components/songControlsSubcomponents/volumeSlider'
import { formattedSongTime, formatTime, handleSliderChange, muteSong, VolumeIcon } from "@/lib/songControlsFunctions";
import Lyrics from "./lyrics";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MiniPlayerInterface } from "@/lib/interfaces";
import PlayerButtons from "./playerButtons";
import { AutoMarquee } from "./autoMarquee";
import { MoreOptionsMenu } from "./moreOptionsMenu";
import { useLocalStorage } from "react-use";
import { FullscreenButton } from "./miniPlayerSubcomponents/fullscreenButton";

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
    id,
    isLoading,
    shuffle,
    setShuffle
}: MiniPlayerInterface) => {
    const [sliderValue, setSliderValue] = useState(0);
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [songTimeType, setSongTimeType] = useState(0);
    const [showLyrics, setShowLyrics] = useState<boolean>(false);
    const [isSynced, setIsSynced] = useState(true);
    const [tutorialNumber, setTutorialNumber] = useLocalStorage("tutorial-number", 0, { raw: true });

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
    }, [handleSkipSong]);

    return (
        <ScrollArea className="flex-1 w-full max-w-screen overflow-x-hidden">
            <div className='p-8 flex flex-col gap-2 transition-all bg-primary-foreground w-full justify-center max-w-screen overflow-hidden'> {/* "absolute absolute-div-center" could be used to center this and make it better for 99% of the suers but then the album cover would need to shrink a lot and I think it's not worth it */}
                <div className="flex flex-col gap-4 mt-0 rounded-2xl relative">
                    <Image src={albumCover} alt={`${id.toLowerCase()}`} width={0} height={0} className="absolute inset-x-0 top-8 bg-cover bg-center blur-2xl w-full rounded-3xl h-96 touch-none select-none pointer-events-none opacity-0 dark:opacity-10" />
                    <TooltipProvider>
                        <Tooltip open={tutorialNumber === 1} defaultOpen={tutorialNumber === 1} delayDuration={5000}>
                            <TooltipTrigger asChild>
                                <div
                                    className="flex flex-col relative items-center overflow-hidden transition-all duration-300 rounded-2xl"
                                    style={{
                                        scale: (!isPlaying && songRef.current) ? 0.9 : 1,
                                        filter: (!isPlaying && songRef.current) ? "grayscale(1)" : "grayscale(0)",
                                    }}
                                    onClick={() => {
                                        setShowLyrics(true);
                                        setTutorialNumber(2);
                                    }}
                                >
                                    <div className={cn("aspect-square max-w-xs sm:max-w-sm md:max-w-md mx-auto bg-black/80 backdrop-blur-md transition-opacity duration-700 absolute inset-0 rounded-xl", showLyrics ? "opacity-100" : "opacity-0")}>
                                        <div className="aspect-square max-w-xs sm:max-w-sm md:max-w-md mx-auto px-2">
                                            {showLyrics && <Lyrics currentTimeVal={Math.floor(currentTimeVal * lyricsDelay)} id={id} songVal={songVal} haveVerticalSpace={true} />}
                                            <div className="absolute top-1 right-1 inline-flex items-center gap-3 p-1 rounded-full bg-primary-foreground">
                                                <div onClick={(e) => { e.stopPropagation(); setShowLyrics(false) }} className="relative">
                                                    <X size='14' />
                                                </div>
                                                <FullscreenButton
                                                    albumCover={albumCover}
                                                    isSynced={isSynced}
                                                    setIsSynced={setIsSynced}
                                                    showLyrics={showLyrics}
                                                    currentTimeVal={Math.floor(currentTimeVal * lyricsDelay)}
                                                    id={id}
                                                    songVal={songVal}
                                                    songRef={songRef}
                                                    songCreator={songCreator}
                                                    isPlaying={isPlaying}
                                                    setIsPlaying={setIsPlaying}
                                                    handleSkipSong={handleSkipSong}
                                                    isLoading={isLoading}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Image
                                        src={albumCover}
                                        alt="Album Cover"
                                        width={320}
                                        height={320}
                                        priority={true}
                                        className="rounded-xl shadow-xl pointer-events-none aspect-square w-full max-w-xs sm:max-w-sm md:max-w-md" />
                                    {(isLoading || isLoading === null) &&
                                        <div className={cn("aspect-square size-fit mx-auto absolute inset-0 overflow-hidden bg-black/60 backdrop-blur-xl dark:bg-black/80", isLoading && "animate-pulse")}>
                                            <div className={cn("aspect-square size-fit mx-auto relative", isLoading && "animate-spin")}>
                                                {isLoading && <LoaderCircleIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />}
                                                {isLoading === null &&
                                                    <div className="flex flex-col gap-1 items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-2">
                                                        <Info className="text-red-500" size='28' />
                                                        <p className="text-center text-white/60">An error ocurred while loading the song</p>
                                                        <p className="text-center text-white/60">Please try again later</p>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="rounded-2xl" showArrow>
                                <p>Tap on the album cover to see the song's lyrics</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="flex gap-2 mt-2 relative">
                        <div className="flex flex-col overflow-hidden flex-1 gap-1 min-w-0 max-w-[70vw]">
                            <AutoMarquee text={songVal || "No Track Found"} className="text-2xl font-semibold" number={0} />
                            <AutoMarquee text={songCreator || "Unknown"} className="text-md text-muted-foreground" number={2} />
                        </div>
                        <div className="items-center flex gap-2 absolute top-1/2 -translate-y-1/2 right-0">
                            <MoreOptionsMenu songRef={songRef} songVal={songVal} id={id} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center gap-8 w-full mt-10">
                    <div className="w-full flex flex-col gap-3">
                        <Slider value={[sliderValue]} max={100} step={1} className="w-full [&>:last-child>span]:bg-primary transition-all duration-500" onValueChange={(value) => handleSliderChange(value, setSliderValue, songRef, setCurrentTimeVal)} />
                        <div className="flex justify-between items-center">
                            <div className="w-full text-primary/50 text-sm select-none">{formatTime(songRef.current ? songRef.current.currentTime : 0)}</div>
                            <div className="w-full text-right text-primary/50 text-sm select-none" onClick={() => setSongTimeType(songTimeType === 1 ? 0 : 1)}>{formattedSongTime(songRef.current ? songRef.current.duration : 0, songTimeType, currentTimeVal)}</div>
                        </div>
                    </div>
                    <div className="flex gap-1 items-center justify-center scale-110">
                        <div className="flex gap-2 items-center w-full justify-between">
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
                    </div>
                </div>
                <div className="flex mt-12 sm:mt-0 h-full w-full items-center gap-2">
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