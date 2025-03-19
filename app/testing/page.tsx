"use client"

import * as React from "react"
import { ArrowDown, ArrowDownUp, ChevronDown, Disc, Grid2X2, Info, List, Loader2, MoonIcon, SunIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Image from 'next/image'
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Particles } from "@/components/magicui/particles";
import { useTheme } from "next-themes";
import Link from "next/link";
import { BlurFade } from "@/components/magicui/blur-fade";
import { AnimatePresence, motion } from "motion/react";
import { fetchHomeInfo } from "@/components/fetching";
import { Switch } from "@/components/ui/switch";

type Checked = DropdownMenuCheckboxItemProps["checked"]

interface Song {
    link: string;
    image: string;
    text: string;
    tags: string[];
    subtext: string;
    creators: string;
}

interface Albums {
    entry: any;
    isGrid: boolean;
    setSearchQuery: any;
    index: any;
}

export default function Page() {
    const [show2025, setShow2025] = useState(true);
    const [show2024, setShow2024] = useState(false);
    const [none, setNone] = useState(false);
    const [isGrid, setIsGrid] = useState(true);
    const [entries, setEntries] = useState<Song[]>([]);
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="rounded-xl shadow-md">
                                        <ArrowDownUp />
                                        Sort by...
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="start">
                                    <DropdownMenuLabel>Year sorting</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem checked={none} onCheckedChange={setNone} onChange={() => setSearchQuery('')}>
                                        None
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem checked={show2025} onCheckedChange={setShow2025} onChange={() => setSearchQuery('2025')}>
                                        2025
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem checked={show2024} onCheckedChange={setShow2024} onChange={() => setSearchQuery('2024')}>
                                        2024
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                    <div className={cn(isGrid && "grid gap-10 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 overflow-hidden", "mt-4 gap-2 grid")}>
                        {entries.filter((op: Song) => !searchQuery || (op.text.toLowerCase().includes(searchQuery.toLowerCase()) || op.tags[0].toLowerCase().includes(searchQuery.toLowerCase()) || op.tags[1].toLowerCase().includes(searchQuery.toLowerCase()) || op.tags[2].toLowerCase().includes(searchQuery.toLowerCase()))).sort((a: Song, b: Song) => Number(a.tags[0]) - Number(b.tags[0])).map((entry, index) => (
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

const Albums = ({ entry, isGrid, setSearchQuery, index }: Albums) => {
    if (isGrid) {
        return (
            <motion.div className="h-full flex flex-col gap-3 rounded-2xl p-4 items-center border border-muted w-full shadow-md" key={index} initial={{ opacity: 0, y: 40, filter: "blur(20px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -40, filter: "blur(20px)" }} transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}>
                <Link href={entry.link} className="cursor-pointer">
                    <Image src={`${entry.image}`} alt="Job Well Done" width={250} height={250} className="rounded-xl shadow-md" priority={true} />
                </Link>
                <div className="flex flex-col justify-center items-center w-full">
                    <Link href={entry.link} className="cursor-pointer">
                        <p className="font-semibold text-start hover:underline">{entry.text}</p>
                    </Link>
                    <p className="whitespace-pre-wrap text-left text-muted-foreground">{entry.creators}</p>
                    <Description entry={entry} />
                    <div className="flex gap-1 items-center justify-center">
                        {entry.tags.map((tag: string, index: number) => (
                            <Badge
                                key={index}
                                className="mt-2 rounded-full cursor-pointer select-none"
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
            <motion.div className="flex gap-4 items-center p-3 rounded-xl border border-muted w-full shadow-md overflow-hidden" initial={{ opacity: 0, y: 40, filter: "blur(20px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -40, filter: "blur(20px)" }} transition={{ duration: 0.6, ease: "easeInOut" }}>
                <Link href={entry.link} className="cursor-pointer">
                    <Image src={`${entry.image}`} alt="Job Well Done" width={125} height={125} className="rounded-xl shadow-md" priority={true} />
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
                                className="mt-2 rounded-full cursor-pointer select-none"
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
    const [showDescription, setShowDescription] = useState<boolean>(false);

    return (
        <div className={cn("text-start bg-primary-foreground/80 rounded-lg w-[90%] h-full border border-muted", 'my-4')}>
            <button className={cn("flex flex-col px-2 py-1 justify-start overflow-hidden cursor-pointer select-none w-full", entry.subtext === null && "cursor-not-allowed")} onClick={() => setShowDescription(!showDescription)}>
                <div className="flex justify-between items-center">
                    <p className={cn("text-base", entry.subtext === null && "text-primary/50 text-sm font-normal")}>{entry.subtext != null ? "Description" : "No Description"}</p>
                    <Button className={cn('duration-300 p-px bg-transparent border-none m-0 w-fit h-fit hover:bg-transparent', showDescription && 'rotate-180', entry.subtext === null && "hidden")} disabled={entry.subtext === null} size='icon' variant='outline'>
                        <ChevronDown size='16' />
                    </Button>
                </div>
                {entry.subtext != null &&
                    <p className={cn("whitespace-pre-wrap text-left text-primary/50 text-sm overflow-hidden transition-[max-height] duration-300 max-h-0", showDescription && 'max-h-40 transition-[max-height] duration-300')}>
                        {entry.subtext}
                    </p>
                }
            </button>
        </div>
    )
}