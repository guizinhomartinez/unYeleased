"use client"

import Image from "next/image";
import { BookOpenText, ChevronLeft, EllipsisVertical, ExternalLink, KeyboardIcon, Mic2Icon, MoveDown, MoveLeft, MoveRight, MoveUp, Pause, Play, Rewind, RotateCcw, RotateCw, Share, SpaceIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { toast } from "sonner";
import { Label } from "./ui/label";
import VolumeSlider from "./songControlsSubcomponents/volumeSlider";
import { muteSong, RepeatIcon, VolumeIcon } from "@/lib/songControlsFunctions";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer as Drawer2 } from 'vaul';
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import BasicPageStuff from "./basicPageStuff";
import { useLocalStorage } from "react-use";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { AutoMarquee } from "./songControlsSubcomponents/autoMarquee";
import { Card, CardContent, CardFooter } from "./ui/card";

type KeyboardThing = {
    letter: any;
    type?: string;
    letter2?: any;
    description: string;
}[];

type PlayerRewrite = {
    image: string;
    text: string;
    subtext: string;
    songVal: string;
    backgroundLore: string;
    linkToGenius: string;
    lyrics: string;
    id: string;
};

type Menu = {
    showExplanation: any;
    setShowExplanation: any;
    backgroundLore: string;
    linkToGenius: string;
    lyrics: string;
    songRef?: any;
};

type InfoCard = {
    backgroundLore: string;
    linkToGenius: string;
    lyrics: string;
    shouldShowClose: boolean;
};

type MenuItems = {
    icon: any;
    text: string;
    type: number;
}

const PopoverMenuItems: MenuItems[] = [
    {
        icon: <Share />,
        text: "Share",
        type: 0
    },
    {
        icon: <KeyboardIcon />,
        text: "Shortcuts",
        type: 1
    },
    {
        icon: <BookOpenText />,
        text: "Explanation & lyrics",
        type: 0
    },
];


