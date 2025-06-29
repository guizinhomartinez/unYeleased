"use client"

import * as React from "react"
import { ArrowDown, Grid2X2, Info, List, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Image from 'next/image'
import { Separator } from "@/components/ui/separator";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Particles } from "@/components/magicui/particles";
import { useTheme } from "next-themes";
import Link from "next/link";
import { BlurFade } from "@/components/magicui/blur-fade";
import { AnimatePresence, motion } from "motion/react";
import { fetchHomeInfo } from "@/lib/fetching";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HomepageInterface, AlbumsInterface } from "@/lib/interfaces";

type Checked = DropdownMenuCheckboxItemProps["checked"]

export default function Page() {
    const [show2025, setShow2025] = useState(true);
    const [show2024, setShow2024] = useState(false);
    const [none, setNone] = useState(false);
    const [isGrid, setIsGrid] = useState(true);
    const [entries, setEntries] = useState<HomepageInterface[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const { resolvedTheme } = useTheme();
    const [color, setColor] = useState("#ffffff");

    useEffect(() => {
        setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
    }, [resolvedTheme]);

    useEffect(() => {
        try {
            async function fetchedInfo() {
                const data = await fetchHomeInfo();
                setEntries(data.entries);
            }

            fetchedInfo();
        } catch (e) {
            console.log(e);
        }
    })

    const handleKeyDown = useEffect(() => {
        const search = document.getElementById("search");
        const handleKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                search?.focus();
            }
            if (e.key === "Escape") {
                search?.blur();
            }
        };

        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    })

    return (
        <>
            <div className="m-4 md:md-8 mb-0">
                <Navbar />
            </div>

            <div className="m-4 px-1 overflow-x-hidden flex gap-4 flex-col">
                <div className="relative flex h-[80vh] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
                    <BlurFade className="pointer-events-none whitespace-pre-wrap text-primary bg-clip-text text-center text-5xl md:text-8xl leading-none dark:text-transparent dark:bg-gradient-to-b dark:from-primary dark:to-background dark:to-95% font-geist" direction="up">
                        UnYeleased
                    </BlurFade>
                    <BlurFade className="text-muted-foreground/50 text-center whitespace-pre-wrap w-[90%]" direction="up" delay={0.3}>A compilation of all of Ye's unreleased projects</BlurFade>
                    <Particles className="absolute inset-0 z-0" quantity={25} ease={80} color={color} refresh />
                    <BlurFade className="flex gap-2 mt-8" delay={0.6} direction="up">
                        <Button onClick={() => document.getElementById("albums")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="py-6 rounded-xl group">
                            <div className="flex gap-2 items-center justify-center">
                                <ArrowDown className="transition-transform animate-bounce" /> See more
                            </div>
                        </Button>
                        <Link href="/about">
                            <Button className="py-6 rounded-xl" variant='outline'>
                                <div className="flex gap-2 items-center justify-center">
                                    <Info />
                                    About project
                                </div>
                            </Button>
                        </Link>
                    </BlurFade>
                </div>

                <Separator orientation="horizontal" className="w-full translate-y-6" />

                <div className="mt-12 h-full">
                    <div className="flex justify-between gap-2 items-center" id="albums">
                        <div className="flex gap-4 items-center">
                            <div>
                                <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
                                    <Switch
                                        checked={isGrid}
                                        onCheckedChange={setIsGrid}
                                        className="peer data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
                                    />
                                    <span className="peer-data-[state=checked]:text-muted-foreground/70 pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center">
                                        <List size={16} aria-hidden="true" />
                                    </span>
                                    <span className="peer-data-[state=unchecked]:text-muted-foreground/70 pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center">
                                        <Grid2X2 size={16} aria-hidden="true" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <React.Suspense fallback={<Loader2 className={cn('my-28 h-16 w-16 text-primary/60 animate-spin')} />}>
                            <div className="flex w-full max-w-sm items-center relative">
                                <Input placeholder="Search..." className="transition-all h-10 shadow-md" type="search" value={searchQuery} onChange={((e) => setSearchQuery(e.target.value))} onKeyDown={(e) => handleKeyDown} id="search" />
                                <div className="justify-center items-center absolute right-3 inline-flex gap-2">
                                    <div className="text-muted-foreground/80 pointer-events-none ml-auto flex items-center justify-center">
                                        <kbd className="text-muted-foreground font-[inherit] text-xs font-medium ">
                                            <span className="opacity-70">⌘</span>K
                                        </kbd>
                                    </div>
                                    <Button variant='link' size='icon' className={cn("w-fit h-fit", searchQuery === "" && "hidden")} onClick={() => setSearchQuery("")}>
                                        <X size='20' />
                                    </Button>
                                </div>
                            </div>
                        </React.Suspense>
                    </div>
                    <div className={cn(isGrid && "grid gap-10 md:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 overflow-hidden", "mt-4 gap-2 grid")}>
                        {entries.filter((op: HomepageInterface) => !searchQuery || (op.text.toLowerCase().includes(searchQuery.toLowerCase()) || op.tags[0].toLowerCase().includes(searchQuery.toLowerCase()) || op.tags[1].toLowerCase().includes(searchQuery.toLowerCase()) || (op.tags[2] && op.tags[2].toLowerCase().includes(searchQuery.toLowerCase())))).sort((a: HomepageInterface, b: HomepageInterface) => Number(a.tags[0]) - Number(b.tags[0])).map((entry, index) => (
                            <AnimatePresence>
                                <Albums entry={entry} isGrid={isGrid} setSearchQuery={setSearchQuery} index={index} />
                            </AnimatePresence>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

const Albums = ({ entry, isGrid, setSearchQuery, index }: AlbumsInterface) => {
    if (isGrid) {
        return (
            <motion.div className="h-full flex flex-col gap-3 rounded-2xl p-4 items-center border border-muted w-full shadow-md hover:bg-primary-foreground/50 duration-300" key={index} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
                <Link href={entry.link} className="cursor-pointer">
                    <Image src={`/song-files/covers/${entry.image}.jpg`} alt="Album cover" width={250} height={250} className="rounded-xl shadow-md" priority={true} />
                </Link>
                <div className="flex flex-col justify-center items-center w-full gap-4">
                    <div className="flex flex-col justify-center items-center w-full">
                        <Link href={entry.link} className="cursor-pointer">
                            <p className="font-semibold text-start hover:underline">{entry.text}</p>
                        </Link>
                        <p className="whitespace-pre-wrap text-left text-muted-foreground">{entry.creators}</p>
                    </div>
                    <Description entry={entry} />
                    <div className="flex gap-1 items-center justify-center">
                        {entry.tags.map((tag: string, index: number) => (
                            <Badge
                                key={index}
                                className="mt-2 rounded-full cursor-pointer select-none whitespace-nowrap overflow-auto"
                                variant={index === 0 ? undefined : index === 1 ? "secondary" : "outline"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSearchQuery(tag);
                                }}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </motion.div>
        )
    } else {
        return (
            <motion.div className="flex gap-4 items-center p-3 rounded-xl border border-muted w-full shadow-md overflow-hidden" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
                <Link href={entry.link} className="cursor-pointer max-w-24">
                    <Image src={`/song-files/covers/${entry.image}.jpg`} alt="Album cover" width={120} height={120} className="rounded-xl shadow-md" priority={true} />
                </Link>
                <div className="flex flex-col gap-3">
                    <div className="items-start justify-start w-full">
                        <Link href={entry.link} className="cursor-pointer">
                            <p className="font-semibold text-start hover:underline text-lg">{entry.text}</p>
                        </Link>
                        <p className="whitespace-pre-wrap text-left text-sm text-muted-foreground">{entry.creators}</p>
                    </div>
                    <div className="flex gap-1">
                        {entry.tags.map((tag: string, index: number) => (
                            <Badge
                                key={index}
                                className={cn("mt-2 rounded-full cursor-pointer select-none", index === 2 && "hidden")}
                                variant={index === 0 ? undefined : index === 1 ? "secondary" : "outline"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSearchQuery(tag);
                                }}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </motion.div>
        )
    }
}

const Description = ({ entry }: { entry: any }) => {
    return (
        <Accordion type="single" collapsible className="bg-primary-foreground/80 rounded-lg w-[90%] border border-muted mx-4">
            <AccordionItem value="description" className="border-none">
                <AccordionTrigger className={cn("px-2 py-1 flex items-center hover:no-underline", entry.subtext === null && "cursor-not-allowed text-primary/50 text-sm font-normal")} disabled={entry.subtext === null}>
                    {entry.subtext != null ? "Description" : "No Description"}
                </AccordionTrigger>
                <AccordionContent className="px-2 py-1 text-primary/50 text-sm">
                    {entry.subtext}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}