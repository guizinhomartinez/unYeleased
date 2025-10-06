import { Button } from "@/components/ui/button";
import skipTimeFunc from "@/lib/player-helpers/go-back";
import { RepeatIcon } from "@/lib/songControlsFunctions";
import { cn } from "@/lib/utils";
import { Pause, Play, Rewind, RotateCcw, RotateCw } from "lucide-react";
import { Dispatch, RefObject, SetStateAction } from "react";

const PlayerControls = ({
    songRef,
    songVal,
    isMobile,
    isPlaying,
    setIsPlaying,
    repeat,
    setRepeat,
}: {
    songRef: RefObject<HTMLAudioElement | null>;
    songVal: string;
    isMobile: boolean;
    isPlaying: boolean;
    setIsPlaying: Dispatch<SetStateAction<boolean>>;
    repeat: boolean;
    setRepeat: Dispatch<SetStateAction<boolean>>;
}) => {
    const goBackFunc = () => {
        if (songRef.current) songRef.current.currentTime = 0;
    };

    return (
        <>
            <Button
                size="icon"
                className={cn(
                    "p-0 rounded-full",
                    songVal !== "" ||
                        (songVal !== null && "opacity-50 cursor-not-allowed"),
                    isMobile && "bg-transparent focus:bg-transparent"
                )}
                variant="ghost"
                onClick={() => {
                    goBackFunc();
                }}
            >
                <Rewind size="32" />
            </Button>
            <Button
                size="icon"
                className={cn(
                    "p-0 rounded-full",
                    songVal !== "" ||
                        (songVal !== null && "opacity-50 cursor-not-allowed"),
                    isMobile && "bg-transparent focus:bg-transparent"
                )}
                variant="ghost"
                onClick={() => {
                    skipTimeFunc(true, songRef);
                }}
            >
                <RotateCcw size="32" />
            </Button>
            <Button
                className={cn(
                    "p-6 rounded-full",
                    songVal !== "" ||
                        (songVal !== null && "opacity-50 cursor-not-allowed")
                )}
                size="icon"
                onClick={() => setIsPlaying(songVal !== "" && !isPlaying)}
            >
                {!isPlaying ? <Play size="32" /> : <Pause size="32" />}
            </Button>
            <Button
                size="icon"
                className={cn(
                    "p-0 rounded-full",
                    songVal !== "" ||
                        (songVal !== null && "opacity-50 cursor-not-allowed"),
                    isMobile && "bg-transparent focus:bg-transparent"
                )}
                variant="ghost"
                onClick={() => {
                    skipTimeFunc(false, songRef);
                }}
            >
                <RotateCw size="32" />
            </Button>
            <Button
                size="icon"
                className={cn(
                    "p-0 rounded-full sm:bg-transparent sm:focus:bg-transparent",
                    songVal !== "" ||
                        (songVal !== null && "opacity-50 cursor-not-allowed"),
                    !repeat && "opacity-50"
                )}
                variant="ghost"
                onClick={() => setRepeat(!repeat)}
            >
                <RepeatIcon repeat={!repeat ? 0 : 1} size="32" />
            </Button>
        </>
    );
};

export default PlayerControls;
