import { Copy, DownloadIcon, EllipsisVertical, Share } from "lucide-react";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import { cn } from "@/lib/utils";

export const MoreOptionsMenu = (props: { songRef: any, songVal: string, id: string }) => {

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className="rounded-full" variant='secondary' size='icon' disabled={!props.songRef.current}>
                    <EllipsisVertical size='24' />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-full">
                <div className="p-5 w-full flex flex-col gap-2">
                    <ShareMenu songRef={props.songRef} songVal={props.songVal} />
                    <DownloadMenu songVal={props.songVal} id={props.id} />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

const ShareMenu = (props: { songRef: any, songVal: string }) => {
    const showShareMenu = () => {
        if (!navigator.share) return;

        navigator.share({ title: `Listen to ${props.songVal} in UnYeleased`, url: window.location.href });
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className="rounded-full h-12 w-full" size="icon" variant='secondary' disabled={!props.songRef.current} id="share-button">
                    <Share />
                    Share
                </Button>
            </DrawerTrigger>
            <DrawerContent className="min-h-36 rounded-t-3xl bg-transparent" showGrabThing={false}>
                <div className="bg-primary-foreground w-[93%] translate-x-3.5 h-[95%] -translate-y-2 rounded-3xl border">
                    <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-muted-foreground" />
                    <div className="flex items-center justify-center my-20 mx-2">
                        <div className="w-28 h-20 flex flex-col justify-center items-center gap-3">
                            <div className="rounded-full p-5 bg-secondary active:bg-primary/30 active:scale-95 transition-all" onClick={() => { navigator.clipboard.writeText(location.href); toast("Copied song link to clipboard"); }}>
                                <Copy />
                            </div>
                            <p className="text-center">Copy link</p>
                        </div>
                        <div className="w-20 h-20 flex flex-col justify-center items-center gap-3" onClick={showShareMenu}>
                            <div className="rounded-full p-5 bg-secondary active:bg-primary/30">
                                <EllipsisVertical className="rotate-90" />
                            </div>
                            <p className="text-center">More</p>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export const DownloadMenu = (props: { songVal:string, id: string, className?:string }) => {
    async function downloadSong() {
        const audioLocation = `/song-files/songs/${props.id.toLowerCase().replace(" ", "-")}/${props.songVal}.m4a`;

        try {
            const response = await fetch(audioLocation);
            if (!response.ok) throw new Error(`Failed to fetch ${audioLocation}`);

            const blob = await response.blob();

            saveAs(blob, `${props.songVal}.m4a`);
        } catch (error) {
            console.error(`Error adding file "${props.songVal}":`, error);
        }
    }

    return (
        <Button className={cn("rounded-full h-12 w-full", props.className)} size="icon" variant='secondary' onClick={downloadSong}>
            <DownloadIcon />
            Download song
        </Button>
    )
}