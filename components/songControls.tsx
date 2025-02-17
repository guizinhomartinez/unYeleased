import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SkipBack, Play, Pause, SkipForward, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Image from 'next/image'
import AlbumCover from '@/components/getAverageColor';

interface songControlsInterface {
    songRef: any,
    songVal: string,
    isPlaying: boolean,
    setIsPlaying: any,
    optionalAppear: boolean,
    volumeVal: number,
    setVolumeVal: any,
    image: string,
    songCreator: string,
    handleSkipSong: (back: boolean) => void,
    appearBar?: boolean,
    setAppearBar?: any,
    setOptAppear?: any,
    id: string,
    showMiniPlayer?: boolean
}

interface miniPlayerInterface {
    appear: boolean,
    setAppear: (value: boolean) => void,
    albumCover: string,
    songRef: any,
    songVal: string,
    isPlaying: boolean,
    setIsPlaying: any,
    optionalAppear: boolean,
    volumeVal?: number,
    setVolumeVal?: any,
    songCreator: string,
    handleSkipSong: (back: boolean) => void,
}

export const SongControls = ({ songRef, songVal, isPlaying, setIsPlaying, optionalAppear, volumeVal, setVolumeVal, image, songCreator, handleSkipSong, id, showMiniPlayer }: songControlsInterface) => {
    const [appearBar, setAppearBar] = useState(true);
    const [optAppear, setOptAppear] = useState(optionalAppear);
    const [mediumScreen, setMediumScreen] = useState(false);
    const [miniPlayer, setShowMiniPlayer] = useState(false);

    useEffect(() => {
        const isScreenSmall = () => {
            if (window.innerWidth < 768)
                setMediumScreen(true)
            else
                setMediumScreen(false)
        }
        isScreenSmall()

        window.addEventListener('resize', isScreenSmall)

        return () => (
            window.addEventListener('resize', isScreenSmall)
        )
    })

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

    return (
        <>
            {!mediumScreen ?
                <div className={`fixed bottom-2 rounded-2xl w-full max-w-[93.5vw]
                    left-1/2 -translate-x-1/2 py-6 px-5 bg-primary-foreground/80 backdrop-blur-lg border-2 border-t-secondary
                        flex items-center transition-all duration-500 shadow-lg ${appearBar ? "translate-y-0" : "translate-y-24"}`}
                    onClick={hideControls} onKeyDown={(e) => pressedKeyOne}
                >
                    <DefaultSongControls
                        songRef={songRef}
                        songVal={songVal.replace(`/song-files/songs/${id}/`, '').replace('.m4a', '')}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        optionalAppear={optionalAppear}
                        volumeVal={volumeVal}
                        setVolumeVal={setVolumeVal}
                        image={image}
                        songCreator={songCreator}
                        handleSkipSong={handleSkipSong}
                        appearBar={appearBar}
                        setAppearBar={setAppearBar}
                        setOptAppear={setOptAppear}
                        id={id}
                        showMiniPlayer={false}
                    />
                </div>
                :
                <div>
                    <MiniPlayer
                        appear={miniPlayer}
                        setAppear={setShowMiniPlayer}
                        albumCover={image}
                        songRef={songRef}
                        songVal={songVal.replace(`/song-files/songs/${id}/`, '').replace('.m4a', '')}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        optionalAppear={optionalAppear}
                        songCreator={songCreator}
                        handleSkipSong={handleSkipSong}
                    />

                    <div
                        className={`fixed bottom-2 rounded-2xl w-full max-w-[93.5vw] left-1/2 -translate-x-1/2
                            py-3 px-3 bg-primary-foreground/80 backdrop-blur-lg border-2 border-t-secondary flex items-center transition-all duration-500 shadow-lg
                                ${appearBar ? "translate-y-0" : "translate-y-24"}`}
                        onClick={() => setShowMiniPlayer(true)}
                    >
                        <SongControlsSmall
                            songRef={songRef}
                            songVal={songVal.replace(`/song-files/songs/${id}/`, '').replace('.m4a', '')}
                            isPlaying={isPlaying}
                            setIsPlaying={setIsPlaying}
                            optionalAppear={optionalAppear}
                            volumeVal={volumeVal}
                            setVolumeVal={setVolumeVal}
                            image={image}
                            songCreator={songCreator}
                            handleSkipSong={handleSkipSong}
                            appearBar={appearBar}
                            setAppearBar={setAppearBar}
                            setOptAppear={setOptAppear}
                            id={id}
                            showMiniPlayer={miniPlayer}
                        />
                    </div>
                </div>
            }
        </>
    );
}

