import { isFullscreenModeInterface } from "@/lib/interfaces";
import { AnimatePresence, motion } from "motion/react";
import Image from 'next/image'
import Lyrics from "./lyrics";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Info, LoaderCircleIcon } from "lucide-react";

export const FullscreenUI = ({ image, currentTimeVal, id, songVal, songCreator, isFullscreenMode, isPlaying, setIsPlaying, showLyricsFullscreen, setShowLyricsFullscreen, isLoading }: isFullscreenModeInterface) => {
    const [lyricsStr, setLyricsStr] = useState("");

    return (
        <motion.div className="size-full fixed inset-0 bg-background top-0" initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 0 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
            <Image src={image} alt={image} width={1000} height={1000} className="absolute inset-0 bg-center opacity-40 blur-3xl size-full touch-none select-none pointer-events-none" />
            <motion.div
                className={cn("flex size-full transition-all duration-500", showLyricsFullscreen ? "justify-start" : "justify-center")}
                layout
            >
                <motion.div
                    className="size-full flex flex-col items-center justify-center py-12"
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <div className="flex flex-col relative items-center rounded-2xl overflow-hidden shadow-xl">
                            <div className={cn("size-full bg-black/80 transition-opacity duration-700 absolute shadow-xl inset-0 rounded-2xl", isLoading ? 'opacity-100' : 'opacity-0')}>
                                {(isLoading || isLoading === null) &&
                                    <div className={cn("size-full absolute inset-0 overflow-hidden bg-black/60 backdrop-blur-xl dark:bg-black/80", isLoading && "animate-pulse")}>
                                        <div className={cn("size-full relative", isLoading && "animate-spin")}>
                                            {isLoading && <LoaderCircleIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />}
                                            {isLoading === null &&
                                                <div className="flex flex-col gap-1 items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-2">
                                                    <Info className="text-red-500" size='28' />
                                                    <p className="text-center text-white/60">An error ocurred while loading the song</p>
                                                    <p className="text-center text-white/60">Please try again later</p>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                            <Image
                                src={image}
                                alt={image}
                                width={400}
                                height={400}
                                className="rounded-2xl shadow-xl"
                                onClick={() => {
                                    setIsPlaying(!isPlaying);
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1 justify-center items-center">
                            <p className="text-4xl font-bold text-center">{songVal}</p>
                            <p className="text-xl font-medium text-primary/30 text-center px-5">{songCreator}</p>
                        </div>
                    </div>
                </motion.div>
                <AnimatePresence>
                    {showLyricsFullscreen &&
                        <motion.div
                            className={cn("size-full h-screen flex flex-col items-start justify-start py-12 pr-12")}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            {/* <p className="text-5xl font-bold">Lyrics</p> */}
                            <div className="-translate-y-7">
                                {/* <div className="pointer-events-none absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black to-transparent" /> */}
                                {(songVal === "") ?
                                    <p className="text-primary/50 text-4xl font-bold">No track or lyrics found</p>
                                    :
                                    <Lyrics currentTimeVal={currentTimeVal} id={id} songVal={songVal} isFullscreenMode={isFullscreenMode} lyricsStr={lyricsStr} setLyricsStr={setLyricsStr} />
                                }
                                {/* <div className="pointer-events-none absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black to-transparent" /> */}
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </motion.div>
        </motion.div>
    )
}