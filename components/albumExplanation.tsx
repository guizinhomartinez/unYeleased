"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "./ui/button"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { ExternalLink } from "lucide-react"

export const AlbumExplanation = ({ id }: { id: string }) => {
    const [DynamicHeader, setDynamicHeader] = useState<React.ComponentType | null>(null);
    const [source, setSource] = useState("");

    useEffect(() => {
        const loadMdxComponent = async () => {
            try {
                const module = await import(`@/public/song-files/albumInfo/${id.toLowerCase()}/albumExplanation.mdx`);
                setDynamicHeader(() => module.default);
            } catch (error) {
                console.error("Failed to load MDX file:", error);
                setDynamicHeader(() => () => <p>Failed to load album explanation.</p>);
            }
        }

        const fetchSource = async () => {
            const data = await fetch(`../song-files/albumInfo/${id.toLowerCase()}/source.txt`).then(resp => resp.text());
            console.log(data);
            setSource(data);
        }

        loadMdxComponent();
        fetchSource();
    }, [id])

    return (
        <div className="flex h-screen">
            <Separator orientation="vertical" className="h-screen rounded-full bg-gradient-to-b from-muted/80 to-transparent to-95% mt-1 -translate-x-2" />
            <div className="w-[30vw] bg-primary-foreground p-3 mt-3 mr-12 rounded-xl top-12 mb-32 ml-3 border-2 border-secondary">
                <div className="relative h-full">
                    <div className="text-3xl font-semibold">Album Explanation</div>
                    <Separator orientation="horizontal" className="h-1 rounded-full bg-muted mt-1 mb-2" />
                    {DynamicHeader ? (
                        <div className="">
                            <ScrollArea className="h-[65vh] text-md pr-3">
                                <div className="gradient-thing"></div>
                                <div className="w-full" style={{ height: '0.9em' }}></div>
                                <DynamicHeader />
                                <div className="gradient-thing-reverse"></div>
                                <div className="w-full" style={{ height: '2em' }}></div>
                            </ScrollArea>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <div className="absolute bottom-0 left-0 w-full flex flex-col justify-center">
                        <Separator orientation="horizontal" className="h-1 rounded-full bg-muted mt-1 mb-2" />
                        <Link href={source} target="_blank" className="mx-auto w-full">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button className="w-full items-center">
                                            Original Source
                                            <ExternalLink />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-background border border-input">
                                        <p className="text-primary text-xs">
                                            {source}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const AlbumExplanationSmall = ({ id }: { id: string }) => {
    const [DynamicHeader, setDynamicHeader] = useState<React.ComponentType | null>(null);
    const [source, setSource] = useState("");

    useEffect(() => {
        const loadMdxComponent = async () => {
            try {
                const module = await import(`@/public/song-files/albumInfo/${id.toLowerCase()}/albumExplanation.mdx`);
                setDynamicHeader(() => module.default);
            } catch (error) {
                console.error("Failed to load MDX file:", error);
                setDynamicHeader(() => () => <p>Failed to load album explanation.</p>);
            }
        }

        const fetchSource = async () => {
            const data = await fetch(`../song-files/albumInfo/${id.toLowerCase()}/source.txt`).then(resp => resp.text());
            console.log(data);
            setSource(data);
        }

        loadMdxComponent();
        fetchSource();
    }, [id])

    return (
        <div className="p-4 overflow-y-scroll h-[80vh]">
            <div className="text-2xl font-semibold mt-6 text-center">Album Explanation</div>
            <Separator orientation="horizontal" className="h-1 rounded-full bg-muted mt-1 mb-2" />
            <div className="mx-0.5">
                {DynamicHeader ? (
                    <DynamicHeader />
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <div className="mt-4">
                <Link href={source} target="_blank" className="mx-auto w-full">
                    <Button className="w-full items-center">
                        Original Source
                        <ExternalLink />
                    </Button>
                </Link>
            </div>
        </div>
    )
}