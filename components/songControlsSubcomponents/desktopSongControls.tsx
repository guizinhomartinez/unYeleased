import { createContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import '@/app/CSS-files/song-controls.css';
import { toast } from "sonner"
import { songControlsInterface } from "@/lib/interfaces";
import useAlbumAverageColor from "../getAverageColor";
import { useLockBodyScroll } from "react-use";
import FullscreenSongControls from "./desktopSubcomponents/fullscreenSongControls";
import LeftSectionSongControls from "./desktopSubcomponents/sections/leftSection";
import MiddleSectionSongControls from "./desktopSubcomponents/sections/middleSection";
import RightSectionSongControls from "./desktopSubcomponents/sections/rightSection";

export const SliderValue = createContext<number | any>(0);
export const KeyboardHandler = createContext(() => { });
export const WheelEventHandler = createContext(() => { });
export const LyricsOpened = createContext<boolean | any>(false);

// got this function from the beautiful lyrics spicetify extension
// shoutout to the goat who made it
export function setFullscreen(shouldBeFullscreen: boolean) {
    const notFullscreen = (document.fullscreenElement === null);
    if (shouldBeFullscreen === notFullscreen) {
        if (shouldBeFullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}

export const DesktopSongControls = ({
    songRef,
    songVal,
    isPlaying,
    setIsPlaying,
    volumeVal,
    setVolumeVal,
    image,
    repeat,
    setRepeat,
    songCreator,
    handleSkipSong,
    appearBar,
    setAppearBar,
    id,
    isLoading,
    isFullscreenMode,
    setIsFullscreenMode,
    shuffle,
    setShuffle
}: songControlsInterface) => {
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [songTimeType, setSongTimeType] = useState(0);
    const [lyricsOpened, setLyricsOpened] = useState(false);

    const necessaryProps = { shuffle, setShuffle, handleSkipSong, songVal, isLoading, isPlaying, setIsPlaying, songRef, repeat, setRepeat, appearBar, setAppearBar, setVolumeVal, volumeVal, id, image, songCreator, isFullscreenMode, setIsFullscreenMode };

    useLockBodyScroll(isFullscreenMode);

    const handleKeyDown = useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            switch (e.key) {
                case " ":
                    setIsPlaying(!isPlaying);
                    e.preventDefault();
                    break;
                case "ArrowLeft":
                    songRef.current.currentTime -= 5;
                    e.preventDefault();
                    break;
                case "ArrowRight":
                    songRef.current.currentTime += 5;
                    e.preventDefault();
                    break;
                case "r":
                    setRepeat(repeat >= 2 ? 0 : repeat + 1);
                    break;
                case "c":
                    navigator.clipboard.writeText(location.href);
                    toast.success("Copied song link to clipboard");
                    break;
                case "l":
                    setLyricsOpened(!lyricsOpened);
                    break;
                case "h":
                    setAppearBar(!appearBar);
                    break;
                case "f":
                    setIsFullscreenMode(!isFullscreenMode);
                    setFullscreen(!isFullscreenMode || false);
                    break;
                case "Escape":
                    setIsFullscreenMode(false);
                    setFullscreen(false);
                    break;
                case "s":
                    setShuffle(!shuffle);
                    break;
            }

            if (e.metaKey || e.ctrlKey) {
                if (e.key === "ArrowRight") {
                    e.preventDefault();
                    handleSkipSong(false);
                } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    handleSkipSong(true);
                }
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();
                setVolumeVal(volumeVal + 10);
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setVolumeVal(volumeVal - 10);
            }

            if (e.shiftKey) {
                if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setVolumeVal(volumeVal + 5);
                } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setVolumeVal(volumeVal - 5);
                }
            }
        };

        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    })

    const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setVolumeVal((prev: number) => {
            let newValue = prev + (event.deltaY > 0 ? -5 : 5);
            return Math.min(100, Math.max(0, newValue));
        });
    };

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
    }, [songVal, handleSkipSong]);

    const averageColors: string[] = useAlbumAverageColor(image);

    if (isFullscreenMode) {
        return (
            <SliderValue
                value={{
                    sliderValue: [sliderValue, setSliderValue],
                    songTimeType: [songTimeType, setSongTimeType],
                    currentTimeVal: [currentTimeVal, setCurrentTimeVal]
                }}>
                <KeyboardHandler value={() => handleKeyDown}>
                    <WheelEventHandler value={() => handleWheel}>
                        <FullscreenSongControls {...necessaryProps} />
                    </WheelEventHandler>
                </KeyboardHandler>
            </SliderValue>
        )
    } else {
        return (
            <>
                <div
                    className="absolute top-0 left-0 w-full h-full opacity-15 z-10 rounded-l-xl"
                    style={{
                        background: `linear-gradient(90deg, rgb(${averageColors[0]}, ${averageColors[1]}, ${averageColors[2]}), transparent 75%)`
                    }}
                />
                <div className="flex w-full justify-between items-center z-20 px-1 md:gap-2 lg:gap-0" onKeyDown={(e) => handleKeyDown}>
                    {/* Little arrow to hide the bar */}
                    {!isFullscreenMode &&
                        <Button className={cn(
                            'absolute -top-4 right-0 bg-primary-foreground rounded-full duration-500 border-2 border-secondary z-50',
                            !appearBar && 'rotate-180 -top-14')}
                            size='icon'
                            variant='outline'
                            onClick={() => setAppearBar(!appearBar)}
                        >
                            <ChevronDown />
                        </Button>
                    }
                    {/* Left section */}
                    <LeftSectionSongControls {...necessaryProps} />
                    {/* Middle section */}
                    <SliderValue
                        value={{
                            sliderValue: [sliderValue, setSliderValue],
                            songTimeType: [songTimeType, setSongTimeType],
                            currentTimeVal: [currentTimeVal, setCurrentTimeVal]
                        }}>
                        <MiddleSectionSongControls {...necessaryProps} />
                    </SliderValue>
                    {/* Right section */}
                    <SliderValue
                        value={{
                            sliderValue: [sliderValue, setSliderValue],
                            songTimeType: [songTimeType, setSongTimeType],
                            currentTimeVal: [currentTimeVal, setCurrentTimeVal]
                        }}>
                        <WheelEventHandler value={() => handleWheel}>
                            <LyricsOpened value={{ lyricsOpened: [lyricsOpened, setLyricsOpened] }}>
                                <RightSectionSongControls {...necessaryProps} />
                            </LyricsOpened>
                        </WheelEventHandler>
                    </SliderValue>
                </div>
            </>
        )
    }
};