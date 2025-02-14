'use client'

import { useState, useEffect } from "react";
import Image from 'next/image'
import Link from "next/link";

import * as React from "react"
import { CircleAlert, Github, Moon, Search, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

async function fetchSongs() {
    const response = await fetch(`/fetchAlbums.json`);
    return response.json();
}

export default function Page() {
    const [groupedEntries, setGroupedEntries] = useState<Record<string, any[]>>({});
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function loadSongs() {
            const data = await fetchSongs();

            // Group entries by year
            const grouped: Record<string, any[]> = {};
            data.songs.forEach((song: any) => {
                if (!grouped[song.year]) {
                    grouped[song.year] = [];
                }
                grouped[song.year].push(...song.entries.map((entry: any) => ({
                    ...entry,
                    year: song.year,
                })));
            });

            setGroupedEntries(grouped);
        }
        loadSongs();
    }, []);

    const filteredEntries = Object.entries(groupedEntries).reduce((acc, [year, entries]) => {
        const filtered = entries.filter(entry =>
            entry.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.subtext.toLowerCase().includes(searchQuery.toLowerCase()) ||
            year.includes(searchQuery)
        );
        if (filtered.length > 0) {
            acc[year] = filtered;
        }
        return acc;
    }, {} as Record<string, any[]>);

    const sortedYears = Object.keys(filteredEntries).sort((a, b) => {
        const rowA = parseInt(a.replace("row ", ""));
        const rowB = parseInt(b.replace("row ", ""));
        return rowA + rowB; // Sort numerically by row
    });

    return (
        <div className="m-8 overflow-x-hidden flex gap-4 flex-col">
            <div className="flex flex-col gap-2 items-end">
                <div className="flex gap-2">
                    <DropDown />
                    <a href="https://github.com/guizinhomartinez/ye-unreleased-songs" target="_blank">
                        <Button size='icon' variant='outline' className="rounded-full">
                            <Github />
                        </Button>
                    </a>
                </div>
                <Alert className="rounded-xl bg-amber-300/50 dark:bg-amber-300/25">
                    <CircleAlert className="size-7" />
                    <AlertTitle className="translate-x-2">Heads up!</AlertTitle>
                    <AlertDescription className="translate-x-2">
                        This website is still in <strong>VERY</strong> early development. Please, share your ideas in the Github Repo to make this project better!
                    </AlertDescription>
                </Alert>
            </div>
            <div className='flex items-center relative mx-px'>
                <Input type='search' className='pl-[3em] bg-primary-foreground/50 border-2 border-secondary' placeholder="Search for your favorite album or single" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}></Input>
                <div className='absolute left-3 pr-2 py-2 border-r-2 border-r-secondary cursor-pointer'>
                    <Search size={16} strokeWidth={2} className=' text-muted-foreground/80' />
                </div>
            </div>

            {/* Render each year as its own section */}
            {sortedYears.map((year) => (
                <div key={year} className="bg-primary/5 rounded-xl p-4">
                    <div className="text-center text-xl font-semibold mb-4 px-2 bg-primary/10 rounded-full w-fit mx-auto">{year}</div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        {filteredEntries[year].map((entry, index) => (
                            <div key={index} className="flex flex-col items-center w-full sm:w-auto cursor-pointer justify-center bg-secondary px-8 py-2 rounded-lg border-2 border-primary/15">
                                <Link href={entry.link} key={index} className="flex flex-col items-center justify-center">
                                    <Image src={entry.image} className="rounded-lg mt-2" alt={entry.text} width={250} height={250} />
                                    <div className="mt-4">{entry.text}</div>
                                    <div className="text-center text-primary/75 w-32 overflow-hidden whitespace-nowrap text-ellipsis">
                                        {entry.subtext}
                                    </div>
                                    <div className=" text-primary/50">{entry.duration}</div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

const DropDown = () => {
    const { setTheme } = useTheme()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}