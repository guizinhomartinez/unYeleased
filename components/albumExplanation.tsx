"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "./ui/button"
import Link from "next/link"
import { ExternalLink, Loader2, LoaderCircleIcon, LoaderIcon } from "lucide-react"
import { DialogContent, DialogTitle, DialogTrigger, Dialog, DialogDescription } from "./ui/dialog"
import { overrideComponents } from "./overrideComponents"
import { cn } from "@/lib/utils"

export const AlbumExplanation = ({ id }: { id: string }) => {
    const [DynamicHeader, setDynamicHeader] = useState<React.FC<{ components?: Record<string, React.FC<any>> }> | null>(null);
    const [source, setSource] = useState<string[]>([]);

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
            const formattedData = data.split('\n');
            setSource(formattedData);
        }

        loadMdxComponent();
        fetchSource();
    }, [id])

    return (
        <div className="flex h-screen">
            <Separator orientation="vertical" className="h-screen rounded-full bg-gradient-to-b from-muted/80 to-transparent to-95% mt-1 -translate-x-4" />
            <div className="w-[32vw] bg-primary-foreground p-3 mt-3 mr-8 rounded-xl top-12 mb-32 ml-3 border-2 border-secondary overflow-scroll">
                <div className="text-3xl font-semibold">Album Explanation</div>
                <Separator orientation="horizontal" className="h-1 rounded-full bg-muted mt-1 mb-2" />
                <div className="overflow-hidden">
                    {DynamicHeader ? (
                        <ScrollArea className="text-md pr-3">
                            <DynamicHeader components={overrideComponents} />
                        </ScrollArea>
                    ) : (
                        <LoaderCircleIcon className="-ms-1 animate-spin" aria-hidden="true" />
                    )}
                    <div className="w-full flex flex-col justify-center bg-primary-foreground">
                        <Separator orientation="horizontal" className="h-1 rounded-full bg-muted mt-1 mb-2" />
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full items-center">
                                    {source.length > 1 ? "Original Sources" : "Original Source"}
                                    <ExternalLink />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>
                                    Sources
                                </DialogTitle>
                                <DialogDescription>All sources used for this explanation</DialogDescription>
                                {source.map((item, index) => (
                                    <Link href={item} key={index} target="_blank" className="w-full">
                                        <Button variant='secondary' className="w-full">
                                            {item}
                                        </Button>
                                    </Link>
                                ))}
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const AlbumExplanationSmall = ({ id }: { id: string }) => {
    const [DynamicHeader, setDynamicHeader] = useState<React.FC<{ components?: Record<string, React.FC<any>> }> | null>(null);
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
                    <DynamicHeader components={overrideComponents} />
                ) : (
                    <Loader2 className={cn('my-28 h-16 w-16 text-primary/60 animate-spin')} />
                )}
            </div>
            <div className="mt-4">
                <Link href={source} target="_blank" className="mx-auto w-full">
                    <Button className="w-full items-center">
                        Original Source(s)
                        <ExternalLink />
                    </Button>
                </Link>
            </div>
        </div>
    )
}