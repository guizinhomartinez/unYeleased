import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";
import { saveAs } from 'file-saver';

export default function DownloadAlbumButton(props: { songs: any, id: string, variant: number }) {
    const zip = new JSZip();

    const downloadFunction = () => {
        async function zipFolder() {
            for (let index = 0; index < props.songs.length; index++) {
                const songNames = props.songs[index].title;
                console.log(songNames);

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
            }

            zip.generateAsync({ type: "blob" }).then(content => {
                saveAs(content, `${props.id}.zip`);
            })
        }

        zipFolder();

        toast("Download will start in a moment", {
            description: "Check your browser’s download section for more information",
        })
    }

    return (
        <Button className="rounded-full size-12" variant={props.variant === 1 ? "secondary" : "outline"} size="icon" onClick={downloadFunction}>
            <DownloadIcon />
            {props.variant === 1 && "Download album"}
        </Button>
    )
}