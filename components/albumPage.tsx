import Link from "next/link";
import { Button } from "./ui/button";
import { Dot, Search } from "lucide-react";
import Image from 'next/image';
import { useIsMobile } from "@/hooks/use-mobile";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { SongControls } from "./songControls";
import BasicPageStuff from "./basicPageStuff";
import { AlbumPageInterface, SongInterface } from "@/lib/interfaces";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DesktopAlbumExplanation, MobileAlbumExplanation } from "./albumPageSubcomponents/albumPageAlbumExplanation";
import AlbumPageTracklist from "./albumPageSubcomponents/albumPageTracklist";
import PlayButton from "./albumPageSubcomponents/ui/playButton";
import { useState } from "react";

export default function AlbumPage(
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
        setSearchQuery,
        playAlbum,
        appearBar,
        setAppearBar,
        currentSongIndex,
        handleClickEvent,
        year,
        songRef,
        playingSong,
        setIsPlaying,
        volumeVal,
        setVolumeVal,
        songCreator,
        handleSkipSong,
        repeatAlbum,
        setRepeatAlbum,
        credits,
        isLoading,
        isFullscreenMode,
        setIsFullscreenMode,
        showLyricsFullscreen,
        setShowLyricsFullscreen,
        shuffle,
        setShuffle
    }: AlbumPageInterface) {
    return (
        <div>
            <BasicPageStuff />
            <div className='flex flex-col md:flex-row gap-4 transition-all duration-300'>
                <div className='flex-1'>
                    <div className={`flex gap-4 items-center p-4 md:p-8 mt-4 overflow-x-hidden pt-16 w-full justify-center md:justify-normal border-b-2 border-b-primary-foreground`}>
                        <div className='flex flex-col md:flex-row items-center gap-5'>
                            <SongCover id={id} newAlbumPage={false} />
                            <div className='flex flex-col gap-2'>
                                <div className='text-4xl font-semibold text-center md:text-left'>{albumName || capitalizeFirstLetter(id.replace("-", " "))}</div>
                                <div className='flex flex-col justify-center'>
                                    <div className='inline-flex items-center justify-center md:justify-normal'>
                                        <div className='text-md md:text-xl text-primary/75 whitespace-pre text-center md:text-left'>{albumCreator || <Skeleton className='w-24 h-5' />}</div>
                                        <Dot className='text-primary/75' />
                                        <div className='text-md md:text-xl text-primary/75 text-center md:text-left'>{year || <Skeleton className='w-16 h-6 translate-y-0.5' />}</div>
                                    </div>
                                    <div className='inline-flex items-center justify-center md:justify-normal'>
                                        <div className='text-md md:text-xl text-primary/75 whitespace-pre text-center md:text-left'>{songs.length || <Skeleton className='w-5 h-5 translate-y-1 inline-flex' />} songs</div>
                                    </div>
                                </div>
                                <div className='flex gap-2 justify-center md:justify-normal mt-2'>
                                    <PlayButton isPlaying={isPlaying} playAlbum={playAlbum} />
                                    {!useIsMobile() ?
                                        <DesktopAlbumExplanation
                                            setShowExplanation={setShowExplanation}
                                            showExplanation={showExplanation}
                                            fullscreen={fullscreen}
                                            setFullscreen={setFullscreen}
                                            id={id}
                                            variant={1}
                                        />
                                        :
                                        <MobileAlbumExplanation
                                            setShowExplanation={setShowExplanation}
                                            showExplanation={showExplanation}
                                            id={id}
                                            variant={1}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='p-2 bg-primary-foreground/25 mt-6 rounded-xl mx-4 md:mx-8 border-2 border-secondary/50 text-sm text-primary/50 flex flex-col gap-2'>
                        <div className="inline-flex grow items-center text-primary/50">
                            {credits.length > 0 ?
                                <p className="">
                                    Credits to{" "}
                                    {credits.map((element, index) => (
                                        <span key={index}>
                                            {element.name} for the {element.type}
                                            {index === credits.length - 2 ? " & " : index < credits.length - 2 ? ", " : ""}
                                        </span>
                                    ))}
                                </p>
                                :
                                <p>No credits avaliable</p>
                            }
                        </div>
                        {credits.length > 0 &&
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="rounded-xl w-fit" variant="secondary">Original link{credits.length > 1 && "s"}</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Sources</DialogTitle>
                                    <DialogDescription>All sources used for this album</DialogDescription>
                                    {credits.map((element, index) => (
                                        <Link href={element.originalLink[index]} key={index} target="_blank" className="w-full rounded-xl -mb-1">
                                            <Button variant='secondary' className="w-full rounded-xl -mb-4">
                                                {element.name}
                                            </Button>
                                        </Link>
                                    ))}
                                </DialogContent>
                            </Dialog>
                        }
                    </div>

                    <div className='m-4 md:m-8 md:mt-4 flex flex-col gap-4'>
                        <div className='flex items-center relative'>
                            <Input type='search' className='pl-[3em] border-2 border-secondary rounded-xl bg-primary-foreground/50' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for your favorite song"></Input>
                            <div className='absolute left-3 pr-2 py-2 border-r-2 border-r-secondary cursor-pointer'>
                                <Search size={16} strokeWidth={2} className=' text-muted-foreground/80' />
                            </div>
                        </div>
                        <AlbumPageTracklist
                            appearBar={appearBar}
                            currentSongIndex={currentSongIndex}
                            handleClickEvent={handleClickEvent}
                            songs={songs}
                            newStyle={false}
                            playingSong={playingSong}
                        />
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
                    isLoading={isLoading}
                    isFullscreenMode={isFullscreenMode}
                    setIsFullscreenMode={setIsFullscreenMode}
                    showLyricsFullscreen={showLyricsFullscreen}
                    setShowLyricsFullscreen={setShowLyricsFullscreen}
                    shuffle={shuffle}
                    setShuffle={setShuffle}
                />
            </div>
        </div>
    )
}

export function SongCover({ id, newAlbumPage }: { id: string, newAlbumPage: boolean }) {
    const [loaded, setLoaded] = useState(false);
    const isMobile = useIsMobile();
    const size = !newAlbumPage ? (isMobile ? 280 : 260) : (isMobile ? 320 : 260);

    return (
        <div className="relative">
            {!loaded && (
                <Skeleton
                    className="absolute top-0 left-0 rounded-xl"
                    style={{ width: size, height: size }}
                />
            )}
            <Image
                src={`/song-files/covers/${id.toLowerCase()}.jpg`}
                alt={id}
                width={size}
                height={size}
                priority={true}
                className={cn('rounded-xl transition-opacity duration-300', !newAlbumPage && "outline outline-primary/10", loaded ? 'opacity-100 md:mt-4' : 'opacity-0')}
                onLoad={() => setLoaded(true)}
            />
        </div>
    )
}