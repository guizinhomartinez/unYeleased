"use client"

import React from "react"
import { useState, useEffect, Suspense } from "react"
import { Button } from "./ui/button"
import Link from "next/link"
import { ExternalLink, Loader2, LoaderCircleIcon } from "lucide-react"
import { DialogContent, DialogTitle, DialogTrigger, Dialog, DialogDescription } from "./ui/dialog"
import { overrideComponents } from "./overrideComponents"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Separator } from "./ui/separator"

export const AlbumExplanation = ({ id }: { id: string }) => {
    const [DynamicHeader, setDynamicHeader] = useState<React.FC<{ components?: Record<string, React.FC<any>> }> | null>(null);
    const [source, setSource] = useState<string[]>([]);

    const isMobile = useIsMobile();

    fetchAlbumStuff(id, setDynamicHeader, setSource);

    return (
        <div className={cn(isMobile ? "p-3" : "relative")}>
            {isMobile &&
                <div className='flex flex-col items-center justify-center mx-auto mt-4'>
                    <p className='text-3xl font-bold text-center'>Album Explanation</p>
                    <Separator orientation="horizontal" className="h-px rounded-full bg-muted mt-2 mb-2" />
                </div>
            }
            <div className={cn(isMobile && "mx-0.5")}>
                <Suspense fallback={<LoadingComponent />}>
                    {DynamicHeader ? (
                        <div className={cn("px-3 py-2 bg-secondary rounded-2xl", !isMobile && "text-md")}>
                            <DynamicHeader components={overrideComponents} />
                        </div>
                    ) : (
                        <Loader2 className={cn(isMobile ? 'my-28 h-16 w-16 text-primary/60 animate-spin' : '-ms-1 animate-spin ml-2 size-10')} aria-hidden="true" />
                    )}
                </Suspense>
            </div>
            <OriginalSourceButton source={source} />
        </div>
    )
}

export function LoadingComponent() {
    return (
        <div className="size-full bg-transparent">
            <LoaderCircleIcon className="-ms-1 animate-spin absolute top-1/2 left-1/2" aria-hidden="true" />
        </div>
    )
}

function OriginalSourceButton({ source }: { source: string[] }) {
    return (
        <div className="w-full flex flex-col justify-center">
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-full items-center my-4 rounded-full" disabled={source[0] === "There isn't"}>
                        Original Source{source.length > 1 && "s"}
                        <ExternalLink />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>
                        Sources
                    </DialogTitle>
                    <DialogDescription>All sources used for this explanation</DialogDescription>
                    {source.map((item, index) => (
                        <Link href={item} key={index} target="_blank" className={cn("w-full rounded-full", source[0] === "There isn't", "cursor-not-allowed")}>
                            <Button variant='secondary' className="w-full rounded-full" disabled={source[0] === "There isn't"}>
                                {item}
                            </Button>
                        </Link>
                    ))}
                </DialogContent>
            </Dialog>
        </div>
    )
}

function fetchAlbumStuff(id: string, setDynamicHeader: React.Dispatch<React.SetStateAction<React.FC<{ components?: Record<string, React.FC<any>> }> | null>>, setSource: React.Dispatch<React.SetStateAction<string[]>>) {
    useEffect(() => {
        const loadMdxComponent = () => {
            const Component = React.lazy(() =>
                import(`@/public/song-files/albumInfo/${id.toLowerCase()}/explanation/albumExplanation.mdx`)
                    .then((mod) => ({ default: mod.default }))
                    .catch(() => ({ default: () => <p>Failed to load album explanation :C</p> }))
            );

            setDynamicHeader(Component);
        };

        const fetchSource = async () => {
            try {
                let response = await fetch(`../song-files/albumInfo/${id.toLowerCase()}/explanation/source.txt`);

                if (!response.ok) {
                    response = await fetch(`../song-files/albumInfo/source.txt`);
                }

                let data = await response.text();
                if (data === null) {
                    data = "There isn't";
                }
                const formattedData = data.split("\n");
                setSource(formattedData);
            } catch (error) {
                console.error("Error fetching source.txt:", error);
            }
        }

        loadMdxComponent();
        fetchSource();
    }, [id])
}