import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlignCenter, AlignLeft, AlignRight, LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const LyricsSection = () => {
    const [lyricsAlignment, setLyricsAlignment] = useState("center");
    const [normalLyricsAlignment, setNormalLyricsAlignment] = useState("left");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedStyle = localStorage.getItem("lyrics-alignment");
        const storedNormalStyle = localStorage.getItem("normal-lyrics-alignment");
        storedStyle !== null && setLyricsAlignment(lyricsAlignment);
        storedNormalStyle !== null && setNormalLyricsAlignment(normalLyricsAlignment);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("lyrics-alignment", lyricsAlignment);
            localStorage.setItem("normal-lyrics-alignment", normalLyricsAlignment);
        }
    }, [lyricsAlignment]);

    const SyncedLyricsAlignment = (props: { alignment: string, icon:LucideIcon, syncedLyrics:boolean }) => {
        const syncedLyricsOps = lyricsAlignment || localStorage.getItem("lyrics-alignment");
        const normalLyricsOps = normalLyricsAlignment || localStorage.getItem("normal-lyrics-alignment");
        return (
            <div className={cn("rounded-full p-2 duration-300 cursor-pointer hover:bg-secondary/50", (((props.syncedLyrics ? syncedLyricsOps : normalLyricsOps) === props.alignment) && isLoaded) && "bg-secondary hover:bg-secondary")} aria-label={props.alignment} onClick={() => (props.syncedLyrics ? setLyricsAlignment(props.alignment) : setNormalLyricsAlignment(props.alignment))}>
                <props.icon size='18' />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
            <div className="flex flex-col mb-2 text-center">
                <p className="text-2xl font-semibold">Lyrics</p>
                <p className="text-sm text-primary/50">Change the style of the lyrics.</p>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-primary-foreground border border-muted">
                <Label className="text-base text-muted-foreground">Synced lyrics alignment</Label>
                <div className="flex gap-0.5 p-0.5 items-center justify-between rounded-full border border-muted">
                    <SyncedLyricsAlignment alignment='left' icon={AlignLeft} syncedLyrics={true} />
                    <SyncedLyricsAlignment alignment='center' icon={AlignCenter} syncedLyrics={true} />
                    <SyncedLyricsAlignment alignment='right' icon={AlignRight} syncedLyrics={true} />
                </div>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-primary-foreground border border-muted">
                <Label className="text-base text-muted-foreground">Normal lyrics alignment</Label>
                <div className="flex gap-0.5 p-0.5 items-center justify-between rounded-full border border-muted">
                    <SyncedLyricsAlignment alignment='left' icon={AlignLeft} syncedLyrics={false} />
                    <SyncedLyricsAlignment alignment='center' icon={AlignCenter} syncedLyrics={false} />
                    <SyncedLyricsAlignment alignment='right' icon={AlignRight} syncedLyrics={false} />
                </div>
            </div>
        </div>
    )
}