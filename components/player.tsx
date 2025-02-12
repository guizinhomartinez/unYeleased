"use client"

import Image from "next/image";
import { ChevronLeft, Divide, Dot, Pause, Play, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { HandleTransition } from "@/components/handleTransition";
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

export function Player({ image, text, subtext, songVal, backgroundLore = "Lorem ipsum", linkToGenius = "https://genius.com/Ty-dolla-sign-wheels-fall-off-lyrics" }: { image: string; text: string; subtext: string; songVal: string, backgroundLore: string, linkToGenius: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const songRef = useRef<HTMLAudioElement | null>(null);
    const [volumeVal, setVolumeVal] = useState(30);
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [songTime, setSongtime] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showLyrics, setShowLyrics] = useState(false);

    const content = [
        {
            image: image,
            text: text,
            subtext: subtext,
        },
    ]

    useEffect(() => {
        if (!songRef.current) {
            songRef.current = new Audio(songVal);
        }
        const song = songRef.current;

        if (isPlaying) {
            song.play();
        } else {
            song.pause();
        }

        return () => {
            song.pause();
        };
    }, [isPlaying]);

    useEffect(() => {
        if (songRef.current) {
            songRef.current.volume = volumeVal / 100; // Convert 0-100 to 0.0-1.0
        }
    }, [volumeVal]);

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

    useEffect(() => {
        const song = songRef.current;
        if (!song) return;

        song.onloadedmetadata = () => {
            setSongtime(song.duration);
        };

        return () => {
            song.onloadedmetadata = null;
        };
    }, []);

    window.onkeydown = (e) => {
        if (e.key === "s") {
            handleClick();
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    const handleClick = () => {
        const songExplanation = document.querySelector(".song-explanation-real")
        if (!showExplanation) {
            songExplanation?.classList.remove("song-explanation");
            songExplanation?.classList.add("song-explanation-disappear")
            setShowExplanation(!showExplanation)
        } else {
            songExplanation?.classList.add("song-explanation");
            songExplanation?.classList.remove("song-explanation-disappear")
            setShowExplanation(!showExplanation)
        }
    }

    useEffect(() => {
        if (document.querySelector('.lore-tab')) {
            document.querySelector('.tab-1')?.classList.add('active');
            document.querySelector('.tab-2')?.classList.remove('active');
        } else if (document.querySelector('.lyrics-tab')) {
            document.querySelector('.tab-1')?.classList.remove('active');
            document.querySelector('.tab-2')?.classList.add('active');
        }
    }, [showLyrics])

    const changeTab = (firstTab: boolean) => {
        setShowLyrics(firstTab);
    }
    
    const InfoCard = () => {
        return (
            <div className="flex flex-col h-screen flex-1 md:mt-28 mt-24 md:max-w-[45%] m-2 pb-4 md:mr-12 md:pb-0 song-explanation song-explanation-real">
                <div className="border-2 border-black flex flex-col h-fit pb-4">
                    <div className="flex border-b-2 border-b-black relative justify-between w-full flex-grow">
                        <button className={`yeezy-button uppercase w-full py-3 tab-1 active`} onClick={() => changeTab(true)}>Song explanation</button>
                        <button className="yeezy-button uppercase w-full py-3 tab-2" onClick={() => changeTab(false)}>Lyrics</button>
                        <div className="cursor-pointer absolute -right-4 -top-4 rounded-full bg-white border-2 border-black p-0.5" onClick={() => handleClick()}><X /></div>
                    </div>
                    {showLyrics ? <p className="p-2 no-uppercase-letters lore-tab">{backgroundLore}</p> : <p className="p-2 lyrics-tab">banana</p>}
                    <div className="p-2 pt-12 md:pt-6 pb-6 border-b-2 border-black text-center">All descriptions are not mine, these are from Genius.com. Please, go to the original site below for more information about the song.</div>
                    <a href={linkToGenius} className="pl-2 pt-4 mx-auto">
                        <button className="p-2 text-blue-600 antialiased active:scale-95 uppercase transition-all duration-150">More information</button>
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <div className="flex flex-1 flex-grow">
                <div className="flex flex-col justify-center items-center gap-0 md:gap-16 flex-1">
                    <div className="absolute top-0 left-0 inline-flex items-center">
                        <HandleTransition href="/">
                            <div className="bg-transparent shadow-none text-foreground group-hover:bg-none group-hover:text-foreground flex gap-2 p-4"><ChevronLeft /> Go back</div>
                        </HandleTransition>
                        <Dot className="-ml-3" />
                        <div>Press S to see song information</div>
                    </div>
                    {content.map((thing, index) => (
                        <div className="flex flex-col w-fit" key={index}>
                            <Image src={thing.image} alt={thing.subtext} width={300} height={300} className="cursor-pointer mx-auto w-auto h-auto" id="image-cover" onClick={() => { setIsPlaying(!isPlaying); }} />
                            <div className="flex flex-col">
                                <div>
                                    <div className="text-center text-xl">{thing.text}</div>
                                    <div className="text-center opacity-80 text-md">{thing.subtext}</div>
                                </div>
                                <div className="flex mx-auto">
                                    <div className="text-md opacity-60 text-center">{formatTime(currentTimeVal)}</div>
                                    <Dot className="opacity-60" />
                                    <div className="text-md opacity-60 text-center">{formatTime(songTime)}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex flex-col gap-4 mb-6 mt-12 md:mt-0">
                        <div className="mx-auto">
                            <button className="yeezy-buttons bg-white hover:bg-primary hover:text-white" onClick={() => handleClick()}>
                                Song explanation
                            </button>
                        </div>
                        <div className="flex gap-2 mx-auto">
                            <div className="yeezy-buttons flex justify-center items-center cursor-pointer hover:bg-primary hover:text-white" onClick={() => { setIsPlaying(!isPlaying); }}>
                                {!isPlaying ? <Play /> : <Pause />}
                            </div>
                        </div>
                        <div className="flex gap-4 mx-auto">
                            <VolumeSlider onValueChange={(e) => {
                                setVolumeVal(e[0]); // Update the state
                            }} />
                            <Label>Volume: {volumeVal}%</Label>
                        </div>
                    </div>
                </div>
            </div>
            {showExplanation && <InfoCard />}
        </div>
    );
}

type SliderProps = React.ComponentProps<typeof Slider>

function VolumeSlider({ className, ...props }: SliderProps) {
    return (
        <Slider
            defaultValue={[30]}
            max={100}
            step={1}
            className={cn("w-48", className)}
            {...props}
        />
    )
}