export function Player({ image, text, subtext, songVal, backgroundLore, linkToGenius, lyrics, id }: PlayerRewrite) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTimeVal, setCurrentTimeVal] = useState(0);
    const [songTime, setSongtime] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const songRef = useRef<HTMLAudioElement | null>(null);
    const [volumeVal, setVolumeVal] = useLocalStorage("volume", 100);
    const [sliderValue, setSliderValue] = useState(0);
    const [repeat, setRepeat] = useState(false);

    const isMobile = useIsMobile();

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

        localStorage.setItem("volume", (volumeVal || 100).toString());

        const localVolume = localStorage.getItem("volume");

        if (localVolume === null) {
            song.volume = (volumeVal || 100) / 100;
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

    React.useMemo(() => {
        const song = songRef.current;

        if (!song) return;

        const repeatSong = () => {
            if (repeat) {
                song.currentTime = 0;
                song.play();
                setIsPlaying(true);
            }
        }

        song.addEventListener("ended", repeatSong);

        return () => {
            song.removeEventListener("ended", repeatSong);
        };
    }, [songVal, isPlaying, repeat])

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    const handleClick = () => setShowExplanation(!showExplanation);

    const goBackFunc = () => {
        const song = songRef.current;
        if (!song) return;
        song.currentTime = 0;
    }

    const skipTimeFunc = (back: boolean) => {
        if (back) {
            const song = songRef.current;
            if (!song) return;
            song.currentTime -= 10;
        } else {
            const song = songRef.current;
            if (!song) return;
            song.currentTime += 10;
        }
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "s":
                    handleClick();
                    break;
                case "r":
                    setRepeat(!repeat);
                    break;
                case " ":
                    e.preventDefault();
                    setIsPlaying(!isPlaying);
                    break;
                case "ArrowLeft":
                    skipTimeFunc(true);
                    e.preventDefault();
                    break;
                case "ArrowRight":
                    skipTimeFunc(false);
                    e.preventDefault();
                    break;
                case "ArrowUp":
                    setVolumeVal((volumeVal || 100) + 10);
                    e.preventDefault();
                    break;
                case "ArrowDown":
                    setVolumeVal((volumeVal || 100) - 10);
                    e.preventDefault();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleClick]);

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
            navigator.mediaSession.setActionHandler("play", () => setIsPlaying(true));
            navigator.mediaSession.setActionHandler("pause", () => setIsPlaying(false));
            navigator.mediaSession.setActionHandler("previoustrack", () => skipTimeFunc(true));
            navigator.mediaSession.setActionHandler("nexttrack", () => skipTimeFunc(false));

            navigator.mediaSession.metadata = new MediaMetadata({
                title: text ? text : "No Track Found",
                artist: "Kanye West",
                album: text ? text : "No Single Found",
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
    }, [songVal, image, songRef, currentTimeVal]);

    return (
        <>
            <div className="w-full absolute top-0 left-0 px-4 py-2 z-50">
                <Link href={"/" + (id === "2424" ? "settings" : "")}>
                    <Button className="rounded-full" size='icon' variant='ghost'>
                        <ChevronLeft />
                    </Button>
                </Link>
            </div>

            <div className="w-screen h-screen">
                <div className={cn("bg-secondary/30 border p-6", isMobile ? "rounded-none h-[120vh] pt-12" : "rounded-3xl w-96 max-h-fit absolute-div-center shadow-xl")}>
                    <div className="flex flex-col gap-2 justify-center items-start">
                        <ImagePlaceholder image={image || null} />
                        <div className="flex justify-between items-center gap-4 w-[85%]">
                            <div className="w-full flex flex-col">
                                <AutoMarquee text={text} className="font-bold text-2xl" number={0} />
                                <AutoMarquee text={subtext} className="text-muted-foreground/80" number={2} />
                            </div>
                            {!useIsMobile() ?
                                <PopoverMenu showExplanation={showExplanation} setShowExplanation={setShowExplanation} backgroundLore={backgroundLore} linkToGenius={linkToGenius} lyrics={lyrics} />
                                :
                                <DrawerMenu showExplanation={showExplanation} setShowExplanation={setShowExplanation} backgroundLore={backgroundLore} linkToGenius={linkToGenius} lyrics={lyrics} songRef={songRef} />
                            }
                        </div>
                        <div className="flex flex-col justify-center items-center pt-4 gap-4 w-full">
                            <div className="flex gap-2 w-full">
                                <div className="text-md opacity-60 w-12">{isNaN(currentTimeVal) ? '0:00' : formatTime(currentTimeVal)}</div>
                                <Slider value={[sliderValue]} max={100} step={1} className="[&>:last-child>span]:bg-primary" onValueChange={handleSliderChange} />
                                <div className="text-md opacity-60 text-right w-12">{songRef.current ? (isNaN(songRef.current.duration) ? '0:00' : formatTime(songRef.current.duration)) : '0:00'}</div>
                            </div>
                            <div className="flex justify-between w-full items-center gap-4 mt-2">
                                <Button
                                    size="icon"
                                    className={cn('p-6 rounded-full', songVal !== "" || songVal !== null && 'opacity-50 cursor-not-allowed', useIsMobile() && 'bg-transparent focus:bg-transparent')}
                                    variant="ghost"
                                    onClick={() => { goBackFunc(); }}
                                >
                                    <Rewind size='32' />
                                </Button>
                                <Button
                                    size="icon"
                                    className={cn('p-6 rounded-full', songVal !== "" || songVal !== null && 'opacity-50 cursor-not-allowed', useIsMobile() && 'bg-transparent focus:bg-transparent')}
                                    variant="ghost"
                                    onClick={() => { skipTimeFunc(true); }}
                                >
                                    <RotateCcw size='32' />
                                </Button>
                                <Button
                                    className={cn('p-6 rounded-full', songVal !== "" || songVal !== null && 'opacity-50 cursor-not-allowed')}
                                    size="icon"
                                    onClick={() => setIsPlaying(songVal !== "" && !isPlaying)}
                                >
                                    {!isPlaying ? <Play size='32' /> : <Pause size='32' />}
                                </Button>
                                <Button
                                    size="icon"
                                    className={cn('p-6 rounded-full', songVal !== "" || songVal !== null && 'opacity-50 cursor-not-allowed', useIsMobile() && 'bg-transparent focus:bg-transparent')}
                                    variant="ghost"
                                    onClick={() => {
                                        skipTimeFunc(false);
                                    }}
                                >
                                    <RotateCw size='32' />
                                </Button>
                                <Button
                                    size="icon"
                                    className={cn('p-6 rounded-full sm:bg-transparent sm:focus:bg-transparent', songVal !== "" || songVal !== null && 'opacity-50 cursor-not-allowed', !repeat && 'opacity-50')}
                                    variant="ghost"
                                    onClick={() => setRepeat(!repeat)}
                                >
                                    <RepeatIcon repeat={!repeat ? 0 : 1} size='32' />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={cn("flex justify-center items-end w-full pt-8")}>
                        <div className="w-full flex justify-center items-center gap-2">
                            <Button onClick={() => { songRef.current && muteSong(songRef) }}
                                variant='outline' className="rounded-full bg-transparent px-4" size='icon' disabled={!songRef.current}>
                                <VolumeIcon size='18' songRef={songRef} volumeVal={volumeVal || 100} />
                            </Button>
                            <VolumeSlider className="[&>:last-child>span]:bg-primary [&>:last-child>span]:border-transparent [&>:first-child>span]:opacity-70" value={[Number(volumeVal)]} onValueChange={(val) => setVolumeVal(val[0])} />
                            <Label className="-translate-y-0.5">{volumeVal}%</Label>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="flex justify-center items-center align-center md:m-4 mt-8 md:mt-4 overflow-y-auto mr-1">
                <div className="flex flex-col gap-2 md:border md:border-muted p-5 rounded-xl overflow-y-auto">
                    <ImagePlaceholder image={image || null} />
                    <div className="flex justify-between items-center gap-2 mt-1">
                        <div className="w-full flex flex-col">
                            <AutoMarquee text={text} className="font-bold text-2xl" number={0} />
                            <AutoMarquee text={subtext} className="text-muted-foreground/80" number={2} />
                        </div>
                        {!useIsMobile() ?
                            <PopoverMenu showExplanation={showExplanation} setShowExplanation={setShowExplanation} backgroundLore={backgroundLore} linkToGenius={linkToGenius} lyrics={lyrics} />
                            :
                            <DrawerMenu showExplanation={showExplanation} setShowExplanation={setShowExplanation} backgroundLore={backgroundLore} linkToGenius={linkToGenius} lyrics={lyrics} songRef={songRef} />
                        }
                    </div>
                    <div className="flex flex-col justify-center items-center mt-4 gap-4">
                        <div className="flex gap-2 w-full">
                            <div className="text-md opacity-60 w-12">{isNaN(currentTimeVal) ? '0:00' : formatTime(currentTimeVal)}</div>
                            <Slider value={[sliderValue]} max={100} step={1} className="[&>:last-child>span]:bg-primary" onValueChange={handleSliderChange} />
                            <div className="text-md opacity-60 text-right w-12">{songRef.current ? (isNaN(songRef.current.duration) ? '0:00' : formatTime(songRef.current.duration)) : '0:00'}</div>
                        </div>
                        <div className="flex justify-between w-full items-center gap-4 mt-4">
                            <Button
                                size="icon"
                                className={cn('p-6 rounded-full', songVal !== "" || songVal !== null && 'opacity-50 cursor-not-allowed', useIsMobile() && 'bg-transparent focus:bg-transparent')}
                                variant="ghost"
                                onClick={() => { goBackFunc(); }}
                            >
                                <Rewind size='32' />
                            </Button>
                            <Button
                                size="icon"
                                className={cn('p-6 rounded-full', songVal !== "" || songVal !== null && 'opacity-50 cursor-not-allowed', useIsMobile() && 'bg-transparent focus:bg-transparent')}
                                variant="ghost"
                                onClick={() => { skipTimeFunc(true); }}
                            >
                                <RotateCcw size='32' />
                            </Button>
                            <Button
                                className={cn('p-6 rounded-full', songVal !== "" || songVal !== null && 'opacity-50 cursor-not-allowed')}
                                size="icon"
                                onClick={() => setIsPlaying(songVal !== "" && !isPlaying)}
                            >
                                {!isPlaying ? <Play size='32' /> : <Pause size='32' />}
                            </Button>
                            <Button
                                size="icon"
                                className={cn('p-6 rounded-full', songVal !== "" || songVal !== null && 'opacity-50 cursor-not-allowed', useIsMobile() && 'bg-transparent focus:bg-transparent')}
                                variant="ghost"
                                onClick={() => {
                                    skipTimeFunc(false);
                                }}
                            >
                                <RotateCw size='32' />
                            </Button>
                            <Button
                                size="icon"
                                className={cn('p-6 rounded-full sm:bg-transparent sm:focus:bg-transparent', songVal !== "" || songVal !== null && 'opacity-50 cursor-not-allowed', !repeat && 'opacity-50')}
                                variant="ghost"
                                onClick={() => setRepeat(!repeat)}
                            >
                                <RepeatIcon repeat={!repeat ? 0 : 1} size='32' />
                            </Button>
                        </div>
                        <div className="flex gap-4 w-full items-center">
                            <Button onClick={() => { songRef.current && muteSong(songRef) }}
                                variant='outline' className="rounded-full bg-transparent px-4" size='icon' disabled={!songRef.current}>
                                <VolumeIcon size='18' songRef={songRef} volumeVal={volumeVal || 100} />
                            </Button>
                            <VolumeSlider className="[&>:last-child>span]:bg-primary [&>:last-child>span]:border-transparent [&>:first-child>span]:opacity-70" value={[Number(volumeVal)]} onValueChange={(val) => setVolumeVal(val[0])} />
                            <Label className="-translate-y-0.5">{volumeVal}%</Label>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );
}

