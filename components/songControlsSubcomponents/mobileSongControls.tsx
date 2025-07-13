import { useEffect, useState } from "react";
import Image from 'next/image'
import { Button } from "../ui/button";
import { LoaderCircleIcon, Pause, Play, SkipForward } from "lucide-react";
import { Progress } from "../ui/progress";
import '@public/CSS/song-controls.css';
import { songControlsInterface } from "@/lib/interfaces";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { PlayIcon } from "@/lib/songControlsFunctions";
import PlayerButtons from "./playerButtons";
import { AutoMarquee } from "./autoMarquee";

export const MobileSongControls = ({
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
                                    <Image src={image} alt={image} width={60} height={60} className="rounded-lg" />
                                    <div className="overflow-hidden max-w-[60%]">
                                        <AutoMarquee text={songVal || "No Track Found"} className={"font-semibold"} number={0} />
                                        <AutoMarquee text={songCreator || "Unknown"} className="text-sm text-muted-foreground" number={2} />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-1" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                                    <PlayerButtons
                                        handleSkipSong={handleSkipSong}
                                        songVal={songVal}
                                        isLoading={isLoading}
                                        isPlaying={isPlaying}
                                        setIsPlaying={setIsPlaying}
                                        songRef={songRef}
                                        biggerPadding={false}
                                        buttonVariant={"link"}
                                        extraButtons={false}
                                    />
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