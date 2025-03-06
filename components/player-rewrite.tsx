"use client"

import Image from "next/image";
import { BookOpenText, ChevronLeft, Dot, ExternalLink, Pause, Play, Share, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { HandleTransition } from "@/components/handleTransition";
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider";
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import ShareSong from "./shareSong";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function Player({ image, text, subtext, songVal, backgroundLore = "Lorem ipsum", linkToGenius = "https://genius.com/Ty-dolla-sign-wheels-fall-off-lyrics", lyrics = "banana" }: { image: string; text: string; subtext: string; songVal: string, backgroundLore: string, linkToGenius: string, lyrics: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [songTime, setSongtime] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const songRef = useRef<HTMLAudioElement | null>(null);
    const [showKeybind, setShowKeybind] = useState(true);
    const [showLyrics, setShowLyrics] = useState(false);
    const [volumeVal, setVolumeVal] = useState(100);
    const [sliderValue, setSliderValue] = useState(0);

    useEffect(() => {
        const storedVolume = localStorage.getItem("volume") || 100;
        setVolumeVal(Number(storedVolume));
    }, []);

    useEffect(() => {
        if (!songRef.current) return;

        if (isPlaying) {
            songRef.current.play();
        } else {
            songRef.current.pause();
        }

        return () => {
            songRef.current?.pause();
        };
    }, [isPlaying]);

    useEffect(() => {
        const song = songRef.current;
        if (!song) return;

        localStorage.setItem("volume", volumeVal.toString());

        const localVolume = localStorage.getItem("volume");

        if (localVolume === null) {
            song.volume = volumeVal / 100;
        } else {
            song.volume = Number(localVolume) / 100;
        }
    }, [volumeVal, isPlaying]);

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
    }, [songVal, isPlaying]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    const handleClick = () => setShowExplanation(!showExplanation);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "s") {
                handleClick();
            }
            if (e.key === " ") {
                e.preventDefault();
                setIsPlaying(!isPlaying);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleClick]);

    useEffect(() => {
        if (window.innerWidth < 768) {
            return setShowKeybind(false);
        } else {
            return setShowKeybind(true);
        }
    }, [])

    const [parent] = useAutoAnimate();

    const handleSliderChange = (value: number[]) => {
        const newValue = value[0];
        setSliderValue(newValue)
        if (songRef.current) {
            const newTime = (newValue / 100) * songRef.current.duration;
            songRef.current.currentTime = newTime;
            setCurrentTimeVal(newTime);
        }
    }

    useEffect(() => {
        if (songVal) {
            try {
                songRef.current = new Audio(songVal);
            } catch (e) {
                console.log(e);
            }
        }
    }, [songVal]);

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen" ref={parent}>
            <Navbar text={text} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
            <div className="flex flex-1 flex-grow">
                <div className="flex flex-col justify-center items-center gap-0 md:gap-16 flex-1">
                    <div className="absolute top-2 left-2 inline-flex items-center">
                        <HandleTransition href="/">
                            <Button className="" size='icon' variant='ghost'><ChevronLeft /></Button>
                        </HandleTransition>
                        <Dot className={`mr-1 ${!showKeybind && 'hidden'}`} />
                        <div className={`flex gap-2 items-center ${!showKeybind && 'hidden'}`}>
                            <div className="w-7 h-7 rounded-md border border-primary/15 bg-secondary text-sm shadow-md flex justify-center items-center">
                                <div>S</div>
                            </div>
                            For Song Info
                        </div>
                    </div>
                    <div className={`flex flex-col w-full h-full md:w-[55vw] translate-y-14`}>
                        <Image src={image} alt={subtext} width={300} height={300} className="cursor-pointer mx-auto w-auto h-auto rounded-xl shadow-lg" id="image-cover" onClick={() => { setIsPlaying(!isPlaying); }} />
                        <div className="flex flex-col mt-7">
                            <div className="flex justify-center items-center">
                                <div className="mr-24">
                                    <div className="text-2xl font-bold">{text}</div>
                                    <div className="text-primary/50 text-md">{subtext}</div>
                                </div>
                                <div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="rounded-full" variant='secondary' size='icon' disabled={!songRef.current} id="share-button">
                                                <Share />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Share song</DialogTitle>
                                            </DialogHeader>
                                            <ShareSong />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                            <div className="flex mx-auto gap-2 mt-4">
                                <div className="text-md opacity-60 w-12 text-right">{formatTime(currentTimeVal)}</div>
                                <Slider value={[sliderValue]} max={100} step={1} className="w-[18.5em] [&>:last-child>span]:bg-primary" onValueChange={handleSliderChange} />
                                <div className="text-md opacity-60 text-center w-12">{formatTime(songTime)}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`flex flex-col gap-4 mb-6 mt-12 md:mt-0 h-full translate-y-14`}>
                        <div className="mx-auto flex flex-col gap-4">
                            <div className="mx-auto">
                                <Button className="p-5 rounded-full  dark:bg-secondary dark:text-secondary-foreground" size="icon" onClick={() => { setIsPlaying(!isPlaying); }}>
                                    {!isPlaying ? <Play /> : <Pause />}
                                </Button>
                            </div>
                            <Button className="rounded-full  dark:bg-secondary dark:text-secondary-foreground" onClick={() => handleClick()}>
                                <BookOpenText />
                                Song explanation
                            </Button>
                        </div>
                        <div className="flex gap-4 mx-auto">
                            <VolumeSlider className="w-48" value={[Number(volumeVal)]} onValueChange={(val) => setVolumeVal(val[0])} />
                            <Label>{volumeVal}%</Label>
                        </div>
                    </div>
                </div>
            </div>
            {showExplanation && <InfoCard backgroundLore={backgroundLore} linkToGenius={linkToGenius} lyrics={lyrics} onClose={handleClick} />}
        </div>
    );
}

