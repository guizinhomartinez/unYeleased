import { useIsMobile } from "@/hooks/use-mobile";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { Laptop2Icon, Moon, PaintbrushVertical, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import Link from "next/link";
import { LyricsSection } from "./lyricsSection";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useLocalStorage } from 'react-use';

export const UISection = () => {
    const [scrollOnOverflow, setScrollOnOverflow] = useLocalStorage("text-scroll-overflow", true);
    const [fullscreenLyricsRight, setFullscreenLyricsRight] = useLocalStorage("fullscreen-lyrics-right", false);
    const [scrollOnOverflowLocalStorage, setScrollOnOverflowLocalStorage] = useState("true");
    const [fullscreenLyricsRightLocalStorage, setFullscreenLyricsRightLocalStorage] = useState("false");

    useEffect(() => {
        const val = localStorage.getItem("text-scroll-overflow");

        if (val !== null || val !== "") {
            setScrollOnOverflowLocalStorage(val || "true");
        }
    }, [scrollOnOverflow]);

    useEffect(() => {
        const val = localStorage.getItem("fullscreen-lyrics-right");

        if (val !== null || val !== "") {
            setFullscreenLyricsRightLocalStorage(val || "true");
        }
    }, [fullscreenLyricsRight]);

    console.log(scrollOnOverflow + " | " + scrollOnOverflowLocalStorage);

    function ThemeSelection(props: { colorPrimary?: string, option: string }) {
        const { setTheme, theme } = useTheme();

        return (
            <>
                <div className="cursor-pointer hover:bg-secondary/50 border border-secondary transition-all duration-500 w-full px-2 py-4 flex flex-col gap-2 justify-center items-center rounded-xl" style={{ backgroundColor: props.option === theme ? "hsl(var(--secondary))" : "" }} onClick={() => setTheme(props.option)} tabIndex={0} suppressHydrationWarning>
                    <div className="size-12 mx-auto relative shadow-lg rounded-full">
                        <div className={cn("size-12 rounded-full", props.option === "system" && "outline-[2px] outline-primary/30")} style={{ background: props.option !== "system" ? props.colorPrimary : "#161616" }} />
                        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                            {props.option !== "system" ? (props.option !== "dark" ? <Sun className="text-black" /> : <Moon className="text-white" />) : <Laptop2Icon className="text-white" />}
                        </div>
                    </div>
                    <p
                        className="text-center transition-all"
                        suppressHydrationWarning
                        style={
                            {
                                color: props.option === theme ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.8)",
                                fontWeight: props.option === theme ? 600 : 300
                            }
                        }
                    >
                        {capitalizeFirstLetter(props.option)}{(props.option !== "system" && !useIsMobile()) ? " mode" : ""}
                    </p>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col mb-3 text-center">
                    <p className="text-3xl font-semibold">Appearence</p>
                    <p className="text-sm text-primary/50">Change how some aspects of the UI look.</p>
                </div>

                <div className="flex flex-col gap-4 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
                    <div className="flex flex-col mb-2">
                        <Label className="text-2xl font-semibold text-primary/90">Theme</Label>
                        <Label className="text-primary/50">Change the theme of the website.</Label>
                    </div>
                    <div className="flex gap-2 overflow-scroll">
                        <ThemeSelection colorPrimary={"#ffffff"} option="light" />
                        <ThemeSelection colorPrimary={"#0a0a0a"} option="dark" />
                        <ThemeSelection option="system" />
                    </div>
                </div>

                <div className="flex justify-between items-center gap-4 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
                    <Label className="text-base text-muted-foreground">Album page style</Label>
                    <Link href="/album-page-style">
                        <Button variant='secondary' className="rounded-full">
                            <PaintbrushVertical />
                            Show in action
                        </Button>
                    </Link>
                </div>

                <div className="flex justify-between items-center gap-4 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
                    <Label className="text-base text-muted-foreground">Scrolling text on overflow</Label>
                    <Switch checked={scrollOnOverflow || scrollOnOverflowLocalStorage === "true"} onCheckedChange={setScrollOnOverflow} />
                </div>

                <div className="flex justify-between items-center gap-4 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
                    <Label className="text-base text-muted-foreground">Fullscreen lyrics on the right</Label>
                    <Switch checked={(fullscreenLyricsRight || fullscreenLyricsRightLocalStorage === "true") || (fullscreenLyricsRight === undefined && false)} onCheckedChange={setFullscreenLyricsRight} />
                </div>

                <LyricsSection />
            </div>
        </>
    )
}