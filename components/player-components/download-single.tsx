import { DownloadIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import saveAs from "file-saver";

const DownloadSingle = (props: {
    songVal: string;
    className?: string;
    onClick?: React.MouseEventHandler;
    source: string;
}) => {
    async function downloadSong() {
        const audioLocation = props.source;

        try {
            const response = await fetch(audioLocation);
            if (!response.ok)
                throw new Error(`Failed to fetch ${audioLocation}`);

            const blob = await response.blob();

            saveAs(blob, `${props.songVal}.m4a`);
        } catch (error) {
            console.error(`Error adding file "${props.songVal}":`, error);
        }
    }

    return (
        <Button
            className={cn("", props.className)}
            size="icon"
            variant="secondary"
            onClick={() => {
                downloadSong();
            }}
        >
            <DownloadIcon />
            Download
        </Button>
    );
};

export default DownloadSingle;