const DefaultSongControls = ({ songRef, songVal, isPlaying, setIsPlaying, optionalAppear, volumeVal, setVolumeVal, image, songCreator, handleSkipSong, appearBar, setAppearBar, setOptAppear, id }: songControlsInterface) => {
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

    return (
        <>
            <div className="flex items-center gap-2 flex-1 select-none" onClick={(e) => e.stopPropagation()}>
                <Image src={image} alt={image} width={60} height={60} className='rounded-lg' />
                <div>
                    <div className='font-bold'>
                        {songVal !== "" ? songVal : 'No Track Found'}
                    </div>
                    <div className='text-sm text-muted-foreground'>{songCreator}</div>
                </div>
            </div>

            <div className="flex justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                <Button
                    size='icon'
                    className={`p-5 rounded-full active:scale-95 ${songVal !== "" ? '' : 'opacity-50 cursor-not-allowed'}`}
                    variant='ghost'
                    onClick={() => handleSkipSong(true)}
                    onKeyDown={() => pressedKeyOne}
                >
                    <SkipBack />
                </Button>
                <Button
                    className={`p-5 rounded-full active:scale-95 ${songVal !== "" ? '' : 'opacity-50 cursor-not-allowed'}`}
                    size="icon"
                    onClick={() => setIsPlaying(songVal !== "" && !isPlaying)}
                    onKeyDown={() => pressedKeyOne}
                >
                    {!isPlaying ? <Play /> : <Pause />}
                </Button>
                <Button
                    size='icon'
                    className={`p-5 rounded-full active:scale-95 ${songVal !== "" ? '' : 'opacity-50 cursor-not-allowed'}`}
                    variant='ghost'
                    onClick={() => handleSkipSong(false)}
                    onKeyDown={() => pressedKeyOne}
                >
                    <SkipForward />
                </Button>
            </div>

            <div className="flex items-center gap-3 flex-1 justify-end w-full select-none" onClick={(e) => e.stopPropagation()}>
                <VolumeSlider className='w-20 md:w-32' />
                <Label>{typeof window !== "undefined" ? localStorage.getItem("volume") : 100}%</Label>
            </div>
        </>
    )
}

const SongControlsSmall = ({ songRef, songVal, isPlaying, setIsPlaying, optionalAppear, volumeVal, setVolumeVal, image, songCreator, handleSkipSong, appearBar, setAppearBar, setOptAppear, id }: songControlsInterface) => {
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

    return (
        <>
            <div className="flex items-center gap-2 flex-1 select-none">
                <Image src={image} alt={image} width={60} height={60} className='rounded-lg' />
                <div>
                    <div className='font-bold'>
                        {songVal !== "" ? songVal : 'No Track Found'}
                    </div>
                    <div className='text-sm text-muted-foreground'>{songCreator}</div>
                </div>
            </div>

            <div className="flex justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                <Button
                    className={`p-5 rounded-full active:scale-95 ${songVal !== "" ? '' : 'opacity-50 cursor-not-allowed'}`}
                    size="icon"
                    onClick={() => setIsPlaying(songVal !== "" && !isPlaying)}
                >
                    {!isPlaying ? <Play /> : <Pause />}
                </Button>
                <Button
                    size='icon'
                    className={`p-5 rounded-full active:scale-95 ${songVal !== "" ? '' : 'opacity-50 cursor-not-allowed'}`}
                    variant='ghost'
                    onClick={() => handleSkipSong(false)}
                >
                    <SkipForward />
                </Button>
            </div>
        </>
    )
}

