import { Slider } from "@/components/ui/slider";
import { formattedSongTime, formatTime, handleSliderChange, muteSong, VolumeIcon } from "@/lib/songControlsFunctions";
import PlayerButtons from "../playerButtons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Maximize2Icon, MicVocal, Minimize2Icon } from "lucide-react";
import VolumeSlider from "../volumeSlider";
import { Label } from "@/components/ui/label";
import { songControlsInterface } from "@/lib/interfaces";
import { useContext } from "react";
import { KeyboardHandler, SliderValue, WheelEventHandler } from "@/components/contexts"

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
    setShuffle
}: songControlsInterface) {
    function setFullscreen(shouldBeFullscreen: boolean) {
        const notFullscreen = (document.fullscreenElement === null);
        if (shouldBeFullscreen === notFullscreen) {
            if (shouldBeFullscreen) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    }

    const [sliderValue, setSliderValue] = useContext(SliderValue).sliderValue;
    const [songTimeType, setSongTimeType] = useContext(SliderValue).songTimeType;
    const [currentTimeVal, setCurrentTimeVal] = useContext(SliderValue).currentTimeVal;
    const handleKeyDown = useContext(KeyboardHandler);
    const handleWheel = useContext(WheelEventHandler);

    return (
        <div className="flex flex-col w-full justify-between items-center gap-4 pb-4 h-full relative before:absolute before:-top-5 before:-left-10 before:size-[150%] before:blur-md before:bg-[rgba(30,30,30,0.3)] before:-z-10" onKeyDown={(e) => handleKeyDown}>
            <div className="flex items-center justify-center w-full px-6">
                <div className="text-sm text-muted-foreground/80 w-12">{formatTime(songRef.current ? songRef.current.currentTime : 0)}</div>
                <Slider value={[sliderValue]} max={100} step={1} className="w-full [&>:last-child>span]:bg-primary [&>div]:transition-all [&>div]:duration-500" onValueChange={(value) => handleSliderChange(value, setSliderValue, songRef, setCurrentTimeVal)} />
                <div className="text-sm text-muted-foreground/80 select-none cursor-pointer w-12 text-right" onClick={() => setSongTimeType(songTimeType === 1 ? 0 : 1)}>{formattedSongTime(songRef.current ? songRef.current.duration : 0, songTimeType, currentTimeVal)}</div>
            </div>
            <div className="flex w-full justify-between items-center px-4">
                <div className="w-[34%]" />
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
                        biggerPadding={true}
                        buttonVariant={"link"}
                        extraButtons={true}
                    />
                </div>
                <div />
                <div className="flex justify-center gap-3 w-[25%] items-center">
                    <Button className={cn("rounded-full p-6")} variant='link' onClick={() => setShowLyricsFullscreen(!showLyricsFullscreen)}>
                        <MicVocal size='36' />
                    </Button>
                    <Button
                        onClick={() => muteSong(songRef)}
                        variant='link'
                        className="rounded-full bg-transparent px-4"
                        size='icon'
                        disabled={!songRef.current}
                    >
                        <VolumeIcon size='18' songRef={songRef} volumeVal={volumeVal} repeat={repeat} />
                    </Button>
                    <VolumeSlider className="[&>:last-child>span]:bg-primary [&>:last-child>span]:border-transparent [&>:first-child>span]:opacity-70" value={[volumeVal]} onValueChange={setVolumeVal} onWheel={handleWheel} />
                    <Label className="w-12 text-right">{volumeVal}%</Label>
                    <Button className="rounded-full p-6" size='icon' variant='link' onClick={() => { setIsFullscreenMode(!isFullscreenMode); setFullscreen(!isFullscreenMode || false) }}>
                        {!isFullscreenMode ? <Maximize2Icon size='36' /> : <Minimize2Icon size='36' />}
                    </Button>
                </div>
            </div>
        </div>
    )
}