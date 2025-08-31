import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pause, Play } from "lucide-react";

export default function AlbumPlayButton({ isPlaying, playAlbum }: { isPlaying: boolean, playAlbum: any }) {
    return (
        <Button className={cn('rounded-full h-12 transition-all duration-300 justify-normal', isPlaying ? 'w-12' : 'w-24')} onClick={() => playAlbum()}>
            {!isPlaying ? <Play /> : <Pause />}
            <div className={cn('transition-all text-center ml-1 duration-300', isPlaying && 'opacity-0')}>
                {!isPlaying ? String('Play') : String('')}
            </div>
        </Button>
    )
}