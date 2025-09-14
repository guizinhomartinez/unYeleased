import { useIsMobile } from "@/hooks/use-mobile";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { Check, Info, Laptop2Icon, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { LyricsSection } from "./lyricsSection";
import Img from 'next/image'
import { useLocalStorage } from 'react-use';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { WrapperComponent } from "../settingsComponent";
import { Skeleton } from "@/components/ui/skeleton";

type optionsMapInterface = {
    text: string;
    checkedElement: boolean | undefined;
    setCheckedElement: Dispatch<SetStateAction<boolean | undefined>>;
}[];

export const UISection = () => {
    const [scrollOnOverflow, setScrollOnOverflow] = useLocalStorage("text-scroll-overflow", true);
    const [fullscreenLyricsRight, setFullscreenLyricsRight] = useLocalStorage("fullscreen-lyrics-right", false);
    const [dancingEmoji, setDancingEmoji] = useLocalStorage<boolean>("dancing-emoji", false);
    const [showSongDurationOnTracklist, setShowSongDurationOnTracklist] = useLocalStorage("show-song-duration-tracklist", true);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <>
                <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-56 w-full rounded-xl bg-primary-foreground/80 border border-muted" />
                    {[1, 2, 3, 4].map((_, i) => (
                        <div key={i} className="flex justify-between items-center gap-4 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
                            <Skeleton className="h-6 w-[200px]" />
                            <Skeleton className="h-9 w-9 rounded-full" />
                        </div>
                    ))}
                    <Skeleton className="h-56 w-full rounded-xl bg-primary-foreground/80 border border-muted" />
                </div>
            </>
        );
    }

    function ThemeSelection(props: { colorPrimary?: string, option: string }) {
        const { setTheme, theme } = useTheme();
        const systemTheme = props.option === "system" || theme === "" || theme === null;

        return (
            <>
                <div className="cursor-pointer hover:bg-secondary/50 border border-secondary transition-all duration-500 w-full px-2 py-4 flex flex-col gap-2 justify-center items-center rounded-xl" style={{ backgroundColor: props.option === theme ? "hsl(var(--secondary))" : "" }} onClick={() => setTheme(props.option)} tabIndex={0}>
                    <div className="size-12 mx-auto relative shadow-lg rounded-full">
                        <div className={cn("size-12 rounded-full", systemTheme && "outline-[2px] outline-primary/30")} style={{ background: !systemTheme ? props.colorPrimary : "#161616" }} />
                        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                            {!systemTheme ? (props.option !== "dark" ? <Sun className="text-black" /> : <Moon className="text-white" />) : <Laptop2Icon className="text-white" />}
                        </div>
                    </div>
                    <p
                        className="text-center transition-all"
                        style={{
                            color: systemTheme ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.8)",
                            fontWeight: systemTheme ? 600 : 300
                        }}
                    >
                        {capitalizeFirstLetter(props.option)}{!(systemTheme && !useIsMobile()) ? " mode" : ""}
                    </p>
                </div>
            </>
        )
    }

    const CheckComponent = (props: { checkedElement: any, setCheckElement: any, id: number }) => {
        return (
            <>
                <input
                    id={`checkbox-element-${props.id}`}
                    type="checkbox"
                    checked={props.checkedElement}
                    onChange={() => props.setCheckElement(!props.checkedElement)}
                    className="sr-only" // hides it visually but keeps it accessible
                    key={props.id}
                />
                <div
                    className={cn(
                        "peer h-6 w-11 cursor-pointer rounded-full",
                        "border-2 border-transparent",
                        "transition-colors duration-300 ease-in-out", // Smoother background transition
                        props.checkedElement ? "bg-primary" : "bg-muted",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}
                    onClick={() => props.setCheckElement(!props.checkedElement)}
                >
                    <div className={cn(
                        "size-5 rounded-full bg-background",
                        "transform transition-transform duration-300 ease-in-out", // Smoother movement
                        "pointer-events-none",
                        props.checkedElement ? "translate-x-5" : "translate-x-0",
                        "shadow-sm ring-0",
                        "block"
                    )} />
                </div>
            </>
        );
    }

    const optionsMap: optionsMapInterface = [
        {
            text: "Scrolling text on overflow",
            checkedElement: scrollOnOverflow,
            setCheckedElement: setScrollOnOverflow
        },
        {
            text: "Fullscreen lyrics on the right",
            checkedElement: fullscreenLyricsRight,
            setCheckedElement: setFullscreenLyricsRight,
        },
        {
            text: "Show song duration on tracklist",
            checkedElement: showSongDurationOnTracklist,
            setCheckedElement: setShowSongDurationOnTracklist
        }
    ]

    return (
        <>
            <div className="flex flex-col gap-4 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
                <div className="flex flex-col mb-2">
                    <Label className="text-2xl font-semibold text-primary/90">Theme</Label>
                    <Label className="text-primary/50">Change the theme of the website.</Label>
                </div>
                <div className="flex gap-2 overflow-scroll">
                    <ThemeSelection colorPrimary={"#ffffff"} option="light" key={0} />
                    <ThemeSelection colorPrimary={"#0a0a0a"} option="dark" key={1} />
                    <ThemeSelection option="system" key={2} />
                </div>
            </div>

            {/* <div className="flex justify-between items-center gap-4 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
                    <Label className="text-base text-muted-foreground">Album page style</Label>
                    <Link href="/album-page-style">
                        <Button variant='secondary' className="rounded-full">
                            <PaintbrushVertical />
                            Show in action
                        </Button>
                    </Link>
                </div> */}

            {optionsMap.map((element, index) => (
                <WrapperComponent text={element.text} id={index} key={index}>
                    <CheckComponent checkedElement={element.checkedElement} setCheckElement={element.setCheckedElement} id={index} />
                </WrapperComponent>
            ))}

            <div className="flex justify-between items-center gap-4 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Label className="text-base text-muted-foreground cursor-pointer flex gap-1 items-center">
                            Dancing emoji on song interlude
                            <Button variant='ghost' className="size-7">
                                <Info size='2' />
                            </Button>
                        </Label>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="!rounded-xl w-[95vw] md:max-w-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-center">Dancing emoji</AlertDialogTitle>
                            <div className="flex justify-center items-center">
                                <Img unoptimized width={156} height={156} alt="Dancing emoji" src="/gifs/dancing-emoji.gif" />
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl w-full">Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CheckComponent checkedElement={dancingEmoji} setCheckElement={setDancingEmoji} id={4} />
            </div>

            <LyricsSection />
        </>
    )
}