import { Button } from "./ui/button";
import Image from 'next/image';
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { SongControls } from "./songControls";
import BasicPageStuff from "./basicPageStuff";
import { AlbumPageInterface } from "@/lib/interfaces";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import Link from "next/link";
import { DesktopAlbumExplanation, MobileAlbumExplanation } from "./albumPageSubcomponents/albumPageAlbumExplanation";
import AlbumPageTracklist from "./albumPageSubcomponents/albumPageTracklist";
import PlayButton from "./albumPageSubcomponents/ui/playButton";
import { SongCover } from "./albumPage";

export default function NewAlbumPage(
    {
        albumName,
        albumCreator,
        id,
        isPlaying,
        showExplanation,
        setShowExplanation,
        fullscreen,
        setFullscreen,
        songs,
        playAlbum,
        appearBar,
        currentSongIndex,
        handleClickEvent,
        songRef,
        playingSong,
        credits,
        handleSkipSong,
        repeatAlbum,
        setAppearBar,
        setIsPlaying,
        setRepeatAlbum,
        setVolumeVal,
        songCreator,
        volumeVal,
        year,
        isLoading,
        isFullscreenMode,
        setIsFullscreenMode,
        showLyricsFullscreen,
        setShowLyricsFullscreen,
        shuffle,
        setShuffle
    }: AlbumPageInterface) {
    const isMobile = useIsMobile();

    return (
        <>
            <BasicPageStuff albumPageStyle={isMobile} />
            <div className='flex m-5 mt-12 md:m-16 md:mt-16 gap-4 flex-col md:flex-row'>
                <div className={'flex gap-y-2 flex-col items-center justify-start md:w-[425px]'}>
                    <div className="relative flex flex-col gap-2">
                        <div className={cn("flex flex-col gap-3 items-center justify-center rounded-xl relative p-4 px-8", !isMobile ? "border border-muted h-fit overflow-hidden" : "w-full h-full")}>
                            <Image src={`/song-files/covers/${id.toLowerCase()}.jpg`} alt={`${id.toLowerCase()}`} width={0} height={0} className="absolute inset-0 bg-cover bg-center opacity-10 blur-2xl size-full touch-none select-none pointer-events-none" />
                            <div className="flex gap-2 flex-col items-center justify-center">
                                <SongCover id={id} newAlbumPage={true} />
                                <div className='flex flex-col mt-2 justify-center items-center'>
                                    <p className='text-3xl font-semibold text-center'>{albumName}</p>
                                    <p className='text-primary/60 text-center'>{albumCreator || <Skeleton className='w-24 h-5' />}</p>
                                    <p className='text-primary/40'>{year || <Skeleton className='w-16 h-6 translate-y-0.5' />} • {songs.length} songs</p>
                                </div>
                            </div>
                        </div>

                        <div className={cn("rounded-xl h-fit border border-muted bg-primary-foreground/50 w-full mx-auto flex flex-col gap-2", credits.length > 0 ? "p-4" : "px-4 py-2 opacity-80")}>
                            {credits.length > 0 ?
                                <>
                                    <div className="inline-flex grow items-center text-primary/50">
                                        <div className="">
                                            Credits to{" "}
                                            {credits.map((element, index) => (
                                                <div key={index}>
                                                    {element.name} for the {element.type}
                                                    {index === credits.length - 2 ? " & " : index < credits.length - 2 ? ", " : ""}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="rounded-xl" variant="secondary">Original link{credits.length > 1 && "s"}</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Sources</DialogTitle>
                                            <DialogDescription>All sources used for this album</DialogDescription>
                                            {credits.map((element, index) => (
                                                <Link href={element.originalLink[index]} key={index} target="_blank" className="w-full rounded-full -mb-1">
                                                    <Button variant='secondary' className="w-full rounded-full -mb-4">
                                                        {element.name}
                                                    </Button>
                                                </Link>
                                            ))}
                                        </DialogContent>
                                    </Dialog>
                                </>
                                :
                                <p className="text-primary/50">No credits avaliable</p>
                            }
                        </div>
                    </div>
                </div>
                {isMobile && <div className="my-2 h-px w-full bg-muted" />}
                <div className="flex flex-col gap-3 w-full h-full">
                    <div className='flex gap-4 justify-between items-center md:items-end w-full'>
                        <div className="font-semibold text-2xl">Tracklist</div>
                        <div className="w-full relative flex justify-end">
                            <div className="flex gap-2">
                                <PlayButton isPlaying={isPlaying} playAlbum={playAlbum} />
                                {!isMobile ?
                                    <DesktopAlbumExplanation
                                        setShowExplanation={setShowExplanation}
                                        showExplanation={showExplanation}
                                        fullscreen={fullscreen}
                                        setFullscreen={setFullscreen}
                                        id={id}
                                        variant={0}
                                    />
                                    :
                                    <MobileAlbumExplanation
                                        setShowExplanation={setShowExplanation}
                                        showExplanation={showExplanation}
                                        id={id}
                                        variant={0}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                    <AlbumPageTracklist
                        appearBar={appearBar}
                        currentSongIndex={currentSongIndex}
                        handleClickEvent={handleClickEvent}
                        songs={songs}
                        newStyle={true}
                        playingSong={playingSong}
                    />
                </div>
            </div>
            <div>
                <SongControls
                    songRef={songRef}
                    songVal={playingSong}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    volumeVal={volumeVal}
                    setVolumeVal={setVolumeVal}
                    image={`/song-files/covers/${id.toLowerCase()}.jpg`}
                    songCreator={songCreator}
                    handleSkipSong={handleSkipSong}
                    repeat={repeatAlbum}
                    setRepeat={setRepeatAlbum}
                    id={id}
                    albumName={albumName}
                    appearBar={appearBar}
                    setAppearBar={setAppearBar}
                    isLoading={isLoading}
                    isFullscreenMode={isFullscreenMode}
                    setIsFullscreenMode={setIsFullscreenMode}
                    showLyricsFullscreen={showLyricsFullscreen}
                    setShowLyricsFullscreen={setShowLyricsFullscreen}
                    shuffle={shuffle}
                    setShuffle={setShuffle}
                />
            </div>
        </>
    )
}