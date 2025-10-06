import { Slider } from "@/components/ui/slider";
import PlayerButtons from "../../playerButtons";
import { formattedSongTime, formatTime, handleSliderChange } from "@/lib/songControlsFunctions";
import { songControlsInterface } from "@/lib/interfaces";
import { useContext } from "react";
import { SliderValue } from "@/components/contexts";

export default function MiddleSectionSongControls({ shuffle, setShuffle, handleSkipSong, songVal, isLoading, isPlaying, setIsPlaying, songRef, repeat, setRepeat }: songControlsInterface) {
    const [sliderValue, setSliderValue] = useContext(SliderValue).sliderValue;
    const [songTimeType, setSongTimeType] = useContext(SliderValue).songTimeType;
    const [currentTimeVal, setCurrentTimeVal] = useContext(SliderValue).currentTimeVal;

    return (
        <div className="flex flex-col justify-center gap-3 lg:w-full min-w-0 md:w-[35%]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center gap-3 ml-2 items-center">
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
                    biggerPadding={false}
                    buttonVariant={"ghost"}
                    extraButtons={true}
                />
            </div>
            <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground/80 w-12 text-right">{formatTime(songRef.current ? songRef.current.currentTime : 0)}</div>
                <Slider value={[sliderValue]} max={100} step={1} className="w-full [&>:last-child>span]:bg-primary" onValueChange={(value) => handleSliderChange(value, setSliderValue, songRef, setCurrentTimeVal)} />
                <div className="text-sm text-muted-foreground/80 select-none cursor-pointer w-12" onClick={() => setSongTimeType(songTimeType === 1 ? 0 : 1)}>{formattedSongTime(songRef.current ? songRef.current.duration : 0, songTimeType, currentTimeVal)}</div>
            </div>
        </div>
    )
}