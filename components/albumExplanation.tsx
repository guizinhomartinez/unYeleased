"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "./ui/button"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

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
        <div className="flex">
            <Separator orientation="vertical" className="h-screen rounded-full bg-muted mt-1 -translate-x-2" />
            <div className="w-[30vw] bg-primary-foreground p-3 mt-3 mr-12 rounded-xl border-2 border-secondary sticky top-6 mb-32 ml-3">
                <div className="relative h-full">
                    <div className="text-3xl text-center font-semibold">Album Explanation</div>
                    <Separator orientation="horizontal" className="h-1 rounded-full bg-muted mt-1 mb-2" />
                    {DynamicHeader ? (
                        <div className="">
                            <ScrollArea className="h-[65vh]">
                                <DynamicHeader />
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
                                        <Button className="text-xl w-full" variant='secondary'>Source</Button>
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
    const [DynamicHeader, setDynamicHeader] = useState<React.ComponentType | null>(null)

    useEffect(() => {
        const loadMdxComponent = async () => {
            try {
                const module = await import(`@/public/song-files/albumInfo/${id.toLowerCase()}/albumExplanation.mdx`)
                setDynamicHeader(() => module.default)
            } catch (error) {
                console.error("Failed to load MDX file:", error)
                setDynamicHeader(() => () => <p>Failed to load album explanation.</p>)
            }
        }

        loadMdxComponent()
    }, [id])

    return (
        <div className="bg-primary-foreground p-3">
            <div className="text-2xl font-semibold mt-6 text-center">Album Explanation</div>
            <Separator orientation="horizontal" className="h-1 rounded-full bg-muted mt-1 mb-2" />
            {DynamicHeader ? (
                <div className="">
                    <DynamicHeader />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}