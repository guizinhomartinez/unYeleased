import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SkipBack, Play, Pause, SkipForward, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import AlbumCover from "@/components/getAverageColor";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Progress } from "./ui/progress";

interface songControlsInterface {
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
    appearBar?: boolean;
    setAppearBar?: any;
    setOptAppear?: any;
    id: string;
}

interface miniPlayerInterface {
    albumCover: string;
    songRef: any;
    songVal: string;
    isPlaying: boolean;
    setIsPlaying: any;
    optionalAppear: boolean;
    volumeVal?: number;
    setVolumeVal?: any;
    songCreator: string;
    handleSkipSong: (back: boolean) => void;
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
    id
}: songControlsInterface) => {
    const [appearBar, setAppearBar] = useState(true);
    const [optAppear, setOptAppear] = useState(optionalAppear);
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

    const pressedKeyOne = useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "j") {
                handleSkipSong(true);
            }
            if (e.key === "l") {
                handleSkipSong(false);
            }
            if (e.key === "k") {
                setIsPlaying(!isPlaying);
            }
            if (e.key === "h") {
                hideControls();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleSkipSong, hideControls]);

    const [sliderValue, setSliderValue] = useState(0);

    function hideControls() {
        setAppearBar(!appearBar);
        setOptAppear(appearBar);
    }

    function handleTogglePlayback() {
        if (!songRef.current || songVal == "") return;
        if (songRef.current.paused) {
            songRef.current.play();
            setIsPlaying(true);
        } else {
            songRef.current.pause();
            setIsPlaying(false);
        }
    }

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
            {!mediumScreen ? (
                <div
                    className={`fixed bottom-2 rounded-2xl w-full max-w-[93.5vw]
                    left-1/2 -translate-x-1/2 py-6 px-5 bg-primary-foreground/80 backdrop-blur-lg border-2 border-t-secondary
                        flex items-center transition-all duration-500 shadow-lg ${appearBar ? "translate-y-0" : "translate-y-24"
                        }`}
                    // onClick={hideControls}
                    onKeyDown={(e) => pressedKeyOne}
                >
                    <DefaultSongControls
                        songRef={songRef}
                        songVal={songVal
                            .replace(`/song-files/songs/${id}/`, "")
                            .replace(".m4a", "")}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        optionalAppear={optionalAppear}
                        volumeVal={volumeVal}
                        setVolumeVal={setVolumeVal}
                        image={image}
                        songCreator={songCreator}
                        handleSkipSong={handleSkipSong}
                        appearBar={appearBar}
                        setOptAppear={setOptAppear}
                        id={id}
                    />
                </div>
            ) : (
                <div>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <div
                                className={`fixed bottom-2 rounded-2xl w-full max-w-[93.5vw] left-1/2 -translate-x-1/2
                            py-3 px-3 bg-primary-foreground/80 backdrop-blur-lg border-2 border-secondary flex items-center transition-all duration-500 shadow-lg
                                ${appearBar ? "translate-y-0" : "translate-y-24"
                                    }`}
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
                                    appearBar={appearBar}
                                    setOptAppear={setOptAppear}
                                    id={id}
                                />
                                <Progress
                                    value={sliderValue}
                                    className="w-[96%] absolute bottom-1 left-2 transition-all duration-1000"
                                />
                            </div>
                        </DrawerTrigger>
                        <DrawerContent className="">
                            <MiniPlayer
                                albumCover={image}
                                songRef={songRef}
                                songVal={songVal}
                                isPlaying={isPlaying}
                                setIsPlaying={setIsPlaying}
                                optionalAppear={appearBar}
                                songCreator={songCreator}
                                handleSkipSong={handleSkipSong}
                            />
                            {/* <Button className="w-fit mx-auto m-12 opacity-0">My balls</Button> */}
                        </DrawerContent>
                    </Drawer>
                </div>
            )}
        </>
    );
};

