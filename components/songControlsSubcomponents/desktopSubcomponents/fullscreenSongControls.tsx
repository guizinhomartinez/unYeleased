import { Slider } from "@/components/ui/slider";
import {
    formattedSongTime,
    formatTime,
    handleSliderChange,
    muteSong,
    VolumeIcon,
} from "@/lib/songControlsFunctions";
import PlayerButtons from "../playerButtons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Maximize2Icon, MicVocal, Minimize2Icon } from "lucide-react";
import VolumeSlider from "../volumeSlider";
import { Label } from "@/components/ui/label";
import { songControlsInterface } from "@/lib/interfaces";
import { useContext } from "react";
import { SliderValue, WheelEventHandler } from "@/components/contexts";

export default function FullscreenSongControls({
    songRef,
    songVal,
    isPlaying,
    setIsPlaying,
    volumeVal,
    setVolumeVal,
    repeat,
    setRepeat,
    handleSkipSong,
    isLoading,
    isFullscreenMode,
    setIsFullscreenMode,
    showLyricsFullscreen,
    setShowLyricsFullscreen,
    shuffle,
    setShuffle,
}: songControlsInterface) {
    function setFullscreen(shouldBeFullscreen: boolean) {
        const notFullscreen = document.fullscreenElement === null;
        if (shouldBeFullscreen === notFullscreen) {
            if (shouldBeFullscreen) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    }

    const [sliderValue, setSliderValue] = useContext(SliderValue).sliderValue;
    const [songTimeType, setSongTimeType] =
        useContext(SliderValue).songTimeType;
    const [currentTimeVal, setCurrentTimeVal] =
        useContext(SliderValue).currentTimeVal;
    const handleWheel = useContext(WheelEventHandler);

    return (
        <div className="flex flex-col w-full justify-between items-center gap-4 pb-4 h-full relative">
            <div className="flex items-center justify-center w-full px-6">
                <div className="text-sm text-muted-foreground/80 w-12">
                    {formatTime(
                        songRef.current ? songRef.current.currentTime : 0
                    )}
                </div>
                <Slider
                    value={[sliderValue]}
                    max={100}
                    step={1}
                    className="w-full [&>:first-child>span]:bg-[hsl(0,0%,100%)] [&>:last-child>span]:border-transparent [&>:last-child>span]:bg-[hsl(0,0%,100%)] [&>div]:transition-all [&>div]:duration-500 bg-[hsl(0,0%,100%)]/20"
                    onValueChange={(value) =>
                        handleSliderChange(
                            value,
                            setSliderValue,
                            songRef,
                            setCurrentTimeVal
                        )
                    }
                />
                <div
                    className="text-sm text-muted-foreground/80 select-none cursor-pointer w-12 text-right"
                    onClick={() => setSongTimeType(songTimeType === 1 ? 0 : 1)}
                >
                    {formattedSongTime(
                        songRef.current ? songRef.current.duration : 0,
                        songTimeType,
                        currentTimeVal
                    )}
                </div>
            </div>
            <div className="flex w-full justify-between items-center px-4">
                <div className="w-[34%]" />
                <div className="flex justify-center gap-3 ml-2 items-center *:text-[hsl(0,0%,100%)]">
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
                        playerButtonClassname="!bg-[hsl(0,0%,100%)] !text-[hsl(240,10%,3.9%)]"
                    />
                </div>
                <div />
                <div className="flex justify-center gap-3 w-[25%] items-center *:text-[hsl(0,0%,100%)]">
                    <Button
                        className={cn("rounded-full p-6")}
                        variant="link"
                        onClick={() =>
                            setShowLyricsFullscreen(!showLyricsFullscreen)
                        }
                    >
                        <MicVocal size="36" />
                    </Button>
                    <Button
                        onClick={() => muteSong(songRef)}
                        variant="link"
                        className="rounded-full bg-transparent px-4"
                        size="icon"
                        disabled={!songRef.current}
                    >
                        <VolumeIcon
                            size="18"
                            songRef={songRef}
                            volumeVal={volumeVal}
                            repeat={repeat}
                        />
                    </Button>
                    <VolumeSlider
                        className="[&>:last-child>span]:bg-[hsl(0,0%,100%)] [&>:last-child>span]:border-transparent [&>:first-child>span]:opacity-70 [&>:first-child>span]:bg-[hsl(0,0%,100%)] bg-[hsl(0,0%,100%)]/20"
                        value={[volumeVal]}
                        onValueChange={setVolumeVal}
                        onWheel={handleWheel}
                    />
                    <Label className="w-12 text-right">{volumeVal}%</Label>
                    <Button
                        className="rounded-full p-6"
                        size="icon"
                        variant="link"
                        onClick={() => {
                            setIsFullscreenMode(!isFullscreenMode);
                            setFullscreen(!isFullscreenMode || false);
                        }}
                    >
                        {!isFullscreenMode ? (
                            <Maximize2Icon size="36" />
                        ) : (
                            <Minimize2Icon size="36" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
