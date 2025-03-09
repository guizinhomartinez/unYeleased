import { useEffect, useState } from "react";
import Image from 'next/image'
import { Button } from "../ui/button";
import { Pause, Play, SkipForward } from "lucide-react";
import { Progress } from "../ui/progress";
import { songControlsInterface } from "../songControls";
import '@public/CSS/song-controls.css';

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
}: songControlsInterface) => {
    const [sliderValue, setSliderValue] = useState(0);

    const useEffectConst = () => {
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
    }

    useEffect(() => {
        useEffectConst();
    }, []);

    useEffect(() => {
        useEffectConst();
    }, [handleSkipSong]);

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="flex items-center py-3 px-3 justify-between">
                    <div className="flex items-center gap-2 flex-1 select-none max-w-[70%] shadowed-song-name relative">
                        <Image
                            src={image}
                            alt={image}
                            width={60}
                            height={60}
                            className="rounded-lg"
                        />
                        <div className="overflow-hidden">
                            <div className="font-semibold overflow-hidden whitespace-pre text-ellipsis w-fit">
                                {songVal !== "" ? songVal : "No Track Found"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {songCreator}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button className={`p-5 rounded-full ${songVal !== "" ? "" : "opacity-50 cursor-not-allowed"}`} size="icon" onClick={() => setIsPlaying(songVal !== "" && !isPlaying)}>
                            {!isPlaying ? <Play /> : <Pause />}
                        </Button>
                        <Button size="icon" className={`p-5 pr-2 rounded-full ${songVal !== "" ? "" : "opacity-50 cursor-not-allowed"}`} variant="ghost" onClick={() => handleSkipSong(false)}>
                            <SkipForward />
                        </Button>
                    </div>
                </div>
                <Progress
                    value={sliderValue}
                    className="transition-all duration-1000 h-1 rounded-none w-full"
                />
            </div>
        </>
    );
};