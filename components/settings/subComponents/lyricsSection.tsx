import { Label } from "@/components/ui/label";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { useLocalStorage } from "react-use";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const LyricsSection = () => {
    const [lyricsAlignment, setLyricsAlignment] = useLocalStorage("lyrics-alignment", "center", { raw: true });
    const [normalLyricsAlignment, setNormalLyricsAlignment] = useLocalStorage("normal-lyrics-alignment", "left", { raw: true });

    const [lyricsAlignmentLocalStorage, setLyricsAlignmentLocalStorage] = useState("center");
    const [normalLyricsAlignmentLocalStorage, setNormalLyricsAlignmentLocalStorage] = useState("left");

    useEffect(() => {
        const val = localStorage.getItem("lyrics-alignment");

        if (val !== null || val !== "") {
            setLyricsAlignmentLocalStorage(val || "center");
        }
    }, [lyricsAlignment]);

        useEffect(() => {
        const val = localStorage.getItem("normal-lyrics-alignment");

        if (val !== null || val !== "") {
            setNormalLyricsAlignmentLocalStorage(val || "left");
        }
    }, [normalLyricsAlignment]);

    return (
        <div className="flex flex-col gap-2 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
            <div className="flex flex-col mb-3 text-center">
                <p className="text-2xl font-semibold">Lyrics</p>
                <p className="text-sm text-primary/50">Change the style of the lyrics.</p>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-secondary/20 border border-muted">
                <Label className="text-base text-muted-foreground">Synced lyrics alignment</Label>
                <div className="flex gap-0.5 p-0.5 items-center justify-between rounded-full border border-muted">
                    <div
                        className={cn(
                            "rounded-full p-2 duration-300 cursor-pointer hover:bg-secondary/50",
                            (lyricsAlignmentLocalStorage || lyricsAlignment) === "left" && "bg-primary/10"
                        )}
                        suppressHydrationWarning
                        aria-label={"left"}
                        onClick={() => setLyricsAlignment("left")}
                    >
                        <AlignLeft size='18' />
                    </div>
                    <div
                        className={cn(
                            "rounded-full p-2 duration-300 cursor-pointer hover:bg-secondary/50",
                            (lyricsAlignmentLocalStorage || lyricsAlignment) === "center" && "bg-primary/10"
                        )}
                        suppressHydrationWarning
                        aria-label={"Center"}
                        onClick={() => setLyricsAlignment("center")}
                    >
                        <AlignCenter size='18' />
                    </div>
                    <div
                        className={cn(
                            "rounded-full p-2 duration-300 cursor-pointer hover:bg-secondary/50",
                            (lyricsAlignmentLocalStorage || lyricsAlignment) === "right" && "bg-primary/10"
                        )}
                        suppressHydrationWarning
                        aria-label={"Right"}
                        onClick={() => setLyricsAlignment("right")}
                    >
                        <AlignRight size='18' />
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-secondary/20 border border-muted">
                <Label className="text-base text-muted-foreground">Normal lyrics alignment</Label>
                <div className="flex gap-0.5 p-0.5 items-center justify-between rounded-full border border-muted">
                    <div
                        className={cn(
                            "rounded-full p-2 duration-300 cursor-pointer hover:bg-secondary/50",
                            (normalLyricsAlignmentLocalStorage || normalLyricsAlignment) === "left" && "bg-primary/10"
                        )}
                        suppressHydrationWarning
                        aria-label={"left"}
                        onClick={() => setNormalLyricsAlignment("left")}
                    >
                        <AlignLeft size='18' />
                    </div>
                    <div
                        className={cn(
                            "rounded-full p-2 duration-300 cursor-pointer hover:bg-secondary/50",
                            (normalLyricsAlignmentLocalStorage || normalLyricsAlignment) === "center" && "bg-primary/10"
                        )}
                        suppressHydrationWarning
                        aria-label={"Center"}
                        onClick={() => setNormalLyricsAlignment("center")}
                    >
                        <AlignCenter size='18' />
                    </div>
                    <div
                        className={cn(
                            "rounded-full p-2 duration-300 cursor-pointer hover:bg-secondary/50",
                            (normalLyricsAlignmentLocalStorage || normalLyricsAlignment) === "right" && "bg-primary/10"
                        )}
                        suppressHydrationWarning
                        aria-label={"Right"}
                        onClick={() => setNormalLyricsAlignment("right")}
                    >
                        <AlignRight size='18' />
                    </div>
                </div>
            </div>
        </div>
    )
}