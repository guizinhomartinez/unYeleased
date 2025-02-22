import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";
import React, { Suspense, useEffect, useState } from "react";
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ScrollArea } from "./ui/scroll-area";

export const AlbumExplanation = ({ albumID }: { albumID: any }) => {
    return (
        <motion.div className="flex" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }}>
            <Separator orientation="vertical" className="h-screen rounded-full bg-muted mt-1 -translate-x-2.5" />
            <div className="h-[82vh] w-[30vw] bg-primary-foreground p-3 mt-3 mr-12 rounded-xl border-2 border-secondary sticky top-3">
                <div className="text-3xl font-bold">Album Explanation</div>
                <Separator orientation="horizontal" className="h-1 rounded-full bg-muted mt-1 mb-2" />
                <FetchAlbumInfo id={albumID} />
            </div>
        </motion.div >
    );
};

const fetchAlbumInfo = async (id: any) => {
    if (!id) return "yeezus-2";
    const res = await fetch(`/song-files/albumInfo/${id.toString()}/albumExplanation.mdx`);
    return res.text();
};

const FetchAlbumInfo = ({ id }: { id: any }) => {
    const [response, setResponse] = useState("");

    useEffect(() => {
        async function loadInfo() {
            const data = await fetchAlbumInfo(id);
            setResponse(data);
        }
        loadInfo();
    }, []);

    return (
        <ScrollArea className="h-[90%] w-full">
            <Suspense fallback={<div>Loading content</div>}>
                <MDXRemote source={response} />
            </Suspense>
        </ScrollArea>
    )
}