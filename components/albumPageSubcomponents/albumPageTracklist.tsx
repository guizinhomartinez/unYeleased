import { cn } from "@/lib/utils"
import { Skeleton } from "../ui/skeleton"
import { AlbumPageTracklistInterface } from "@/lib/interfaces"
import { useIsMobile } from "@/hooks/use-mobile"

export default function AlbumPageTracklist(props: AlbumPageTracklistInterface) {
    return !props.songs.length ? <LoadingComponent /> : <AlbumPageTracklistReal {...props} />
}

function AlbumPageTracklistReal(props: AlbumPageTracklistInterface) {
    const isMobile = useIsMobile();

    return (
        <div className={cn('transition-all duration-500 bg-primary-foreground/50 rounded-xl overflow-hidden w-full border border-muted', !props.newStyle && 'border-2', props.appearBar ? (props.newStyle ? (isMobile ? 'mb-20' : 'mb-16') : 'mb-24') : (props.newStyle ? (isMobile ? '-mb-0' : '-mb-8') : '-mb-4'))}>
            {props.songs.map((element, index) => (
                <div
                    key={index}
                    className={cn("flex p-2 items-center [&:not(:last-of-type)]:border-b border-b-secondary [&:not(:last-of-type)]:pb-3 justify-start gap-2 transition-colors h-full",
                        props.playingSong === element.title ? 'bg-primary/15 border-b-transparent' : 'cursor-pointer hover:bg-primary/5')}
                    onClick={() => props.handleClickEvent(element, index)}
                    tabIndex={0}
                >
                    <div className='flex items-center gap-3 relative justify-center'>
                        <div className='w-12 flex items-start justify-center overflow-hidden'>
                            <div className='w-2'>{index + 1}</div>
                        </div>
                    </div>
                    <div className='select-none whitespace-pre overflow-hidden w-[80%] shadowed-song-name'>
                        <div className="text-sm font-semibold max-w-52">{element.title ? element.title : ""}</div>
                        <div className='text-sm text-muted-foreground'>{element.artist ? element.artist : ""}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function LoadingComponent() {
    const randomNumber1 = Math.floor(Math.random() * 48);
    const randomNumber2 = Math.floor(Math.random() * 56);
    function TrackItem({ index }: { index: number }) {
        return (
            <div className={cn("flex p-2 items-center [&:not(:last-of-type)]:border-b border-b-secondary [&:not(:last-of-type)]:pb-3 justify-start gap-2 transition-colors h-full cursor-not-allowed")}>
                <div className='flex items-center gap-3 relative justify-center'>
                    <div className='w-12 flex items-right justify-center'>
                        <div className='w-2 text-right'>{index + 1}</div>
                    </div>
                </div>
                <div className='select-none whitespace-pre overflow-hidden shadowed-song-name'>
                    <div className="text-sm font-semibold max-w-52"><Skeleton className={cn('rounded-full h-5', `w-${randomNumber1}`)}  /></div>
                    <div className='text-sm text-muted-foreground'><Skeleton className={cn('rounded-full h-5 translate-y-0.5', `w-${randomNumber2}`)} /></div>
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