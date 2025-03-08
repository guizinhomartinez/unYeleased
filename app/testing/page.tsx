"use client"

import * as React from "react"
import { ArrowDown, ArrowDownUp, Disc, Info, Loader2 } from "lucide-react"
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
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Particles } from "@/components/magicui/particles";
import { useTheme } from "next-themes";
import Link from "next/link";
import { BlurFade } from "@/components/magicui/blur-fade";
import { AnimatePresence, motion } from "motion/react";
import { fetchHomeInfo } from "@/components/fetching";

type Checked = DropdownMenuCheckboxItemProps["checked"]

interface Song {
    link: string;
    image: string;
    text: string;
    tags: string[];
    subtext: string;
    creators: string;
}

export default function Page() {
    const [show2025, setShow2025] = React.useState<Checked>(true);
    const [show2024, setShow2024] = React.useState<Checked>(false);
    const [none, setNone] = React.useState<Checked>(false);
    const [entries, setEntries] = useState<Song[]>([]);
    const [searchQuery, setSearchQuery] = useState("")

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

    const filteredEntries = entries.filter((item, a, b) => {
        if (show2025) {
            item.tags[0].includes("2025")
        } else if (show2024) {
            item.tags[0].includes("2018")
        } else {
            null
        }
    });

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
                        <React.Suspense fallback={<Loader2 className={cn('my-28 h-16 w-16 text-primary/60 animate-spin')} />}>
                            <div className="flex w-full max-w-sm items-center relative">
                                <Input placeholder="Search..." className="rounded-xl transition-all h-10 shadow-md" type="search" onChange={((e) => setSearchQuery(e.target.value))} onKeyDown={(e) => handleKeyDown} id="search" />
                                <div className="text-muted-foreground/80 pointer-events-none ml-auto flex items-center justify-center">
                                    <kbd className="text-muted-foreground inline-flex font-[inherit] text-xs font-medium absolute right-3">
                                        <span className="opacity-70">⌘</span>K
                                    </kbd>
                                </div>
                            </div>
                        </React.Suspense>
                    </div>
                    <div className="grid gap-10 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 mt-4">
                        {entries.filter((op: Song) => !searchQuery || (op.text.toLowerCase().includes(searchQuery.toLowerCase()) || op.tags[0].toLowerCase().includes(searchQuery.toLowerCase()) || op.tags[1].toLowerCase().includes(searchQuery.toLowerCase()))).sort((a: Song, b: Song) => Number(a.tags[0]) - Number(b.tags[0])).map((entry, index) => (
                            <Link href={entry.link} key={index}>
                                <AnimatePresence>
                                    <motion.div className="h-full flex flex-col gap-3 rounded-2xl p-4 items-center border border-muted w-full cursor-pointer shadow-md" key={index}>
                                        <Image src={`${entry.image}`} alt="Job Well Done" width={250} height={250} className="rounded-xl shadow-md" priority={true} />
                                        <div className="flex flex-col justify-center items-center w-full">
                                            <div className="font-semibold text-start">{entry.text}</div>
                                            <div className="whitespace-pre-wrap text-left text-muted-foreground">{entry.creators}</div>
                                            <div className={cn("text-start bg-primary-foreground/80 rounded-lg w-[90%] h-full border border-muted", 'my-4')}>
                                                {entry.subtext != null ?
                                                    <div className="flex flex-col px-2 py-1 justify-start">
                                                        <div className="font-semibold">Description</div>
                                                        <div className="whitespace-pre-wrap text-sm">{entry.subtext}</div>
                                                    </div>
                                                    :
                                                    <div className="flex flex-col px-2 py-1 justify-start cursor-not-allowed">
                                                        <div className="font-semibold">Description</div>
                                                        <div className="whitespace-pre-wrap text-primary/50 text-sm">No description given</div>
                                                    </div>
                                                }
                                            </div>
                                            <div className="flex gap-1 items-center justify-center">
                                                <Badge className="mt-2 rounded-full" onClick={(e) => e.stopPropagation()}>{entry.tags && entry.tags[0]}</Badge>
                                                <Badge className="mt-2 rounded-full" variant='secondary' onClick={(e) => { e.stopPropagation() }}>{entry.tags && entry.tags[1]}</Badge>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}