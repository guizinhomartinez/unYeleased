"use client"

import Image from "next/image";
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button";
import { ChevronLeft, Dot, Pause, Play } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { HandleTransition } from "@/components/handleTransition";

const content = [
    {
        image: "/covers/chrome-wheel.jpg",
        text: "Wheels Fall Off",
        subtext: "Full Version - AKA WFO-O1",
    },
]

export default function WheelsFallOfFull() {
    const [isPlaying, setIsPlaying] = useState(false);
    const songRef = useRef<HTMLAudioElement | null>(null);
    const [volumeVal, setVolumeVal] = useState(30);
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [songTime, setSongtime] = useState(0);

    useEffect(() => {
        if (!songRef.current) {
            songRef.current = new Audio("/songs/Wheels_REF_2.6.25.___REF.m4a");
        }
        const song = songRef.current;

        if (isPlaying) {
            song.play();
        } else {
            song.pause();
        }

        return () => {
            song.pause(); // Ensure it stops when the component unmounts
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

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    return (
        <div className="flex flex-col justify-center items-center gap-16">
            <div className="absolute top-0 left-0">
                <HandleTransition href="/">
                    <div className="bg-transparent shadow-none text-foreground group-hover:bg-none group-hover:text-foreground flex gap-2 p-4"><ChevronLeft /> Go back</div>
                </HandleTransition>
            </div>
            {content.map((thing, index) => (
                <div className="flex flex-col w-fit" key={index}>
                    <Image src={thing.image} alt={thing.subtext} width={500} height={500} className="cursor-pointer" onClick={() => { setIsPlaying(!isPlaying); }} />
                    <div className="flex flex-col -translate-y-8">
                        <div className="text-center text-xl">{thing.text}</div>
                        <div className="text-center opacity-80 text-md">{thing.subtext}</div>
                        <div className="flex mx-auto translate-y-6">
                            <div className="text-md opacity-60 text-center">{formatTime(currentTimeVal)}</div>
                            <Dot className="opacity-60" />
                            <div className="text-md opacity-60 text-center">{formatTime(songTime)}</div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex flex-col gap-6">
                <div className="p-3 antialiased mx-auto rounded-none bg-transparent border-2 border-primary transition-all duration-200 flex justify-center items-center cursor-pointer hover:bg-primary hover:text-white" onClick={() => { setIsPlaying(!isPlaying); }}>
                    {!isPlaying ? <Play /> : <Pause />}
                </div>
                <div className="flex gap-4">
                    <VolumeSlider onValueChange={(e) => {
                        setVolumeVal(e[0]); // Update the state
                    }} />
                    <Label>Volume: {volumeVal}%</Label>
                </div>
            </div>
        </div>
    )
}

type SliderProps = React.ComponentProps<typeof Slider>

export function VolumeSlider({ className, ...props }: SliderProps) {
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