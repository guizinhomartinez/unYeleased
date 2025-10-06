"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { Info, LoaderCircleIcon, X } from "lucide-react";
import { cn, lyricsDelay } from "@/lib/utils";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import VolumeSlider from "@/components/songControlsSubcomponents/volumeSlider";
import {
    formattedSongTime,
    formatTime,
    handleSliderChange,
    muteSong,
    VolumeIcon,
} from "@/lib/songControlsFunctions";
import Lyrics from "./lyrics";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
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
    setShuffle,
}: MiniPlayerInterface) => {
    const [, setSliderValue] = useState(0);
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [songTimeType, setSongTimeType] = useState(0);
    const [showLyrics, setShowLyrics] = useState<boolean>(false);
    const [isSynced, setIsSynced] = useState(true);
    const [tutorialNumber, setTutorialNumber] = useLocalStorage(
        "tutorial-number",
        0,
        { raw: true },
    );

    return (
        <ScrollArea className="h-[100vh] w-full max-w-full overflow-x-hidden">
            <div className="max-w-screen flex w-full flex-col justify-center gap-2 overflow-hidden bg-primary-foreground p-8 transition-all">
                {/* "absolute absolute-div-center" could be used to center this and make it better for 99% of the suers but then the album cover would need to shrink a lot and I think it's not worth it */}
                <div className="relative mt-0 flex flex-col gap-4 rounded-2xl">
                    <Image
                        src={albumCover}
                        alt={`${id.toLowerCase()}`}
                        sizes="100vw"
                        className="pointer-events-none absolute inset-x-0 top-8 h-96 w-full touch-none select-none rounded-3xl bg-cover bg-center opacity-0 blur-2xl dark:opacity-10"
                        fill
                    />
                    <TooltipProvider>
                        <Tooltip
                            open={tutorialNumber === 1}
                            defaultOpen={tutorialNumber === 1}
                            delayDuration={5000}
                        >
                            <TooltipTrigger asChild>
                                <div
                                    className="relative flex flex-col items-center overflow-hidden rounded-2xl transition-all duration-300"
                                    style={{
                                        scale:
                                            !isPlaying && songRef.current
                                                ? 0.9
                                                : 1,
                                        filter:
                                            !isPlaying && songRef.current
                                                ? "grayscale(1)"
                                                : "grayscale(0)",
                                    }}
                                    onClick={() => {
                                        setShowLyrics(true);
                                        setTutorialNumber(2);
                                    }}
                                >
                                    <div
                                        className={cn(
                                            "absolute inset-0 mx-auto aspect-square max-w-xs rounded-xl bg-black/80 backdrop-blur-md transition-opacity duration-700 sm:max-w-sm md:max-w-md",
                                            showLyrics
                                                ? "opacity-100"
                                                : "opacity-0",
                                            !isPlaying &&
                                                songRef.current &&
                                                "-translate-x-[0.4px]",
                                        )}
                                    >
                                        <div className="mx-auto aspect-square max-w-xs px-2 sm:max-w-sm md:max-w-md">
                                            {showLyrics && (
                                                <Lyrics
                                                    currentTimeVal={Math.floor(
                                                        (songRef.current
                                                            ? songRef.current
                                                                  .currentTime
                                                            : 0) * lyricsDelay,
                                                    )}
                                                    id={id}
                                                    songVal={songVal}
                                                    haveVerticalSpace={true}
                                                />
                                            )}
                                            <div className="absolute right-1 top-1 inline-flex items-center gap-3 rounded-full bg-primary-foreground p-1">
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowLyrics(false);
                                                    }}
                                                    className="relative"
                                                >
                                                    <X size="14" />
                                                </div>
                                                <FullscreenButton
                                                    albumCover={albumCover}
                                                    isSynced={isSynced}
                                                    setIsSynced={setIsSynced}
                                                    showLyrics={showLyrics}
                                                    currentTimeVal={Math.floor(
                                                        (songRef.current
                                                            ? songRef.current
                                                                  .currentTime
                                                            : 0) * lyricsDelay,
                                                    )}
                                                    id={id}
                                                    songVal={songVal}
                                                    songRef={songRef}
                                                    songCreator={songCreator}
                                                    isPlaying={isPlaying}
                                                    setIsPlaying={setIsPlaying}
                                                    handleSkipSong={
                                                        handleSkipSong
                                                    }
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
                                        className="pointer-events-none aspect-square w-full max-w-xs rounded-xl shadow-xl sm:max-w-sm md:max-w-md"
                                    />
                                    {(isLoading || isLoading === null) && (
                                        <div
                                            className={cn(
                                                "absolute inset-0 mx-auto aspect-square size-fit overflow-hidden bg-black/60 backdrop-blur-xl dark:bg-black/80",
                                                isLoading && "animate-pulse",
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "relative mx-auto aspect-square size-fit",
                                                    isLoading && "animate-spin",
                                                )}
                                            >
                                                {isLoading && (
                                                    <LoaderCircleIcon className="absolute-div-center text-white" />
                                                )}
                                                {isLoading === null && (
                                                    <div className="absolute-div-center flex w-full flex-col items-center justify-center gap-1 px-2">
                                                        <Info
                                                            className="text-red-500"
                                                            size="28"
                                                        />
                                                        <p className="text-center text-white/60">
                                                            An error ocurred
                                                            while loading the
                                                            song
                                                        </p>
                                                        <p className="text-center text-white/60">
                                                            Please try again
                                                            later
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent
                                side="bottom"
                                className="rounded-2xl"
                                showArrow
                            >
                                <p>
                                    Tap on the album cover to see the song's
                                    lyrics
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="relative mt-2 flex gap-2">
                        <div className="flex min-w-0 max-w-[70vw] flex-1 flex-col gap-1 overflow-hidden">
                            <AutoMarquee
                                text={songVal || "No Track Found"}
                                className="text-2xl font-semibold"
                                number={0}
                            />
                            <AutoMarquee
                                text={songCreator || "Unknown"}
                                className="text-md text-muted-foreground"
                                number={2}
                            />
                        </div>
                        <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-2">
                            <MoreOptionsMenu
                                songRef={songRef}
                                songVal={songVal}
                                id={id}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-10 flex w-full flex-col justify-center gap-8">
                    <div className="flex w-full flex-col gap-3">
                        <Slider
                            value={[
                                (songRef.current
                                    ? songRef.current.currentTime /
                                      songRef.current.duration
                                    : 0) * 100,
                            ]}
                            max={100}
                            step={1}
                            className="w-full transition-all duration-500 [&>:last-child>span]:bg-primary"
                            onValueChange={(value) =>
                                handleSliderChange(
                                    value,
                                    setSliderValue,
                                    songRef,
                                    setCurrentTimeVal,
                                )
                            }
                        />
                        <div className="flex items-center justify-between">
                            <div className="w-full select-none text-sm text-primary/50">
                                {formatTime(
                                    songRef.current
                                        ? songRef.current.currentTime
                                        : 0,
                                )}
                            </div>
                            <div
                                className="w-full select-none text-right text-sm text-primary/50"
                                onClick={() =>
                                    setSongTimeType(songTimeType === 1 ? 0 : 1)
                                }
                            >
                                {formattedSongTime(
                                    songRef.current
                                        ? songRef.current.duration
                                        : 0,
                                    songTimeType,
                                    songRef.current
                                        ? songRef.current.currentTime
                                        : 0,
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex scale-110 items-center justify-center gap-1">
                        <div className="flex w-full items-center justify-between gap-2">
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
                <div className="mt-12 flex h-full w-full items-center gap-2 sm:mt-0">
                    <Button
                        onClick={() => {
                            songRef.current && muteSong(songRef);
                        }}
                        variant="outline"
                        className="rounded-full bg-transparent px-4"
                        size="icon"
                        disabled={!songRef.current}
                    >
                        <VolumeIcon
                            size="18"
                            repeat={repeat}
                            songRef={songRef}
                            volumeVal={volumeVal}
                        />
                    </Button>
                    <VolumeSlider
                        className="[&>:first-child>span]:opacity-70 [&>:last-child>span]:bg-primary"
                        value={[Number(volumeVal)]}
                        onValueChange={setVolumeVal}
                    />
                    <Label className="w-12 text-right">{volumeVal}%</Label>
                </div>
            </div>
        </ScrollArea>
    );
};
