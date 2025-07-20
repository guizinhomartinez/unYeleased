import { cn, formatDuration } from "@/lib/utils"
import { Skeleton } from "../ui/skeleton"
import { AlbumPageTracklistInterface } from "@/lib/interfaces"
import { useIsMobile } from "@/hooks/use-mobile"
import { AutoMarquee } from "../songControlsSubcomponents/autoMarquee"
import { Button } from "../ui/button"
import { EllipsisVertical, MicVocal } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { DownloadMenu } from "../songControlsSubcomponents/moreOptionsMenu"
import { useEffect, useState } from "react"

export default function AlbumPageTracklist(props: AlbumPageTracklistInterface) {
    return !props.songs.length ? <LoadingComponent /> : <AlbumPageTracklistReal {...props} />
}

function AlbumPageTracklistReal(props: AlbumPageTracklistInterface) {
    const isMobile = useIsMobile();
    const [durations, setDurations] = useState<(string | null)[]>([]);

    useEffect(() => {
        async function loadDurations() {
            const newDurations = await Promise.all(
                props.songs.map((song) => {
                    return new Promise<string | null>((resolve) => {
                        const audioPrefix = `/song-files/songs/${props.id.toLowerCase().replace(" ", "-")}/`;
                        const audioFileType = '.m4a';
                        const audio = new Audio(audioPrefix + song.title + audioFileType);

                        audio.addEventListener("loadedmetadata", () => {
                            resolve(formatDuration(audio.duration));
                        });
                        audio.addEventListener("error", () => {
                            resolve(null);
                        });
                    });
                })
            );

            setDurations(newDurations);
        };

        loadDurations();
    }, [props.songs, props.id]);

    console.log(durations)

    return (
        <div className={cn('transition-all duration-500 bg-primary-foreground/50 rounded-xl overflow-hidden w-full border border-muted', !props.newStyle && 'border-2', props.appearBar ? (props.newStyle ? (isMobile ? 'mb-20' : 'mb-16') : 'mb-24') : (props.newStyle ? (isMobile ? '-mb-0' : '-mb-8') : '-mb-4'))}>
            {props.songs.map((element, index) => (
                <div
                    key={index}
                    className={cn("flex p-2 items-center [&:not(:last-of-type)]:border-b border-b-secondary [&:not(:last-of-type)]:pb-3 justify-start gap-2 transition-colors h-full",
                        props.playingSong === element.title ? 'bg-primary/10 border-b-transparent' : 'cursor-pointer hover:bg-primary/5')}
                    onClick={() => props.handleClickEvent(element, index)}
                    tabIndex={0}
                >
                    <div className="flex w-full items-center justify-between gap-2">
                        <div className="flex h-full max-w-[65%] md:max-w-[80%] lg:max-w-full items-center gap-2 overflow-hidden">
                            <div className='flex items-center gap-3 relative justify-center'>
                                <div className='w-8 md:w-12 flex items-start justify-center font-mono'>
                                    <p>{index + 1}</p>
                                </div>
                            </div>
                            <div className='flex flex-col max-w-[58vw] h-full'>
                                <AutoMarquee text={element.title ? element.title : ""} className="text-sm font-semibold" number={index} />
                                <AutoMarquee text={element.artist ? element.artist : ""} className="text-sm text-muted-foreground" number={index + 2} />
                            </div>
                        </div>
                        <div className="flex min-w-fit items-center gap-3" onClick={(e) => e.stopPropagation()}>
                            {durations[index] ?
                                <span className="text-sm text-muted-foreground min-w-[40px] text-right font-mono">
                                    {durations[index]}
                                </span>
                                :
                                <Skeleton className="w-10 h-7" />
                            }

                            <Popover>
                                <PopoverTrigger onClick={(e) => e.stopPropagation()}>
                                    <Button className="rounded-full bg-transparent" variant="outline" size="icon">
                                        <EllipsisVertical />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="flex flex-col gap-2 rounded-2xl p-2 max-w-72 items-center">
                                    <DownloadMenu id={props.id} songVal={element.title} className="rounded-xl w-full" />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function LoadingComponent() {
    const [randomNumber1] = useState(32);
    const [randomNumber2] = useState(48);

    function TrackItem({ index }: { index: number }) {
        return (
            <div className={cn("flex p-2 items-center [&:not(:last-of-type)]:border-b border-b-secondary [&:not(:last-of-type)]:pb-3 justify-start gap-2 transition-colors h-full cursor-not-allowed")}>
                <div className='flex items-center gap-3 relative justify-center'>
                    <div className='w-12 flex items-right justify-center'>
                        <div className='w-2 text-right'>{index + 1}</div>
                    </div>
                </div>
                <div className="flex gap-2 w-full justify-between">
                    <div className='select-none whitespace-pre overflow-hidden shadowed-song-name'>
                        <div className="max-w-52"><Skeleton className={cn('rounded-xl h-5', `w-${randomNumber1}`)} /></div>
                        <div><Skeleton className={cn('rounded-xl h-5 translate-y-0.5', `w-${randomNumber2}`)} /></div>
                    </div>
                    <div className="flex justify-center items-center">
                        <Skeleton className="w-10 h-7" />
                    </div>
                </div>

            </div>
        )
    }

    return (
        <div className={cn('transition-all duration-500 bg-primary-foreground/50 rounded-xl overflow-hidden w-full border border-muted -mb-4')}>

            <TrackItem index={0} />
            <TrackItem index={1} />
            <TrackItem index={2} />
            <TrackItem index={3} />
            <TrackItem index={4} />
            <TrackItem index={5} />
            <TrackItem index={6} />
            <TrackItem index={7} />
            <TrackItem index={8} />
            <TrackItem index={9} />
            <TrackItem index={10} />
            <TrackItem index={11} />
        </div>
    )
}