import Link from "next/link";
import { Toaster } from "./ui/sonner";
import { Button } from "./ui/button";
import { BookOpenText, ChevronLeft, Maximize2, Minimize2, Pause, Play, Share } from "lucide-react";
import Image from 'next/image';
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer as Drawer2 } from 'vaul';
import { Separator } from "./ui/separator";
import { AlbumExplanation } from "./albumExplanation";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { albumPage, cn, Song } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Key } from "react";
import { SongControls } from "./songControls";
import { DesktopAlbumExplanation, MobileAlbumExplanation } from "./albumPage";
import BasicPageStuff from "./basicPageStuff";

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
        searchQuery,
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
        setSearchQuery,
        setVolumeVal,
        songCreator,
        volumeVal,
        year
    }: albumPage) {
    return (
        <div>
            <BasicPageStuff />
            <div className='flex m-5 mt-12 md:m-16 md:mt-16 gap-4 flex-col md:flex-row'>
                <div className={'flex gap-y-2 flex-col items-center justify-start md:w-96'}>
                    <div className="sticky top-5 flex flex-col gap-2">
                        <div className={cn("flex flex-col gap-3 items-center justify-center rounded-xl relative p-4 px-8", !useIsMobile() ? "border border-muted h-fit overflow-hidden" : "w-full h-full")}>
                            <Image src={`/song-files/covers/${id.toLowerCase()}.jpg`} alt={`${id.toLowerCase()}`} width={0} height={0} className="absolute inset-0 bg-cover bg-center opacity-10 blur-2xl size-full touch-none select-none z-10" />
                            <div className="flex gap-2 flex-col items-center justify-center">
                                <Image src={`/song-files/covers/${id.toLowerCase()}.jpg`} alt={id} width={!useIsMobile() ? 260 : 320} height={!useIsMobile() ? 260 : 320} priority={true} className='md:mt-4 rounded-xl z-20' />
                                <div className='flex flex-col mt-2 justify-center items-center'>
                                    <p className='text-3xl font-semibold text-center'>{albumName}</p>
                                    <p className='text-primary/60'>{albumCreator}</p>
                                    <p className='text-primary/40'>{year} • {songs.length} songs</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl h-fit border border-muted bg-primary-foreground/50 w-full flex flex-col gap-2">
                            <div className="text-primary/50">{credits}</div>
                            <Button className="rounded-xl" variant="secondary" disabled>Original link(s)</Button>
                        </div>
                    </div>
                </div>
                {useIsMobile() && <div className="my-2 h-px w-full bg-muted" />}
                <div className="flex flex-col gap-2 w-full h-full">
                    <div className='flex gap-4 justify-between items-center md:items-end w-full'>
                        <p className="font-semibold text-2xl">Tracklist</p>
                        <div className="inline-flex gap-2">
                            {!useIsMobile() ?
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
                            <Button className={`rounded-full h-12 transition-all duration-300 justify-normal  ${isPlaying ? 'w-12' : 'w-24'}`} onClick={() => playAlbum()}>
                                {!isPlaying ? <Play /> : <Pause />}
                                <div className={`transition-all text-center ml-1 duration-300 ${isPlaying ? 'opacity-0' : ''}`}>
                                    {!isPlaying ? String('Play') : String('')}
                                </div>
                            </Button>
                        </div>
                    </div>
                    <div className={cn('transition-all duration-500 bg-primary-foreground/50 rounded-xl overflow-hidden w-full border border-muted', appearBar ? 'mb-20' : '-mb-4')}>
                        {songs.filter((op: Song) => (op.title.toLowerCase().includes(searchQuery.toLowerCase()))).map((element, index) => (
                            <div key={index} className={cn("flex p-2 items-center [&:not(:last-of-type)]:border-b border-b-secondary [&:not(:last-of-type)]:pb-3 justify-start gap-2 transition-colors h-full", currentSongIndex === index ? 'bg-primary/15 border-b-transparent' : 'cursor-pointer hover:bg-primary/5')} onClick={() => handleClickEvent(element, index)}>
                                <div className='flex items-center gap-3 relative justify-center'>
                                    <div className='w-12 flex items-right justify-center'>
                                        {/* 
                                        // @ts-ignore */}
                                        <p className='w-2 text-right'>{index + 1}</p>
                                    </div>
                                </div>
                                <div className='select-none whitespace-pre overflow-hidden w-3/4 shadowed-song-name'>
                                    <div className="text-sm font-semibold max-w-52">{element.title || <Skeleton className='w-28 h-6 translate-y-0.5' />}</div>
                                    <div className='text-sm text-muted-foreground'>{element.artist || <Skeleton className='w-28 h-6 translate-y-0.5' />}</div>
                                </div>
                            </div>
                        ))}
                    </div>
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
                />
            </div>
        </div>
    )
}