const MiniPlayer = ({ appear, setAppear, albumCover, isPlaying, setIsPlaying, handleSkipSong, optionalAppear, songCreator, songRef, songVal, setVolumeVal, volumeVal }: miniPlayerInterface) => {
    if (!appear) return null;

    const [sliderValue, setSliderValue] = useState(0);
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [songTime, setSongtime] = useState(0);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
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

        setSongtime(song.duration);

        song.addEventListener("timeupdate", updateTime);

        return () => {
            song.removeEventListener("timeupdate", updateTime);
        };
    }, []);

    function rgbToHex(r: string | any, g: bigint | any, b: any) {
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    }

    const albumAverageColor = AlbumCover(albumCover);
    const albumAverageColorFR = rgbToHex(albumAverageColor[0], albumAverageColor[1], albumAverageColor[2]).toUpperCase();

    return (
        <div className={`overflow-y-auto overflow-x-hidden fixed inset-0 z-[1000] p-8 flex flex-col gap-2 transition-all ${appear ? 'translate-y-0' : 'translate-y-32'}`} style={{ background: `linear-gradient(to bottom, ${albumAverageColorFR}, hsl(var(--primary-foreground)) 60%` }}>
            <Button variant='outline' size='icon' onClick={() => setAppear(false)} className="bg-transparent border-none cursor-pointer absolute top-3 left-3 rounded-full">
                <ChevronDown />
            </Button>
            <div className="justify-center flex flex-col gap-3 mt-6">
                <div className="items-center justify-center flex flex-col">
                    <Image src={albumCover} alt='Album Cover' width={340} height={340} className="rounded-xl shadow-lg" />
                </div>
                <div className="flex flex-col">
                    <div className='text-xl'>{songVal}</div>
                    <div className='text-lg text-muted-foreground'>{songCreator || 'Unknown'}</div>
                </div>
            </div>
            <div className="flex flex-col justify-center gap-4 w-full mt-4" onClick={(e) => e.stopPropagation()}>
                <div className="w-full">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="any"
                        value={sliderValue}
                        className="w-full"
                        readOnly
                    />
                </div>
                <div className="flex justify-between gap-1 items-center">
                    <div className="w-full">{formatTime(currentTimeVal)}</div>
                    <div className="flex gap-2 items-center w-full scale-110">
                        <Button
                            size='icon'
                            className={`p-5 rounded-full active:scale-95 ${songVal !== "" ? '' : 'opacity-50 cursor-not-allowed'}`}
                            variant='ghost'
                            onClick={() => handleSkipSong(true)}
                        >
                            <SkipBack />
                        </Button>
                        <Button
                            className={`p-5 rounded-full active:scale-95 ${songVal !== "" ? '' : 'opacity-50 cursor-not-allowed'}`}
                            size="icon"
                            onClick={() => setIsPlaying(songVal !== "" && !isPlaying)}
                        >
                            {!isPlaying ? <Play /> : <Pause />}
                        </Button>
                        <Button
                            size='icon'
                            className={`p-5 rounded-full active:scale-95 ${songVal !== "" ? '' : 'opacity-50 cursor-not-allowed'}`}
                            variant='ghost'
                            onClick={() => handleSkipSong(false)}
                        >
                            <SkipForward />
                        </Button>
                    </div>
                    <div className="w-full translate-x-[4.2em]">{formatTime(songTime)}</div>
                </div>
            </div>
            <div className="w-full h-full rounded-xl px-4 py-3 mt-8" style={{ background: albumAverageColorFR }}>
                <div className="text-lg font-bold">Lyrics</div>
                <div className="text-primary/80">
                    <div>
                        WIP
                    </div>
                </div>
            </div>
        </div>
    )
}

type SliderProps = React.ComponentProps<typeof Slider>

function VolumeSlider({ className, ...props }: SliderProps) {
    return (
        <Slider
            defaultValue={[100]}
            max={100}
            step={1}
            className={cn("w-32", className)}
            {...props}
        />
    )
}