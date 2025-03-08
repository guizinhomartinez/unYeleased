import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { MiniPlayer } from "./songControlsSubcomponents/miniPlayer";
import { SongControlsSmall } from "./songControlsSubcomponents/songControlsSmall";
import { DefaultSongControls } from "./songControlsSubcomponents/DefaultSongControls";
import { useIsMobile } from "@/hooks/use-mobile";

export interface songControlsInterface {
    songRef: any;
    songVal: string;
    isPlaying: boolean;
    setIsPlaying: Dispatch<SetStateAction<boolean>>;
    volumeVal: number;
    setVolumeVal: any;
    image: string;
    songCreator: string;
    handleSkipSong: (back: boolean) => void;
    repeat: number;
    setRepeat: Dispatch<SetStateAction<number>>;
    id: string;
    albumName?: string;
}

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
    albumName
}: songControlsInterface) => {
    const [currentTimeVal, setCurrentTimeVal] = useState(0);

    useEffect(() => {
        const song = songRef.current;
        if (!song) return;

        const updateTime = () => {
            setCurrentTimeVal(song.currentTime);
        };

        song.addEventListener("timeupdate", updateTime);

        return () => {
            song.removeEventListener("timeupdate", updateTime);
        };
    }, []);

    // this basically just adds support for stuff like media buttons and mobile media players in notification tray

    // had never heard of this before but i guess better late than never
    useEffect(() => {
        const song = songRef.current;
        if (!song) return;

        if ("mediaSession" in navigator) {
            navigator.mediaSession.setActionHandler("play", () => setIsPlaying(true));
            navigator.mediaSession.setActionHandler("pause", () => setIsPlaying(false));
            navigator.mediaSession.setActionHandler("previoustrack", () => handleSkipSong(true));
            navigator.mediaSession.setActionHandler("nexttrack", () => handleSkipSong(false));

            navigator.mediaSession.metadata = new MediaMetadata({
                title: songVal || "No Track Found",
                artist: songCreator || "Unknown",
                album: albumName || id,
                artwork: [
                    {
                        src: image,
                        sizes: '96x96,128x128,192x192',
                        type: "image/jpeg",
                    },
                ],
            });
            try {
                navigator.mediaSession.setPositionState({
                    duration: songRef.current.duration || 0,
                    position: currentTimeVal || 0,
                })
            } catch (e) {
                console.log(e);
            }
        }
    }, [handleSkipSong, songVal, songCreator, image, songRef, currentTimeVal]);

    return (
        <>
            {!useIsMobile() ? (
                <div
                    className={`fixed bottom-2 rounded-2xl w-full max-w-[95.5vw]
                    left-1/2 -translate-x-1/2 py-3 px-3 bg-primary-foreground/80 backdrop-blur-lg border-2 border-secondary
                    flex items-center transition-all duration-500 shadow-lg`}
                >
                    <DefaultSongControls
                        songRef={songRef}
                        songVal={songVal}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        volumeVal={volumeVal}
                        setVolumeVal={setVolumeVal}
                        image={image}
                        songCreator={songCreator}
                        handleSkipSong={handleSkipSong}
                        repeat={repeat}
                        setRepeat={setRepeat}
                        id={id}
                    />
                </div>
            ) : (
                <div>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <div
                                className={`fixed bottom-2 rounded-2xl w-full max-w-[92vw] left-1/2 -translate-x-1/2
                                    bg-primary-foreground/80 backdrop-blur-lg border-2 border-secondary flex items-center
                                    transition-all duration-500 shadow-lg overflow-hidden`}
                            >
                                <SongControlsSmall
                                    songRef={songRef}
                                    songVal={songVal}
                                    isPlaying={isPlaying}
                                    setIsPlaying={setIsPlaying}
                                    volumeVal={volumeVal}
                                    setVolumeVal={setVolumeVal}
                                    image={image}
                                    songCreator={songCreator}
                                    handleSkipSong={handleSkipSong}
                                    repeat={repeat}
                                    setRepeat={setRepeat}
                                    id={id}
                                />
                            </div>
                        </DrawerTrigger>
                        <DrawerContent className="max-h-[100%] h-[100%] rounded-t-none">
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
                            />
                            {/* <Button className="w-fit mx-auto m-12 opacity-0">My balls</Button> */}
                        </DrawerContent>
                    </Drawer>
                </div>
            )}
        </>
    );
};