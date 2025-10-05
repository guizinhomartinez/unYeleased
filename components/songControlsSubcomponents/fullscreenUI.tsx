import { isFullscreenModeInterface } from "@/lib/interfaces";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Lyrics from "./lyrics";
import { cn } from "@/lib/utils";
import { Info, LoaderCircleIcon } from "lucide-react";
import { AutoMarquee } from "./autoMarquee";
import { useLocalStorage } from "react-use";
import { useEffect, useState } from "react";
import { fetchAlbumLyrics } from "@/lib/fetching";

export const FullscreenUI = ({
    image,
    currentTimeVal,
    id,
    songVal,
    songCreator,
    isFullscreenMode,
    isPlaying,
    setIsPlaying,
    showLyricsFullscreen,
    setShowLyricsFullscreen,
    isLoading,
}: isFullscreenModeInterface) => {
    const [fullscreenLyricsRight, setFullscreenLyricsRight] = useLocalStorage(
        "fullscreen-lyrics-right",
        false
    );
    const [fullscreenLyricsStr, setFullscreenLyricsStr] = useState("");

    useEffect(() => {
        async function fetchLyrics() {
            const data = await fetchAlbumLyrics(id, songVal);
            setFullscreenLyricsStr(data || "LYRICS NOT FOUND");
        }
        fetchLyrics();
    }, [songVal, id]);

    return (
        <motion.div
            className="size-full fixed inset-0 bg-[hsl(0,0%,3.9%)] top-0"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{
                duration: 0.4,
                ease: "easeInOut",
                type: "spring",
                stiffness: 300,
                damping: 50,
            }}
            layout
        >
            <Image
                src={image}
                alt={image}
                fill
                sizes="100vw"
                className="absolute inset-0 bg-center opacity-40 blur-3xl size-full touch-none select-none pointer-events-none"
            />
            <motion.div
                className="flex size-full transition-all duration-500 -translate-y-5"
                layout
            >
                <motion.div
                    key="album-art"
                    className={cn(
                        "size-full flex flex-col items-center justify-center py-12 absolute top-0",
                        fullscreenLyricsRight && "order-2"
                    )}
                    animate={{
                        // shift left when lyrics open, center when closed
                        x:
                            showLyricsFullscreen &&
                            fullscreenLyricsStr !== "LYRICS NOT FOUND"
                                ? "-25%"
                                : "0%",
                        opacity: 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 50 }}
                >
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <div className="flex flex-col relative items-center rounded-2xl overflow-hidden shadow-xl">
                            <div
                                className={cn(
                                    "size-full bg-black/80 transition-opacity duration-700 absolute shadow-xl inset-0 rounded-2xl",
                                    isLoading ? "opacity-100" : "opacity-0"
                                )}
                            >
                                {(isLoading || isLoading === null) && (
                                    <div
                                        className={cn(
                                            "size-full absolute inset-0 overflow-hidden bg-black/60 backdrop-blur-xl dark:bg-black/80",
                                            isLoading && "animate-pulse"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "size-full relative",
                                                isLoading && "animate-spin"
                                            )}
                                        >
                                            {isLoading && (
                                                <LoaderCircleIcon className="absolute-div-center text-[hsl(0,0%,100%)]" />
                                            )}
                                            {isLoading === null && (
                                                <div className="flex flex-col gap-1 items-center justify-center absolute-div-center w-full px-2">
                                                    <Info
                                                        className="text-red-500"
                                                        size="28"
                                                    />
                                                    <p className="text-center text-[hsl(0,0%,100%)]/60">
                                                        An error ocurred while
                                                        loading the song
                                                    </p>
                                                    <p className="text-center text-[hsl(0,0%,100%)]/60">
                                                        Please try again later
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
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
                        <div className="flex flex-col justify-center items-center gap-1 max-w-[400px]">
                            <AutoMarquee
                                text={songVal}
                                className="text-3xl text-center tracking-tight font-bold text-[hsl(0,0%,100%)]"
                                number={0}
                            />
                            <AutoMarquee
                                text={songCreator}
                                className="text-xl text-center font-medium text-[hsl(0,0%,100%)]/30"
                                marqueeClassName="gap-10"
                                number={2}
                            />
                        </div>
                    </div>
                </motion.div>
                <AnimatePresence>
                    <motion.div
                        key="lyrics"
                        className={cn(
                            "w-full h-screen flex flex-col items-start justify-start py-12 max-w-[50%] right-0"
                        )}
                        animate={{
                            x:
                                showLyricsFullscreen &&
                                fullscreenLyricsStr !== "LYRICS NOT FOUND"
                                    ? "100%"
                                    : "200%",
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 50,
                        }}
                    >
                        <Lyrics
                            currentTimeVal={currentTimeVal}
                            id={id}
                            songVal={songVal}
                            isFullscreenMode={isFullscreenMode}
                            syncedLyricsClassName={cn(
                                "pb-24",
                                fullscreenLyricsRight !== undefined &&
                                    (!fullscreenLyricsRight ? "pr-12" : "pl-12")
                            )}
                        />
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default FullscreenUI;
