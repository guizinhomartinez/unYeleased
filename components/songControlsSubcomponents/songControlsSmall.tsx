import { useEffect, useState } from "react";
import Image from 'next/image'
import { Button } from "../ui/button";
import { LoaderCircleIcon, Pause, Play, SkipForward } from "lucide-react";
import { Progress } from "../ui/progress";
import '@public/CSS/song-controls.css';
import { songControlsInterface } from "@/lib/interfaces";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export const SongControlsSmall = ({
    songRef,
    songVal,
    isPlaying,
    setIsPlaying,
    volumeVal,
    setVolumeVal,
    image,
    songCreator,
    handleSkipSong,
    id,
    isLoading,
    appearBar,
    tutorialNumber
}: songControlsInterface) => {
    const [sliderValue, setSliderValue] = useState(0);

    useEffect(() => {
        const song = songRef.current;
        if (!song) return;

        const updateTime = () => {
            if (song.duration) {
                setSliderValue(Number(((song.currentTime / song.duration) * 100).toFixed(0)));
            }
        };

        song.addEventListener("timeupdate", updateTime);

        return () => {
            song.removeEventListener("timeupdate", updateTime);
        };
    }, [handleSkipSong]);

    return (
        <>
            <TooltipProvider>
                <Tooltip open={tutorialNumber === 0 && appearBar} defaultOpen={tutorialNumber === 0 && appearBar}>
                    <TooltipTrigger asChild>
                        <div className="flex flex-col w-full h-full">
                            <div className="flex items-center p-3 justify-between">
                                <div className="flex items-center gap-2 flex-1 select-none relative">
                                    <Image
                                        src={image}
                                        alt={image}
                                        width={60}
                                        height={60}
                                        className="rounded-lg"
                                    />
                                    <div className="overflow-hidden">
                                        <div className="font-semibold overflow-hidden whitespace-pre text-ellipsis w-fit" id="track-name">
                                            {songVal !== "" ? songVal : "No Track Found"}
                                        </div>
                                        <div className="text-sm text-muted-foreground" id="song-creator">
                                            {songCreator}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-1" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                                    <Button className={cn('p-5 rounded-full focus:bg-primary', (!songVal || songVal === "" || isLoading || isLoading === null) && 'opacity-50 cursor-not-allowed')} size="icon" onClick={() => setIsPlaying(!isPlaying)}>
                                        {!isLoading ? !isPlaying ? <Play /> : <Pause /> : <LoaderCircleIcon className="animate-spin" />}
                                    </Button>
                                    <Button className={cn('p-5 rounded-full focus:bg-transparent', (!songVal || songVal === "") && 'opacity-50 cursor-not-allowed')} size="icon" variant="ghost" onClick={() => handleSkipSong(false)}>
                                        <SkipForward />
                                    </Button>
                                </div>
                            </div>
                            <Progress
                                value={sliderValue}
                                className="transition-all duration-1000 h-1 rounded-none w-full"
                            />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="rounded-2xl" showArrow secondaryColor>
                        <p>Tap here to open the miniplayer</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </>
    );
};