const DefaultSongControls = ({
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
    appearBar,
    setAppearBar,
    setOptAppear,
    id
}: songControlsInterface) => {
    const [sliderValue, setSliderValue] = useState(0);
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [songTime, setSongtime] = useState(0);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    };

    const useEffectConst = () => {
        const song = songRef.current;
        if (!song) return;

        const updateTime = () => {
            if (song.duration) {
                setSliderValue((song.currentTime / song.duration) * 100);
            }
            setCurrentTimeVal(song.currentTime);
        };

        setSongtime(song.duration);

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

    function hideControls() {
        setAppearBar(!appearBar);
        setOptAppear(appearBar);
    }

    function handleTogglePlayback() {
        if (!songRef.current || songVal == "") return;
        if (songRef.current.paused) {
            songRef.current.play();
            setIsPlaying(true);
        } else {
            songRef.current.pause();
            setIsPlaying(false);
        }
    }

    const pressedKeyOne = useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "j") {
                handleSkipSong(true);
            }
            if (e.key === "l") {
                handleSkipSong(false);
            }
            if (e.key === "k") {
                setIsPlaying(!isPlaying);
            }
            if (e.key === "h") {
                hideControls();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleSkipSong, hideControls]);

    console.log(songTime);

    return (
        <>
            <div className="flex w-full justify-between items-center">
                <div className="flex items-center gap-2 select-none w-full">
                    <Image src={image} alt={image} width={80} height={80} className="rounded-lg" />
                    <div>
                        <div className="font-bold">
                            {songVal !== "" ? songVal : "No Track Found"}
                        </div>
                        <div className="text-sm text-muted-foreground">{songCreator}</div>
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-3">
                    <div className="flex justify-center gap-2 ml-2">
                        <Button
                            size="icon"
                            className={`p-6 rounded-full ${songVal !== "" ? "" : "opacity-50 cursor-not-allowed"}`}
                            variant="ghost"
                            onClick={() => handleSkipSong(true)}
                            onKeyDown={() => pressedKeyOne}
                        >
                            <SkipBack />
                        </Button>
                        <Button
                            className={`p-6 rounded-full ${songVal !== "" ? "" : "opacity-50 cursor-not-allowed"}`}
                            size="icon"
                            onClick={() => setIsPlaying(songVal !== "" && !isPlaying)}
                            onKeyDown={() => pressedKeyOne}
                        >
                            {!isPlaying ? <Play /> : <Pause />}
                        </Button>
                        <Button
                            size="icon"
                            className={`p-6 rounded-full ${songVal !== "" ? "" : "opacity-50 cursor-not-allowed"}`}
                            variant="ghost"
                            onClick={() => handleSkipSong(false)}
                            onKeyDown={() => pressedKeyOne}
                        >
                            <SkipForward />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground/80 w-8 text-right">{formatTime(currentTimeVal)}</div>
                        <Progress
                            value={sliderValue}
                            className="w-72 transition-all"
                        />
                        <div className="text-sm text-muted-foreground/80">{isNaN(songTime) ? '00:00' : formatTime(songTime)}</div>
                    </div>
                </div>

                <div
                    className="flex items-center gap-3 justify-end w-full select-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    <VolumeSlider className="w-20 md:w-32" />
                    <Label>
                        {typeof window !== "undefined" ? localStorage.getItem("volume") : 100}
                        %
                    </Label>
                </div>
            </div>
        </>
    );
};

const SongControlsSmall = ({
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
    appearBar,
    setAppearBar,
    setOptAppear,
    id,
}: songControlsInterface) => {
    return (
        <>
            <div className="flex items-center gap-2 flex-1 select-none mb-2">
                <Image
                    src={image}
                    alt={image}
                    width={60}
                    height={60}
                    className="rounded-lg"
                />
                <div>
                    <div className="font-bold overflow-hidden whitespace-nowrap text-ellipsis w-[47vw]">
                        {songVal !== "" ? songVal : "No Track Found"}
                    </div>
                    <div className="text-sm text-muted-foreground">{songCreator}</div>
                </div>
            </div>

            <div
                className="flex justify-center gap-1 mb-2"
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    className={`p-5 rounded-full ${songVal !== "" ? "" : "opacity-50 cursor-not-allowed"}`}
                    size="icon"
                    onClick={() => setIsPlaying(songVal !== "" && !isPlaying)}
                >
                    {!isPlaying ? <Play size='36' /> : <Pause size='36' />}
                </Button>
                <Button
                    size="icon"
                    className={`p-5 rounded-full ${songVal !== "" ? "" : "opacity-50 cursor-not-allowed"}`}
                    variant="ghost"
                    onClick={() => handleSkipSong(false)}
                >
                    <SkipForward />
                </Button>
            </div>
        </>
    );
};

