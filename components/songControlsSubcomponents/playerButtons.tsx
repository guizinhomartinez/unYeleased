import { Shuffle, SkipBack, SkipForward } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { PlayIcon, RepeatIcon } from "@/lib/songControlsFunctions"
import { SongPlayerButtonsInterface } from "@/lib/interfaces"

export default function PlayerButtons(props: SongPlayerButtonsInterface) {
    return (
        <>
            {props.extraButtons &&
                <>
                    <Button
                        size="icon"
                        className={cn('rounded-full', props.buttonVariant !== "ghost" && "bg-transparent focus:bg-transparent", props.biggerPadding ? "p-6" : "p-5", !props.shuffle && 'opacity-50')}
                        variant={props.buttonVariant || "ghost"}
                        onClick={() => props.setShuffle(!props.shuffle)}
                    >
                        <Shuffle />
                    </Button>
                    <Button
                        size="icon"
                        className={cn('rounded-full', props.buttonVariant !== "ghost" && "bg-transparent focus:bg-transparent", props.biggerPadding ? "p-6" : "p-5", props.songVal !== "" || props.songVal !== null && 'opacity-50 cursor-not-allowed')}
                        variant={props.buttonVariant || "ghost"}
                        onClick={() => props.handleSkipSong(true)}
                    >
                        <SkipBack size='32' />
                    </Button>
                </>
            }
            <Button
                className={cn('rounded-full focus:bg-primary', props.biggerPadding ? "p-6" : "p-5", (!props.songVal || props.songVal === "" || props.isLoading || props.isLoading === null) && 'opacity-50 cursor-not-allowed')}
                size="icon"
                onClick={() => { (!props.isLoading || props.isLoading === null) && props.setIsPlaying(props.songVal !== "" && !props.isPlaying) }}
                disabled={props.isLoading === null}
            >
                <PlayIcon isLoading={props.isLoading} isPlaying={props.isPlaying} songRef={props.songRef} size={32} />
            </Button>
            <Button
                size="icon"
                className={cn('rounded-full', props.buttonVariant !== "ghost" && "bg-transparent focus:bg-transparent", props.biggerPadding ? "p-6" : "p-5", props.songVal !== "" || props.songVal !== null && 'opacity-50 cursor-not-allowed')}
                variant={props.buttonVariant || "ghost"}
                onClick={() => props.handleSkipSong(false)}
            >
                <SkipForward size='32' />
            </Button>
            {props.extraButtons &&
                <>
                    <Button
                        size="icon"
                        className={cn('rounded-full', props.buttonVariant !== "ghost" && "bg-transparent focus:bg-transparent", props.biggerPadding ? "p-6" : "p-5", props.repeat === 0 && 'opacity-50')}
                        variant={props.buttonVariant || "ghost"}
                        onClick={() => props.setRepeat(props.repeat !== undefined && (props.repeat >= 2 ? 0 : props.repeat + 1))}
                    >
                        <RepeatIcon repeat={props.repeat || 0} />
                    </Button>
                </>
            }
        </>
    )
}