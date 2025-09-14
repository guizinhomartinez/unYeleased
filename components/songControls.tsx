import { useState, useEffect } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { MiniPlayer } from "./songControlsSubcomponents/miniPlayer";
import { MobileSongControls } from "./songControlsSubcomponents/mobileSongControls";
import { DesktopSongControls } from "./songControlsSubcomponents/desktopSongControls";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, lyricsDelay } from "@/lib/utils";
import { songControlsInterface } from "@/lib/interfaces";
import { AnimatePresence } from "motion/react";
import { useLocalStorage, useLockBodyScroll } from "react-use";
import { X } from "lucide-react";
import dynamic from "next/dynamic";

const FullscreenUI = dynamic(() =>
  import("@/components/songControlsSubcomponents/fullscreenUI").then(
    (mod) => mod.default
  )
);

export const SongControls = ({
    songRef,
    songVal,
    isPlaying,
    setIsPlaying,
    volumeVal,
    setVolumeVal,
    image,
    songCreator,
    handleSkipSong,
    repeat,
    setRepeat,
    id,
    albumName,
    appearBar,
    setAppearBar,
    isLoading,
    isFullscreenMode,
    setIsFullscreenMode,
    showLyricsFullscreen,
    setShowLyricsFullscreen,
    shuffle,
    setShuffle
}: songControlsInterface) => {
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [tutorialNumber, setTutorialNumber] = useLocalStorage("tutorial-number", 0, { raw: true });

    const necessaryDesktopProps = { songRef, songVal, isPlaying, setIsPlaying, volumeVal, setVolumeVal, image, songCreator, handleSkipSong, repeat, setRepeat, id, appearBar, setAppearBar, isLoading, isFullscreenMode, setShuffle, shuffle, albumName, setIsFullscreenMode, setShowLyricsFullscreen, showLyricsFullscreen };
    const necessaryMobileProps = { songRef, songVal, isPlaying, setIsPlaying, volumeVal, setVolumeVal, image, songCreator, handleSkipSong, repeat, setRepeat, id, appearBar, setAppearBar, isLoading, tutorialNumber, shuffle, setShuffle };

    useLockBodyScroll(isFullscreenMode);

    useEffect(() => {
        const song = songRef.current;
        if (!song) return;

        const updateTime = () => {
            setCurrentTimeVal(Math.floor(song.currentTime * lyricsDelay));
        };

        song.addEventListener("timeupdate", updateTime);

        return () => {
            song.removeEventListener("timeupdate", updateTime);
        };
    }, [songVal, handleSkipSong]);

    // this basically just adds support for stuff like media buttons and mobile media players in notification tray

    // had never heard of this before but i guess better late than never
    useEffect(() => {
        const song = songRef.current;
        if (!song) return;

        if ("mediaSession" in navigator) {
            navigator.mediaSession.setActionHandler("play", () => song.play());
            navigator.mediaSession.setActionHandler("pause", () => song.pause());
            navigator.mediaSession.setActionHandler("previoustrack", () => handleSkipSong(true));
            navigator.mediaSession.setActionHandler("nexttrack", () => handleSkipSong(false));

            navigator.mediaSession.metadata = new MediaMetadata({
                title: songVal ? songVal : "No Track Found",
                artist: songCreator ? songCreator : "Unknown",
                album: albumName ? albumName : id,
                artwork: [
                    {
                        src: image,
                        sizes: '96x96,128x128,192x192',
                        type: "image/jpeg",
                    },
                ],
            });
            navigator.mediaSession.setPositionState({
                duration: song.duration ? song.duration : 0,
                position: song.currentTime ? song.currentTime : 0,
            })
        }
    }, [handleSkipSong, songVal, songCreator, image, songRef]);

    return (
        <>
            {!useIsMobile() ? (
                <div className="size-full">
                    <AnimatePresence>
                        {isFullscreenMode && <FullscreenUI {...{ image, currentTimeVal, id, songVal, songCreator, isFullscreenMode, isPlaying, setIsPlaying, showLyricsFullscreen, isLoading }} />}
                    </AnimatePresence>
                    <div
                        className={cn(`z-50 fixed left-1/2 -translate-x-1/2 py-3 px-3 w-full flex items-center transition-all shadow-lg duration-500`,
                            isFullscreenMode ? "bottom-0 rounded-none bg-gradient-to-b from-transparent to-primary-foreground to-100% max-w-full" : "bottom-2 rounded-xl max-w-[95.2vw] bg-primary-foreground/80 backdrop-blur-lg border-2 border-secondary",
                            isFullscreenMode && (isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"),
                            !isFullscreenMode && (appearBar ? 'translate-y-0' : 'translate-y-32'))}
                        id="default-song-controls"
                    >
                        <DesktopSongControls {...necessaryDesktopProps} />
                    </div>
                </div>
            ) : (
                <div>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <div
                                onClick={() => setTutorialNumber((tutorialNumber === 0 || tutorialNumber === 1) ? 1 : 2)}
                                className={cn(`fixed bottom-0.5 rounded-2xl w-full max-w-[92vw]
                                    left-1/2 -translate-x-1/2 bg-primary-foreground/80 backdrop-blur-lg border-2 border-secondsary
                                    flex items-center transition-all duration-500 overflow-hidden shadow-xl`, appearBar ? 'translate-y-0' : 'translate-y-32')}>
                                <MobileSongControls {...necessaryMobileProps} />
                            </div>
                        </DrawerTrigger>
                        <DrawerContent className="max-h-full h-full rounded-t-none">
                            <MiniPlayer
                                albumCover={image}
                                songRef={songRef}
                                songVal={songVal}
                                isPlaying={isPlaying}
                                setIsPlaying={setIsPlaying}
                                songCreator={songCreator}
                                handleSkipSong={handleSkipSong}
                                repeat={repeat}
                                setRepeat={setRepeat}
                                volumeVal={volumeVal}
                                setVolumeVal={setVolumeVal}
                                id={id}
                                isLoading={isLoading}
                                shuffle={shuffle}
                                setShuffle={setShuffle}
                            />
                            <DrawerClose asChild>
                                <button className="absolute right-3 top-2 rounded-full p-2 bg-secondary/50">
                                    <X className="h-4 w-4 text-muted-foreground" strokeWidth={3.5} />
                                </button>
                            </DrawerClose>
                        </DrawerContent>
                    </Drawer>
                </div>
            )}
        </>
    );
};