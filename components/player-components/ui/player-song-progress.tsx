import { Slider } from "@/components/ui/slider";
import { formattedSongTime, formatTime } from "@/lib/songControlsFunctions";
import { Dispatch, RefObject, SetStateAction, useEffect, useState } from "react";

const PlayerSongProgress = ({
    songRef,
    isPlaying,
    songVal,
}: {
    songRef: RefObject<HTMLAudioElement | null>;
    songVal: string;
    isPlaying: boolean;
}) => {
    const [sliderValue, setSliderValue] = useState(0);
    const [songTimeType, setSongTimeType] = useState(0);

    useEffect(() => {
        const song = songRef.current;
        if (!song) return;

        const updateTime = () => {
            if (song.duration) {
                setSliderValue((song.currentTime / song.duration) * 100);
            }
        };

        song.addEventListener("timeupdate", updateTime);

        return () => {
            song.removeEventListener("timeupdate", updateTime);
        };
    }, [songVal, isPlaying]);

    const handleSliderChange = (value: number[]) => {
        const newValue = value[0];
        setSliderValue(newValue);
        if (songRef.current) {
            const newTime = (newValue / 100) * songRef.current.duration;
            songRef.current.currentTime = newTime;
        }
    };

    return (
        <div className="w-full flex flex-col gap-3">
            <Slider
                value={[
                    (songRef.current
                        ? songRef.current.currentTime / songRef.current.duration
                        : 0) * 100,
                ]}
                max={100}
                step={1}
                className="[&>:last-child>span]:bg-primary"
                onValueChange={handleSliderChange}
            />
            <div className="flex justify-between items-center">
                <div className="w-full text-primary/50 text-sm select-none">
                    {formatTime(
                        songRef.current ? songRef.current.currentTime : 0
                    )}
                </div>
                <div
                    className="w-full text-right text-primary/50 text-sm select-none"
                    onClick={() => setSongTimeType(songTimeType === 1 ? 0 : 1)}
                >
                    {formattedSongTime(
                        songRef.current ? songRef.current.duration : 0,
                        songTimeType,
                        songRef.current?.currentTime ?? 0
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayerSongProgress;