const InfoCard = ({
    backgroundLore,
    linkToGenius,
    lyrics,
    onClose,
}: {
    backgroundLore: string;
    linkToGenius: string;
    lyrics: string;
    onClose: () => void;
}) => {
    const formattedLyrics = lyrics.split('\n').map((line, index) => {
        if (line.trim() === '') {
            return <div key={index} className="mb-8"></div>;
        } else {
            return (
                <div key={index} className="mb-0.5">
                    <div>{line}</div>
                </div>
            );
        }
    });

    const styles = "p-6 no-uppercase-letters lore-tab";

    return (
        <div className={`flex flex-col h-screen flex-1 md:mt-14 mt-24 md:max-w-[45%] m-7 pb-4 md:mr-12 md:pb-0`}>
            <div className="flex flex-col h-fit pb-4 p-4 py-8 md:p-8 bg-secondary/10 rounded-xl">
                <div className="flex relative justify-between w-full flex-grow">
                    <div className="cursor-pointer absolute -right-2 -top-6 md:-right-6 rounded-full text-muted-foreground/80" onClick={onClose}>
                        <X size='20' />
                    </div>
                </div>
                <Tabs defaultValue="explanation" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-full">
                        <TabsTrigger value="explanation" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">See Explanation</TabsTrigger>
                        <TabsTrigger value="lyrics" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Lyrics</TabsTrigger>
                    </TabsList>
                    <TabsContent value="explanation" className="bg-primary-foreground rounded-xl mx-0.5 border-2 border-secondary">
                        <p className={`${styles}`}>{backgroundLore}</p>
                    </TabsContent>
                    <TabsContent value="lyrics" className="bg-primary-foreground rounded-xl mx-0.5 border-2 border-secondary">
                        <div className={`${styles} lyrics-tab h-[80vh]`}>
                            <ScrollArea className="h-[73vh] w-full">
                                {formattedLyrics}
                            </ScrollArea>
                        </div>
                    </TabsContent>
                </Tabs>
                <div className="flex flex-col gap-6 justify-center items-center rounded-xl bg-primary-foreground/50 border border-secondary mt-4 mx-0.5 p-4">
                    <div className="text-primary/50">
                        All descriptions and lyrics are from Genius.com. Please, check them out by clicking the button below.
                    </div>
                    <a href={linkToGenius} className="" target="_blank">
                        <Button variant={"secondary"} className="antialiased items-center  transition-all duration-150">
                            Original Link
                            <ExternalLink />
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
};

const Navbar = ({ text, isPlaying, setIsPlaying }: { text: string, isPlaying: boolean, setIsPlaying: any }) => {
    const [showNavbar, setShowNavbar] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowNavbar(true);
            } else {
                setShowNavbar(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`flex justify-between items-center fixed border border-secondary w-[86vw] md:w-[95vw] h-12 px-1 bg-primary-foreground/50 backdrop-blur-md z-[500] shadow-lg transition-all duration-500 my-1.5 left-1/2 -translate-x-1/2 rounded-full ${!showNavbar ? '-translate-y-12 opacity-0' : ''}`}>
            <Button variant="outline" className="bg-transparent rounded-full border-none text-lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{text}</Button>
            <Button variant="outline" className="bg-transparent px-3.5 py-5 rounded-full border-none text-primary" onClick={() => { setIsPlaying(!isPlaying); }}>
                {!isPlaying ? <Play fill="#fff" /> : <Pause fill="#fff" />}
            </Button>
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
            className={cn("w-full", className)}
            {...props}
        />
    );
}