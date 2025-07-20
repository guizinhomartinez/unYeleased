import { useEffect, useState } from "react";
import Image from 'next/image'
import { Progress } from "../ui/progress";
import { songControlsInterface } from "@/lib/interfaces";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import PlayerButtons from "./playerButtons";
import { AutoMarquee } from "./autoMarquee";

export const MobileSongControls = ({
    songRef,
    songVal,
    isPlaying,
    setIsPlaying,
    image,
    songCreator,
    handleSkipSong,
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
                                    <div className="overflow-hidden max-w-[50vw]">
                                        <AutoMarquee text={songVal || "No Track Found"} className={"font-semibold"} number={0} />
                                        <AutoMarquee text={songCreator || "Unknown"} className="text-sm text-muted-foreground" number={2} />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-1 ml-3 w-fit" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
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