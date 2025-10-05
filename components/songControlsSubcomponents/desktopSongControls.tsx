import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/app/CSS-files/song-controls.css";
import { toast } from "sonner";
import { songControlsInterface } from "@/lib/interfaces";
import useAlbumAverageColor from "../getAverageColor";
import FullscreenSongControls from "./desktopSubcomponents/fullscreenSongControls";
import LeftSectionSongControls from "./desktopSubcomponents/sections/leftSection";
import MiddleSectionSongControls from "./desktopSubcomponents/sections/middleSection";
import RightSectionSongControls from "./desktopSubcomponents/sections/rightSection";
import { LyricsOpened, SliderValue, WheelEventHandler } from "../contexts";
import { useKeyPressEvent } from "react-use";

// got this function from the beautiful lyrics spicetify extension
// shoutout to the goat who made it
export function setFullscreen(shouldBeFullscreen: boolean) {
    const notFullscreen = document.fullscreenElement === null;
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
    setShuffle,
    showLyricsFullscreen,
    setShowLyricsFullscreen,
}: songControlsInterface) => {
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [songTimeType, setSongTimeType] = useState(0);
    const [lyricsOpened, setLyricsOpened] = useState(false);
    const searchBarRef = useRef<HTMLInputElement | null>(null);
    const [searchBarFocused, setSearchBarFocused] = useState(false);

    const necessaryProps = {
        shuffle,
        setShuffle,
        handleSkipSong,
        songVal,
        isLoading,
        isPlaying,
        setIsPlaying,
        songRef,
        repeat,
        setRepeat,
        appearBar,
        setAppearBar,
        setVolumeVal,
        volumeVal,
        id,
        image,
        songCreator,
        isFullscreenMode,
        setIsFullscreenMode,
        showLyricsFullscreen,
        setShowLyricsFullscreen,
    };

    useKeyPressEvent(" ", (e) => {
        if (searchBarRef.current !== null) return;
        e.preventDefault();
        setIsPlaying(!isPlaying);
    });

    useKeyPressEvent("arrowLeft", (e) => {
        if (searchBarRef.current !== null) return;
        e.preventDefault();
        if (songRef.current) songRef.current.currentTime -= 5;
    });

    useKeyPressEvent("ArrowRight", (e) => {
        if (searchBarRef.current !== null) return;
        e.preventDefault();
        if (songRef.current) songRef.current.currentTime += 5;
    });

    useKeyPressEvent("r", () => {
        if (searchBarRef.current !== null) return;
        setRepeat(repeat >= 2 ? 0 : repeat + 1);
    });

    useKeyPressEvent("c", () => {
        if (searchBarRef.current !== null) return;
        navigator.clipboard.writeText(location.href);
        toast.success("Copied song link to clipboard");
    });

    useKeyPressEvent("l", () => {
        if (searchBarRef.current !== null) return;
        setLyricsOpened(!lyricsOpened);
    });

    useKeyPressEvent("h", () => {
        if (searchBarRef.current !== null) return;
        setAppearBar(!appearBar);
    });

    useKeyPressEvent("f", () => {
        if (searchBarRef.current !== null) return;
        setIsFullscreenMode(!isFullscreenMode);
        setFullscreen(!isFullscreenMode || false);
    });

    useKeyPressEvent("Escape", () => {
        if (searchBarRef.current !== null) return;
        setIsFullscreenMode(false);
        setFullscreen(false);
    });

    useKeyPressEvent("s", () => {
        if (searchBarRef.current !== null) return;
        setShuffle(!shuffle);
    });

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
                    currentTimeVal: [currentTimeVal, setCurrentTimeVal],
                }}
            >
                <WheelEventHandler value={() => handleWheel}>
                    <FullscreenSongControls {...necessaryProps} />
                </WheelEventHandler>
            </SliderValue>
        );
    } else {
        return (
            <>
                <div
                    className="absolute top-0 left-0 w-full h-full opacity-15 z-10 rounded-l-xl"
                    style={{
                        background: `linear-gradient(90deg, rgb(${averageColors[0]}, ${averageColors[1]}, ${averageColors[2]}), transparent 75%)`,
                    }}
                />
                <div className="flex w-full justify-between items-center z-20 px-1 md:gap-2 lg:gap-0">
                    {/* Little arrow to hide the bar */}
                    {!isFullscreenMode && (
                        <Button
                            className={cn(
                                "absolute -top-4 right-0 bg-primary-foreground rounded-full duration-500 border-2 border-secondary z-50",
                                !appearBar && "rotate-180 -top-14"
                            )}
                            size="icon"
                            variant="outline"
                            onClick={() => setAppearBar(!appearBar)}
                        >
                            <ChevronDown />
                        </Button>
                    )}
                    {/* Left section */}
                    <LeftSectionSongControls
                        {...necessaryProps}
                        searchBarRef={searchBarRef}
                    />
                    {/* Middle section */}
                    <SliderValue
                        value={{
                            sliderValue: [sliderValue, setSliderValue],
                            songTimeType: [songTimeType, setSongTimeType],
                            currentTimeVal: [currentTimeVal, setCurrentTimeVal],
                        }}
                    >
                        <MiddleSectionSongControls {...necessaryProps} />
                    </SliderValue>
                    {/* Right section */}
                    <SliderValue
                        value={{
                            sliderValue: [sliderValue, setSliderValue],
                            songTimeType: [songTimeType, setSongTimeType],
                            currentTimeVal: [currentTimeVal, setCurrentTimeVal],
                        }}
                    >
                        <WheelEventHandler value={() => handleWheel}>
                            <LyricsOpened
                                value={{
                                    lyricsOpened: [
                                        lyricsOpened,
                                        setLyricsOpened,
                                    ],
                                }}
                            >
                                <RightSectionSongControls {...necessaryProps} />
                            </LyricsOpened>
                        </WheelEventHandler>
                    </SliderValue>
                </div>
            </>
        );
    }
};
