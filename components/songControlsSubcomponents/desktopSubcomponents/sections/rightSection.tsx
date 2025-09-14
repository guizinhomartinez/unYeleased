import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { cn, lyricsDelay } from "@/lib/utils";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Maximize2, MicVocal, Minimize2Icon } from "lucide-react";
import Image from 'next/image';
import Lyrics from "../../lyrics";
import { muteSong, VolumeIcon } from "@/lib/songControlsFunctions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import VolumeSlider from "../../volumeSlider";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { fetchAlbumLyrics } from "@/lib/fetching";
import { motion } from "motion/react";
import { songControlsInterface } from "@/lib/interfaces";
import { setFullscreen } from '@/components/songControlsSubcomponents/desktopSongControls';
import { LyricsOpened, SliderValue, WheelEventHandler } from "@/components/contexts";
import { Label } from "@/components/ui/label";

interface LyricsPopover {
    image: string,
    lyricsOpened: boolean,
    setLyricsOpened: Dispatch<SetStateAction<boolean>>,
    fullscreenLyricsStr: string,
    id: string,
    currentTimeVal: number,
    songVal: string,
    songRef: any
}

interface VolumePopover {
    songRef: any,
    volumeVal: number,
    repeat: number,
    setVolumeVal: any
}

export default function RightSectionSongControls({ image, songVal, id, songRef, volumeVal, setIsFullscreenMode, isFullscreenMode, repeat, setVolumeVal }: songControlsInterface) {
    const [fullscreenLyricsStr, setFullscreenLyricsStr] = useState("");
    const [currentTimeVal] = useContext(SliderValue).currentTimeVal;
    const [lyricsOpened, setLyricsOpened] = useContext(LyricsOpened).lyricsOpened;

    useEffect(() => {
        async function fetchLyrics() {
            const data = await fetchAlbumLyrics(id, songVal);
            setFullscreenLyricsStr(data || "LYRICS NOT FOUND");
        }
        fetchLyrics();
    }, [songVal, id])

    return (
        <div className="flex items-center justify-end select-none gap-2 lg:w-full md:w-[25%]" onClick={(e) => e.stopPropagation()}>
            <div className="items-center flex gap-2">
                <LyricsPopover {...{ image, lyricsOpened, currentTimeVal, fullscreenLyricsStr, id, setLyricsOpened, songRef, songVal }} />
            </div>
            <div className="flex gap-2 items-center h-full">
                <VolumePopover {...{ repeat, setVolumeVal, songRef, volumeVal }} />
                <div className="h-7 w-2 border-l border-primary/30 ml-2" />
                <Button
                    variant='outline'
                    size='icon'
                    className="p-5 rounded-full bg-transparent"
                    onClick={() => {
                        setIsFullscreenMode(!isFullscreenMode);
                        setFullscreen(!isFullscreenMode || false);
                    }}>
                    {!isFullscreenMode ? <Maximize2 /> : <Minimize2Icon />}
                </Button>
            </div>
        </div>
    )
}

function VolumePopover({ songRef, volumeVal, repeat, setVolumeVal }: VolumePopover) {
    const [hoveredVolumeIcon, setHoveredVolumeIcon] = useState(false);
    const handleWheel = useContext(WheelEventHandler);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant='secondary'
                    className="rounded-full py-5 pr-1.5 cursor-pointer gap-0 relative"
                    disabled={!songRef.current}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        muteSong(songRef);
                    }}
                >
                    <VolumeIcon size='18' songRef={songRef} volumeVal={volumeVal || 100} repeat={repeat} />
                    <div className="w-px h-4 rounded-full bg-primary/40 ml-3 mr-1.5" />
                    <Label className="w-12 cursor-pointer">{volumeVal}%</Label>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="rounded-2xl max-w-[80%] bg-background">
                <div className="flex items-center gap-2 justify-center">
                    <TooltipProvider>
                        <Tooltip open={hoveredVolumeIcon}>
                            <TooltipTrigger asChild>
                                <Button onMouseLeave={() => setTimeout(() => setHoveredVolumeIcon(false), 150)} onMouseOver={() => setTimeout(() => setHoveredVolumeIcon(true), 250)} onClick={() => muteSong(songRef)} variant='ghost' className="rounded-full bg-transparent px-4" size='icon' disabled={!songRef.current}>
                                    <VolumeIcon size='18' songRef={songRef} volumeVal={volumeVal || 100} repeat={repeat} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="rounded-xl border">
                                <p>{songRef.current ? (!songRef.current.muted ? "Mute" : "Unmute") : "Choose a song first"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <VolumeSlider className="[&>:last-child>span]:bg-primary [&>:last-child>span]:border-transparent [&>:first-child>span]:opacity-70" value={[volumeVal]} onValueChange={setVolumeVal} onWheel={handleWheel} />
                    <Label className="w-12 ml-2">{volumeVal}%</Label>
                </div>
            </PopoverContent>
        </Popover>
    )
}

function LyricsPopover({ image, lyricsOpened, setLyricsOpened, fullscreenLyricsStr, currentTimeVal, id, songVal, songRef }: LyricsPopover) {
    const [isSynced, setIsSynced] = useState(true);

    return (
        <Popover open={lyricsOpened} onOpenChange={setLyricsOpened}>
            <PopoverTrigger asChild>
                <Button className={cn("rounded-full", fullscreenLyricsStr === "LYRICS NOT FOUND" && "opacity-50 cursor-not-allowed")} size='icon' variant='secondary' disabled={!songRef.current || fullscreenLyricsStr === "LYRICS NOT FOUND"} id="lyrics-button">
                    <MicVocal />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[450px] max-h-[80vh] overflow-hidden mr-20 h-full rounded-2xl p-2 flex justify-center group" side='top'>
                <div className="relative rounded-lg w-full max-h-full overflow-hidden">
                    <Image src={image} alt={image} width={0} height={0} className="absolute inset-0 bg-cover bg-center opacity-10 blur-2xl size-full" />
                    <div className="h-full overflow-y-auto p-2">
                        <Lyrics currentTimeVal={Math.floor(currentTimeVal * lyricsDelay)} id={id} songVal={songVal} isSynced={!isSynced} isFullscreenMode={false} haveVerticalSpace={true} />
                    </div>
                    <div className="absolute flex justify-center items-center bottom-4 left-1/2 -translate-x-1/2 rounded-full group-hover:opacity-30 group-hover:blur-sm hover:!opacity-90 hover:!blur-0 opacity-0 transition-all duration-500 bg-primary-foreground py-1 w-[50%] px-2">
                        <div className="rounded-full flex justify-center items-center w-full relative">
                            <div onClick={() => setIsSynced(true)} className={cn("w-full text-center transition-colors duration-500 rounded-full cursor-default select-none", !isSynced && "cursor-pointer")}>
                                Synced
                            </div>
                            <div onClick={() => setIsSynced(false)} className={cn("w-full text-center transition-colors duration-500 rounded-full cursor-default select-none", isSynced && "cursor-pointer")}>
                                Normal
                            </div>
                        </div>
                        <motion.span
                            className="absolute top-0 bg-white mix-blend-difference h-full w-1/2"
                            animate={{
                                x: isSynced ? "-60%" : "40%",
                            }}
                            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                            style={{ borderRadius: 9999 }}
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}