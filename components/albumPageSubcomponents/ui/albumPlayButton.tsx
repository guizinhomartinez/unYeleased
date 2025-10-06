import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pause, Play } from "lucide-react";

export default function AlbumPlayButton({
    isPlaying,
    playAlbum,
    songRef
}: {
    isPlaying: boolean;
    playAlbum: any;
    songRef: React.RefObject<HTMLAudioElement | null>;
}) {
    return (
        <Button
            className={cn(
                "rounded-full h-12 transition-all duration-300 justify-normal",
                isPlaying && songRef.current !== null ? "w-12" : "w-24"
            )}
            onClick={() => playAlbum()}
        >
            {!isPlaying || songRef.current === null ? <Play /> : <Pause />}
            <div
                className={cn(
                    "transition-all text-center ml-1 duration-300",
                    !isPlaying || songRef.current !== null && "opacity-0"
                )}
            >
                {!isPlaying || songRef.current === null ? String("Play") : String("")}
            </div>
        </Button>
    );
}