const ImagePlaceholder = ({ image }: { image: string | null }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="relative flex justify-center items-center">
            {!loaded &&
                (
                    <Skeleton className="size-[320px] rounded-xl absolute inset-0 aspect-square" />
                )
            }
            {image !== null &&
                <Image width={360} height={360} alt="Single Cover" src={image} className="text-transparent aspect-square rounded-xl select-none pointer-events-none" onLoad={() => setLoaded(true)} />
            }
        </div>
    )
}

const DrawerMenu = ({
    showExplanation,
    setShowExplanation,
    backgroundLore,
    linkToGenius,
    lyrics,
    songRef
}: Menu) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className="rounded-full min-w-9" variant='secondary' size='icon' disabled={!songRef.current}>
                    <EllipsisVertical size='24' />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-full rounded-t-3xl">
                <div className="p-5 w-full flex flex-col gap-2">
                    <Button className="rounded-full h-12" variant='secondary' disabled={!songRef.current}
                        onClick={() => { navigator.clipboard.writeText(location.href); toast("Copied song link to clipboard"); }}>
                        {PopoverMenuItems[0].icon}
                        {PopoverMenuItems[0].text}
                    </Button>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button className="w-full rounded-full h-12" size='icon' variant='secondary' id="share-button">
                                {PopoverMenuItems[2].icon}
                                {PopoverMenuItems[2].text}
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="w-[30vw]">
                                <InfoCard backgroundLore={backgroundLore} linkToGenius={linkToGenius} lyrics={lyrics} shouldShowClose={false} />
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