const MiniPlayer = ({
    albumCover,
    isPlaying,
    setIsPlaying,
    handleSkipSong,
    optionalAppear,
    songCreator,
    songRef,
    songVal,
    setVolumeVal,
    volumeVal,
}: miniPlayerInterface) => {
    const [sliderValue, setSliderValue] = useState(0);
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [songTime, setSongtime] = useState(0);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    };

    const useEffectConst = () => {
        const song = songRef.current;
        if (!song) return;

        const updateTime = () => {
            if (song.duration) {
                setSliderValue((song.currentTime / song.duration) * 100);
            }
            setCurrentTimeVal(song.currentTime);
        };

        setSongtime(song.duration);

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
        <div
            className={`overflow-y-auto overflow-x-hidden p-8 flex flex-col gap-2 transition-all bg-primary-foreground`}
        >
            {/* <Button variant='outline' size='icon' onClick={() => setAppear(false)} className="bg-transparent border-none cursor-pointer absolute top-3 left-3 rounded-full">
                <ChevronDown />
            </Button> */}
            <div className="flex flex-col gap-4 mt-0">
                <div className="flex flex-col relative">
                    {/* <div className="w-[340px] h-[340px] bg-black/50 absolute inset-0 left-0.5 rounded-xl"></div> */}
                    <Image
                        src={albumCover}
                        alt="Album Cover"
                        width={345}
                        height={340}
                        className="rounded-xl shadow-lg"
                    />
                </div>
                <div className="flex flex-col">
                    <div className="text-xl font-bold">{songVal || "Unknown"}</div>
                    <div className="text-lg text-muted-foreground -translate-y-1">
                        {songCreator || "Unknown"}
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center gap-8 w-full mt-10">
                <div className="w-full">
                    <Progress
                        value={sliderValue}
                        className="w-full transition-all"
                    />
                </div>
                <div className="flex gap-1 items-center">
                    <div className="w-full">{formatTime(currentTimeVal)}</div>
                    <div className="flex gap-2 items-center w-full scale-110">
                        <Button
                            size="icon"
                            className={`p-6 rounded-full  ${songVal !== "" ? "" : "opacity-50 cursor-not-allowed"
                                }`}
                            variant="ghost"
                            onClick={() => handleSkipSong(true)}
                        >
                            <SkipBack size='32' />
                        </Button>
                        <Button
                            className={`p-6 rounded-full  ${songVal !== "" ? "" : "opacity-50 cursor-not-allowed"
                                }`}
                            size="icon"
                            onClick={() => setIsPlaying(songVal !== "" && !isPlaying)}
                        >
                            {!isPlaying ? <Play size='32' /> : <Pause size='32' />}
                        </Button>
                        <Button
                            size="icon"
                            className={`p-6 rounded-full  ${songVal !== "" ? "" : "opacity-50 cursor-not-allowed"
                                }`}
                            variant="ghost"
                            onClick={() => handleSkipSong(false)}
                        >
                            <SkipForward size='32' />
                        </Button>
                    </div>
                    <div className="w-full text-right">
                        {isNaN(songTime) ? '00:00' : formatTime(songTime)}
                    </div>
                </div>
            </div>
            {/* <div
                className="w-full h-full rounded-xl px-4 py-3 mt-8"
                style={{ background: albumAverageColorFR }}
            >
                <div className="text-lg font-bold">Lyrics</div>
                <div className="text-primary/80">
                    <div>WIP</div>
                </div>
            </div> */}
            <div className="w-full h-20" />
        </div>
    );
};

type SliderProps = React.ComponentProps<typeof Slider>;

function VolumeSlider({ className, ...props }: SliderProps) {
    return (
        <Slider
            defaultValue={[100]}
            max={100}
            step={1}
            className={cn("w-32", className)}
            {...props}
        />
    );
}
