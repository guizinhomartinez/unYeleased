'use client'

import { useState, useEffect } from "react";
import Image from 'next/image'
import Link from "next/link";

import * as React from "react"
import { CircleAlert, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";

async function fetchSongs() {
    const response = await fetch(`/song-files/fetchAlbums.json`);
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

    const sortedYears = Object.keys(filteredEntries).sort();

    return (
        <>
            <div className="m-8 mb-0">
                <Navbar activeItem={0} />
            </div>

            <div className="m-8 mt-4 overflow-x-hidden flex gap-4 flex-col">
                <div className="flex flex-col gap-2 items-end">
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
                    <div key={year} className="rounded-2xl bg-accent p-4 shadow-sm">
                        <div className="text-center text-xl font-semibold mb-4 px-2 bg-violet-200 dark:bg-violet-400 rounded-full w-fit mx-auto">{year}</div>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            {filteredEntries[year].map((entry, index) => (
                                <div key={index} className="flex flex-col items-center w-full sm:w-auto cursor-pointer justify-center bg-muted px-4 py-2 rounded-3xl border-2 border-primary/15 shadow-sm">
                                    <Link href={entry.link} key={index} className="flex flex-col items-center justify-center">
                                        <Image src={entry.image} className="rounded-2xl mt-2 shadow-md" alt={entry.text} width={250} height={250} />
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
        </>
    );
}