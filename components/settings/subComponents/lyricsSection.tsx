import { Label } from "@/components/ui/label";
import { AlignCenter, AlignLeft, AlignRight, LucideIcon } from "lucide-react";
import { useLocalStorage } from "react-use";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

    const OptionsTemplate = ({ normalVal, localStorageVal, setLyricsFunction, index }: { normalVal: string | undefined, localStorageVal: string | undefined, setLyricsFunction: Dispatch<SetStateAction<string | undefined>>, index: string }) => {
        const ActualOptions = ({ type, Icon }: { type: string, Icon: LucideIcon }) => {
            return (
                <div
                    tabIndex={0}
                    className={cn(
                        "rounded-full p-2 duration-300 cursor-pointer hover:bg-secondary/50 relative overflow-hidden"
                    )}
                    aria-label={type}
                    onClick={() => setLyricsFunction(type)}
                    key={`${index}-${type}`}
                >
                    <Icon size='18' />

                    <span
                        className="absolute size-full inset-0 z-10 rounded-full pointer-events-none"
                        style={{
                            backgroundColor: (normalVal || localStorageVal) === type ? "hsl(var(--primary) / 0.1)" : "",
                            opacity: (normalVal || localStorageVal) === type ? 1 : 0
                        }}
                    />
                </div>
            )
        }

        return (
            <div className="flex gap-0.5 p-0.5 items-center justify-between rounded-full border border-muted">
                <ActualOptions type='left' Icon={AlignLeft} />
                <ActualOptions type='center' Icon={AlignCenter} />
                <ActualOptions type='right' Icon={AlignRight} />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
            <div className="flex flex-col mb-3 text-center">
                <p className="text-2xl font-semibold">Lyrics</p>
                <p className="text-sm text-primary/50">Change the style of the lyrics.</p>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-secondary/20 border border-muted">
                <Label className="text-base text-muted-foreground">Synced lyrics alignment</Label>
                <OptionsTemplate setLyricsFunction={setLyricsAlignment} normalVal={lyricsAlignment} localStorageVal={lyricsAlignmentLocalStorage} index={"lyrics"} />
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-secondary/20 border border-muted">
                <Label className="text-base text-muted-foreground">Normal lyrics alignment</Label>
                <OptionsTemplate setLyricsFunction={setNormalLyricsAlignment} normalVal={normalLyricsAlignment} localStorageVal={normalLyricsAlignmentLocalStorage} index={"normal-lyrics"} />
            </div>
        </div>
    )
}