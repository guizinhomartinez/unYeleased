import Link from "next/link";
import { Toaster } from "./ui/sonner";
import { Button } from "./ui/button";
import { BookOpenText, ChevronLeft, Dot, Maximize2, Minimize2, Pause, Play, Search } from "lucide-react";
import Image from 'next/image';
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer as Drawer2 } from 'vaul';
import { Separator } from "./ui/separator";
import { AlbumExplanation } from "./albumExplanation";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { AlbumExplanationInterface, albumPage, cn, Song } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { SongControls } from "./songControls";
import BasicPageStuff from "./basicPageStuff";

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
        credits
    }: albumPage) {
    const capitalizeFirstLetter = (val: string) => String(val).charAt(0).toUpperCase() + String(val).slice(1);
    return (
        <div>
            <BasicPageStuff />
            <div className='flex flex-col md:flex-row gap-4 transition-all duration-300'>
                <div className='flex-1'>
                    <div className={`flex gap-4 items-center p-4 md:p-8 mt-4 overflow-x-hidden pt-16 w-full justify-center md:justify-normal border-b-2 border-b-primary-foreground`}>
                        <div className='flex flex-col md:flex-row items-center gap-5'>
                            <Image src={`/song-files/covers/${id.toLowerCase()}.jpg`} alt={id} width={!useIsMobile() ? 260 : 280} height={!useIsMobile() ? 260 : 280} priority={true} className='md:mt-4 rounded-xl outline outline-primary/10' />
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
                                    <Button className={`rounded-full h-12 transition-all duration-300 justify-normal  ${isPlaying ? 'w-12' : 'w-24'}`} onClick={() => playAlbum()}>
                                        {!isPlaying ? <Play /> : <Pause />}
                                        <div className={`transition-all text-center ml-1 duration-300 ${isPlaying ? 'opacity-0' : ''}`}>
                                            {!isPlaying ? String('Play') : String('')}
                                        </div>
                                    </Button>
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

                    <div className='p-2 bg-primary-foreground/25 mt-6 rounded-lg mx-4 md:mx-8 border-2 border-secondary/50 text-sm text-primary/50'>{credits || "No credits provided"}</div>

                    <div className='m-4 md:m-8 md:mt-4 flex flex-col gap-4'>
                        <div className='flex items-center relative'>
                            <Input type='search' className='pl-[3em] border-2 border-secondary rounded-xl bg-primary-foreground/50' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for your favorite song"></Input>
                            <div className='absolute left-3 pr-2 py-2 border-r-2 border-r-secondary cursor-pointer'>
                                <Search size={16} strokeWidth={2} className=' text-muted-foreground/80' />
                            </div>
                        </div>
                        <div className={cn('transition-all duration-500 bg-primary-foreground/50 rounded-xl overflow-hidden border-2 border-secondary', appearBar ? 'mb-24' : '-mb-4')}>
                            {songs.filter((op: Song) => (op.title.toLowerCase().includes(searchQuery.toLowerCase()))).map((element, index) => (
                                <div key={index} className={cn("flex p-2 items-center [&:not(:last-of-type)]:border-b border-b-secondary [&:not(:last-of-type)]:pb-3 justify-start gap-2 transition-colors h-full", currentSongIndex === index ? 'bg-primary/15 border-b-transparent' : 'cursor-pointer hover:bg-primary/5')} onClick={() => handleClickEvent(element, index)}>
                                    <div className='flex items-center gap-3 relative justify-center'>
                                        {/* <div className={cn('cursor-default rounded-full w-12 items-center flex justify-center', imageSize === 280 && 'absolute top-0.5 left-0.5 mask-circle bg-background/50 backdrop-blur-md rounded-full text-sm')}>{index + 1}</div> */}
                                        <div className='w-12 flex items-right justify-center'>
                                            <p className='w-2 text-right'>{index + 1}</p>
                                        </div>
                                        {/* <Image src={`/song-files/covers/${id.toLowerCase()}.jpg`} alt="" width={60} height={60} className='rounded-lg shadow-sm' /> */}
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

export function DesktopAlbumExplanation({ setShowExplanation, showExplanation, fullscreen, setFullscreen, id, variant }: AlbumExplanationInterface) {
    return (
        <Drawer2.Root direction="right">
            <Drawer2.Trigger asChild>
                <Button variant='outline' className={cn('rounded-full h-12', variant === 1 && "w-48")} size={variant === 1 ? 'icon' : 'default'} onClick={() => setShowExplanation(!showExplanation)}>
                    <BookOpenText />
                    {variant === 1 && "Album Explanation"}
                </Button>
            </Drawer2.Trigger>
            <Drawer2.Portal>
                <Drawer2.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer2.Content
                    className={cn("fixed right-4 top-4 bottom-4 outline-none transition-all duration-300 ease-in-out", fullscreen ? "max-w-[97.5vw]" : "max-w-[35%]")}
                    // The gap between the edge of the screen and the drawer2 is 8px in this case.
                    style={{ '--initial-transform': 'calc(100% + 24px)' } as React.CSSProperties}
                >
                    <div className="mt-4 h-1 w-12 rounded-full bg-muted-foreground absolute rotate-90 top-1/2 -translate-y-1/2 -left-[1.1em] cursor-grab group-active:cursor-grabbing" />
                    <div className="bg-primary-foreground h-full w-full grow flex flex-col rounded-[16px]">
                        <div className="p-4 overflow-y-auto h-full">
                            <div className='pt-2'>
                                <div className='flex items-center justify-between mx-auto gap-2'>
                                    <div className='w-2' />
                                    <p className='text-3xl font-bold text-center'>Album Explanation</p>
                                    <div className='cursor-pointer mr-2' onClick={(e) => setFullscreen(!fullscreen)}>
                                        {!fullscreen ? <Maximize2 /> : <Minimize2 />}
                                    </div>
                                </div>
                                <Separator orientation="horizontal" className="h-1 rounded-full bg-muted mt-1 mb-2" />
                            </div>
                            <AlbumExplanation id={id} />
                        </div>
                    </div>
                </Drawer2.Content>
            </Drawer2.Portal>
        </Drawer2.Root>
    )
}

export function MobileAlbumExplanation({ setShowExplanation, showExplanation, id, variant }: AlbumExplanationInterface) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant='outline' className={cn('rounded-full h-12', variant === 1 && "w-48")} size={variant === 1 ? 'icon' : 'default'} onClick={() => setShowExplanation(!showExplanation)}>
                    <BookOpenText />
                    {variant === 1 && "Album Explanation"}
                </Button>
            </DrawerTrigger>
            <DrawerContent className={cn('h-[93vh] items-center')}>
                <div className='overflow-y-auto h-full w-full'>
                    <AlbumExplanation id={id} />
                </div>
            </DrawerContent>
        </Drawer>
    )
}