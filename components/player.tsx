"use client";

import { BookOpenText, ArrowLeft, KeyboardIcon, Share } from "lucide-react";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useKeyPressEvent } from "react-use";
import skipTimeFunc from "@/lib/player-helpers/go-back";
import PlayerCard from "./player-components/ui/player-card";

export type PlayerRewriteInterface = {
    image: string;
    text: string;
    subtext: string;
    songVal: string;
    backgroundLore: string;
    linkToGenius: string;
    lyrics: string;
    id: string;
};

export type Menu = {
    showExplanation: any;
    setShowExplanation: any;
    backgroundLore: string;
    linkToGenius: string;
    lyrics: string;
    songRef?: any;
    source: string;
    text: string;
    searchBarRef?: RefObject<HTMLInputElement | null> | any;
};

type MenuItems = {
    icon: any;
    text: string;
    type: number;
};

export const PopoverMenuItems: MenuItems[] = [
    {
        icon: <Share />,
        text: "Share",
        type: 0,
    },
    {
        icon: <KeyboardIcon />,
        text: "Shortcuts",
        type: 1,
    },
    {
        icon: <BookOpenText />,
        text: "Explanation & lyrics",
        type: 0,
    },
];

export function Player({
    image,
    text,
    subtext,
    songVal,
    backgroundLore,
    linkToGenius,
    lyrics,
    id,
}: PlayerRewriteInterface) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const songRef = useRef<HTMLAudioElement | null>(null);
    const [volumeVal, setVolumeVal] = useState<number | any>(100);
    const [repeat, setRepeat] = useState(false);
    const searchParams = useSearchParams();
    const redirectedFromSettings = searchParams.get("redirected-from-settings");
    const searchBarRef = useRef<HTMLInputElement | null>(null);
    const [searchBarFocused, setSearchBarFocused] = useState(false);

    useEffect(() => {
        document.title = `${text || capitalizeFirstLetter(id)} | UnYeleased`;
    }, [text]);

    useEffect(() => {
        const storedVolume = localStorage.getItem("volume") || 100;
        try {
            setVolumeVal(Math.min(100, Math.max(0, Number(storedVolume))));
        } catch (e: any) {
            throw new Error(e.message);
        }
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

        if (
            localVolume === null ||
            localVolume === "NaN" ||
            isNaN(Number(localVolume)) ||
            Number(localVolume) < 0 ||
            Number(localVolume) > 100
        ) {
            song.volume = 0.5;
        } else {
            song.volume = Number(localVolume) / 100;
        }
    }, [volumeVal, isPlaying]);

    React.useMemo(() => {
        const song = songRef.current;

        if (!song) return;

        const repeatSong = () => {
            if (repeat) {
                song.currentTime = 0;
                song.play();
                setIsPlaying(true);
            }
        };

        song.addEventListener("ended", repeatSong);

        return () => {
            song.removeEventListener("ended", repeatSong);
        };
    }, [songVal, isPlaying, repeat]);

    const handleClick = () => setShowExplanation(!showExplanation);

    useEffect(() => {
        if (document.activeElement === searchBarRef.current) {
            setSearchBarFocused(true);
        }

        return () => setSearchBarFocused(false);
    }, [searchBarRef.current]);

    if (searchBarFocused) {
        useKeyPressEvent("s", () => handleClick());

        useKeyPressEvent("r", () => setRepeat(!repeat));

        useKeyPressEvent(" ", (e) => {
            e.preventDefault();
            setIsPlaying(!isPlaying);
        });

        useKeyPressEvent("ArrowLeft", (e) => {
            e.preventDefault();
            skipTimeFunc(true, songRef);
        });

        useKeyPressEvent("ArrowRight", (e) => {
            e.preventDefault();
            skipTimeFunc(false, songRef);
        });

        useKeyPressEvent("ArrowUp", (e) => {
            e.preventDefault();
            setVolumeVal((volumeVal || 100) + 10);
        });

        useKeyPressEvent("ArrowDown", (e) => {
            e.preventDefault();
            setVolumeVal((volumeVal || 100) - 10);
        });
    }

    useEffect(() => {
        if (songVal) {
            try {
                songRef.current = new Audio(songVal);
                songRef.current.loop = repeat;
            } catch (e) {
                console.log(e);
            }
        }
    }, [songVal]);

    useEffect(() => {
        const song = songRef.current;
        if (!song) return;

        if ("mediaSession" in navigator) {
            navigator.mediaSession.setActionHandler("play", () =>
                setIsPlaying(true)
            );
            navigator.mediaSession.setActionHandler("pause", () =>
                setIsPlaying(false)
            );
            navigator.mediaSession.setActionHandler("previoustrack", () =>
                skipTimeFunc(true, songRef)
            );
            navigator.mediaSession.setActionHandler("nexttrack", () =>
                skipTimeFunc(false, songRef)
            );
            navigator.mediaSession.setActionHandler("seekbackward", () =>
                skipTimeFunc(true, songRef)
            );
            navigator.mediaSession.setActionHandler("seekforward", () =>
                skipTimeFunc(false, songRef)
            );

            navigator.mediaSession.metadata = new MediaMetadata({
                title: text ? text : "No Track Found",
                artist: "Kanye West",
                album: text ? text : "No Single Found",
                artwork: [
                    {
                        src: image,
                        sizes: "96x96,128x128,192x192",
                        type: "image/jpeg",
                    },
                ],
            });
            navigator.mediaSession.setPositionState({
                duration: song.duration ? song.duration : 0,
                position: song.currentTime ? song.currentTime : 0,
            });
        }
    }, [songVal, image, songRef]);

    return (
        <>
            <div className="w-full absolute top-0 left-0 px-4 py-2 z-50">
                <Link href={"/" + (redirectedFromSettings ? "settings" : "")}>
                    <Button
                        className="rounded-full"
                        size="icon"
                        variant="ghost"
                    >
                        <ArrowLeft />
                    </Button>
                </Link>
            </div>

            <div className="w-screen h-screen">
                <PlayerCard
                    backgroundLore={backgroundLore}
                    id={id}
                    image={image}
                    isPlaying={isPlaying}
                    linkToGenius={linkToGenius}
                    lyrics={lyrics}
                    repeat={repeat}
                    setIsPlaying={setIsPlaying}
                    setRepeat={setRepeat}
                    setShowExplanation={setShowExplanation}
                    setVolumeVal={setVolumeVal}
                    showExplanation={showExplanation}
                    songRef={songRef}
                    songVal={songVal}
                    subtext={subtext}
                    text={text}
                    volumeVal={volumeVal}
                    searchBarRef={searchBarRef}
                />
            </div>
        </>
    );
}
