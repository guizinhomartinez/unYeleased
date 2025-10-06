import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar";
import { toast } from "sonner";
import { VisuallyHidden } from "radix-ui";
import { Dialog as DialogPrimitive } from "radix-ui";

export default function DownloadAlbumButton(props: { songs: any, id: string, variant: number }) {
    const zip = new JSZip();
    const [downloadedPercentage, setDownloadedPercentage] = useState(0);
    const [dialogOpened, setDialogOpened] = useState(false);
    const cancel = useRef(false);

    const downloadFunction = async () => {
        cancel.current = false;

        for (let index = 0; index < props.songs.length; index++) {
            const songNames = props.songs[index].title;
            if (cancel.current) return;

            const audioPrefix = `/song-files/songs/${props.id.toLowerCase().replace(" ", "-")}/`;
            const audioFileType = '.m4a';
            const fileLocation = audioPrefix + songNames + audioFileType;

            try {
                const response = await fetch(fileLocation);
                if (!response.ok) throw new Error(`Failed to fetch ${fileLocation}`);

                const blob = await response.blob();
                zip.file(songNames + audioFileType, blob);
            } catch (error) {
                console.error(`Error adding file "${songNames}":`, error);
            }

            const percentDone = ((index + 1) / props.songs.length) * 100;
            setDownloadedPercentage(Math.round(percentDone));
        }

        if (cancel.current) return;

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${props.id}.zip`);
    }

    useEffect(() => {
        downloadedPercentage === 100 && setTimeout(() => setDialogOpened(false), 2000);
    }, [downloadedPercentage])

    return (
        <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
            <DialogTrigger asChild>
                <Button
                    className="rounded-full size-12" variant={props.variant === 1 ? "secondary" : "outline"}
                    size="icon"
                    onClick={() => {
                        downloadFunction();
                        setDialogOpened(true);
                    }}
                >
                    <DownloadIcon />
                    {props.variant === 1 && "Download album"}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90%] max-w-[80%] md:max-w-[30%] !rounded-xl">
                <DialogPrimitive.Title asChild>
                    <VisuallyHidden.Root>Info card containing single explanation and lyrics</VisuallyHidden.Root>
                </DialogPrimitive.Title>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 justify-center items-center">
                        <p className="text-lg font-semibold leading-none tracking-tight text-center">Download started</p>
                        <p className="text-sm text-muted-foreground text-center">Sit tight and wait for the download to finish</p>
                    </div>
                    <div className="flex gap-2 items-center justify-center">
                        <AnimatedCircularProgressBar
                            value={downloadedPercentage}
                            gaugePrimaryColor="hsl(var(--primary))"
                            gaugeSecondaryColor="hsl(var(--background))"
                        />
                    </div>
                </div>
                <DialogFooter className="pt-6">
                    <Button
                        className="w-full rounded-full p-5"
                        variant='secondary'
                        onClick={() => {
                            toast.info("Cancelled album download");
                            setDialogOpened(false);
                            cancel.current = true;
                        }}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}