const PopoverMenu = ({
    showExplanation,
    setShowExplanation,
    backgroundLore,
    linkToGenius,
    lyrics,
    songRef
}: Menu) => {
    const keyboardThing: KeyboardThing = [
        {
            letter: "S",
            type: "text",
            description: "for hiding/showing the explanation menu"
        },
        {
            letter: "R",
            type: "text",
            description: "for repeating the song"
        },
        {
            letter: <MoveLeft size='16' />,
            description: "for going back 5 seconds"
        },
        {
            letter: <MoveRight size='16' />,
            description: "for skipping 5 seconds"
        },
        {
            letter: <MoveUp size='16' />,
            description: "for making the volume 10% louder"
        },
        {
            letter: <MoveDown size='16' />,
            description: "for making the volume 10% quieter"
        },
        {
            letter: <SpaceIcon />,
            description: "for pausing the song"
        }
    ]

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="rounded-full min-w-9" size='icon' variant='secondary' id="lyrics-button">
                    <EllipsisVertical />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[200px] h-full bg-background rounded-xl p-2 flex flex-col w-full gap-2" side='top' align='end'>
                <Button className="w-full rounded-xl" variant='secondary' id="share-button" onClick={() => { navigator.clipboard.writeText(location.href); toast("Copied song link to clipboard"); }}>
                    {PopoverMenuItems[0].icon}
                    {PopoverMenuItems[0].text}
                </Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-full rounded-xl" variant='secondary' id="share-button">
                            {PopoverMenuItems[1].icon}
                            {PopoverMenuItems[1].text}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-xl">
                        <DialogHeader>
                            <DialogTitle>Keyboard shortcuts</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-2">
                            {keyboardThing.map((thing, index) => (
                                <div className="flex gap-2 items-center" key={index}>
                                    <kbd className="text-muted-foreground text-xs font-medium bg-secondary px-2 py-1 rounded-md border border-muted flex gap-2 items-center justify-center text-center">
                                        <p className={cn(thing.type === "text" && "text-base flex justify-center items-center text-center ml-2")}>
                                            {thing.letter}
                                        </p>
                                        <p>
                                            {thing.letter2}
                                        </p>
                                    </kbd>
                                    {thing.description}
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
                <Drawer2.Root direction="right">
                    <Drawer2.Trigger asChild>
                        <Button className="w-full rounded-xl" size='icon' variant='secondary' id="share-button">
                            {PopoverMenuItems[2].icon}
                            {PopoverMenuItems[2].text}
                        </Button>
                    </Drawer2.Trigger>
                    <Drawer2.Portal>
                        <Drawer2.Overlay className="fixed inset-0 bg-black/40 z-[500]" />
                        <Drawer2.Content
                            className="right-4 top-4 bottom-4 fixed z-[501] outline-none w-[30%] group"
                            // The gap between the edge of the screen and the drawer2 is 8px in this case.
                            style={{ '--initial-transform': 'calc(100% + 24px)' } as React.CSSProperties}
                        >
                            <div className="mt-4 h-1 w-12 rounded-full bg-muted-foreground absolute rotate-90 top-1/2 -translate-y-1/2 -left-[1.1em] cursor-grab group-active:cursor-grabbing" />
                            <div className="bg-primary-foreground size-full grow flex flex-col rounded-[16px]">
                                <div className="max-w-md mx-auto overflow-y-auto">
                                    <InfoCard backgroundLore={backgroundLore} linkToGenius={linkToGenius} lyrics={lyrics} shouldShowClose={false} />
                                </div>
                            </div>
                        </Drawer2.Content>
                    </Drawer2.Portal>
                </Drawer2.Root>
            </PopoverContent>
        </Popover>
    )
}

const InfoCard = ({
    backgroundLore,
    linkToGenius,
    lyrics,
    shouldShowClose
}: InfoCard) => {
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

    const formattedExplanation = backgroundLore.split("\n").map((line, index) => {
        if (line.trim() === '') {
            return <div key={index} className="[&:not(:last-child)]:mb-2"></div>;
        } else {
            return (
                <div key={index} className="mb-0.5">
                    <div>{line}</div>
                </div>
            );
        }
    });

    return (
        <div className={cn("p-3 h-fit", useIsMobile() && 'h-[93vh] max-h-[97vh] w-screen overflow-y-auto')}>
            <Tabs defaultValue="explanation">
                <div className="relative mb-2">
                    <TabsList className="w-full flex justify-between rounded-2xl gap-1 sticky top-10">
                        <TabsTrigger value="explanation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full rounded-xl inline-flex gap-2 items-center"><BookOpenText size='16' /> Explanation</TabsTrigger>
                        <TabsTrigger value="lyrics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full rounded-xl inline-flex gap-2 items-center"><Mic2Icon size='16' /> Lyrics</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="explanation" className="bg-secondary rounded-xl mx-0.5 overflow-y-auto">
                    <p className="p-4">{formattedExplanation}</p>
                </TabsContent>
                <TabsContent value="lyrics" className="bg-secondary rounded-xl mx-0.5 overflow-y-auto">
                    <div className="p-4 overflow-y-auto">
                        {formattedLyrics}
                    </div>
                </TabsContent>
                <div className="flex flex-col gap-3 justify-center items-center bg-secondary p-4 mx-0.5 rounded-xl mt-2">
                    <div className="text-primary/50 text-sm text-center">
                        (All descriptions and lyrics are from Genius/YouTube)
                    </div>
                    <a href={linkToGenius} className="w-full" target="_blank">
                        <Button className="antialiased items-center w-full rounded-full">
                            Original Source
                            <ExternalLink />
                        </Button>
                    </a>
                </div>
            </Tabs>
        </div>
    );
};