import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { MiniPlayer } from "./songControlsSubcomponents/miniPlayer";
import { SongControlsSmall } from "./songControlsSubcomponents/songControlsSmall";
import { DefaultSongControls } from "./songControlsSubcomponents/DefaultSongControls";

export interface songControlsInterface {
    songRef: any;
    songVal: string;
    isPlaying: boolean;
    setIsPlaying: any;
    optionalAppear: boolean;
    volumeVal: number;
    setVolumeVal: any;
    image: string;
    songCreator: string;
    handleSkipSong: (back: boolean) => void;
    repeat: number;
    setRepeat: any;
    id: string;
}

export const SongControls = ({
    songRef,
    songVal,
    isPlaying,
    setIsPlaying,
    optionalAppear,
    volumeVal,
    setVolumeVal,
    image,
    songCreator,
    handleSkipSong,
    repeat,
    setRepeat,
    id
}: songControlsInterface) => {
    const [mediumScreen, setMediumScreen] = useState(false);

    useEffect(() => {
        const isScreenSmall = () => {
            if (window.innerWidth < 768) setMediumScreen(true);
            else setMediumScreen(false);
        };
        isScreenSmall();

        window.addEventListener("resize", isScreenSmall);

        return () => window.addEventListener("resize", isScreenSmall);
    });

    // this basically just adds support for stuff like media buttons and mobile media players in notification tray

    // had never heard of this before but i guess better late than never
    useEffect(() => {
        const song = songRef.current;
        if (!song) return;

        if ("mediaSession" in navigator) {
            try {
                navigator.mediaSession.setActionHandler("play", () => setIsPlaying(true));
                navigator.mediaSession.setActionHandler("pause", () => setIsPlaying(false));
                navigator.mediaSession.setActionHandler("previoustrack", () => handleSkipSong(true));
                navigator.mediaSession.setActionHandler("nexttrack", () => handleSkipSong(false));

                navigator.mediaSession.metadata = new MediaMetadata({
                    title: songVal,
                    artist: songCreator,
                    album: "Yandhi",
                    artwork: [
                        {
                            src: image,
                            sizes: "96x96",
                            type: "image/jpg",
                        },
                    ],
                });

                navigator.mediaSession.setPositionState({
                    duration: songRef.current.duration || 0,
                    position: songRef.current.currentTime || 0,
                })
            } catch (e) {
                console.log(e);
            }
        }
    }, [handleSkipSong, songVal, songCreator, image, songRef]);

    return (
        <>
            {!mediumScreen ? (
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
                        optionalAppear={optionalAppear}
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
                                    optionalAppear={optionalAppear}
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