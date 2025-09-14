'use client'

import { Button } from "./ui/button";
import Image from 'next/image';
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { SongControls } from "./songControls";
import { AlbumPageInterface, Credits, SongInterface } from "@/lib/interfaces";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import Link from "next/link";
import { DesktopAlbumExplanation, MobileAlbumExplanation } from "./albumPageSubcomponents/albumExplanationWrappers";
import AlbumPageTracklist from "./albumPageSubcomponents/albumPageTracklist";
import AlbumPlayButton from "./albumPageSubcomponents/ui/albumPlayButton";
import { ArrowRightIcon, ChevronLeft, EllipsisVertical, X } from "lucide-react";
import DownloadAlbumButton from "./albumPageSubcomponents/ui/downloadAlbumButton";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { useMedia } from "react-use";
import { AlbumCoverDialog } from "./albumPageSubcomponents/albumCoverMenu";
import AlbumCover from "./albumPageSubcomponents/albumCover";

export default function NewAlbumPage(
    {
        albumName,
        albumCreator,
        id,
        isPlaying,
        showExplanation,
        setShowExplanation,
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
        setShuffle,
        ...props
    }: AlbumPageInterface) {
    const isMobile = useIsMobile();
    const isWideEnough = useMedia('(min-width: 1024px)', true);

    return (
        <>
            <div className='absolute left-4 md:left-5 top-2 md:top-4'>
                <Link href="/">
                    <Button className="rounded-full" size='icon' variant='ghost'>
                        <ChevronLeft />
                    </Button>
                </Link>
            </div>
            <div className={cn('flex m-5 mt-12 md:!pb-10 md:p-8 lg:!px-0 lg:!pt-0 md:mt-16 gap-3 max-w-7xl', isWideEnough ? "flex-row !mx-auto" : "flex-col")}>
                <div className={cn('flex gap-y-2 flex-col items-center justify-start', isWideEnough ? "w-96" : "w-full")}>
                    <div className="relative flex flex-col gap-2">
                        <div className={cn("flex flex-col gap-3 items-center justify-center rounded-xl p-8 pb-4", isWideEnough ? "border border-muted h-fit overflow-hidden relative" : "w-full h-full")}>
                            <Image src={props.albumCover} alt={`${id.toLowerCase()}`} width={0} height={0} className="absolute inset-0 bg-cover bg-center opacity-10 blur-2xl size-full touch-none select-none pointer-events-none" />
                            <div className="flex gap-2 flex-col items-center justify-center">
                                {props.albumCoverInfo.length === 0 || props.albumCoverInfo.length === 1 ?
                                    <AlbumCover id={id} newAlbumPage={true} albumCover={props.albumCover} />
                                    :
                                    <AlbumCoverDialog id={id} newAlbumPage={true} albumCover={props.albumCover} albumName={albumName} albumCoverInfo={props.albumCoverInfo} albumCoverType={props.albumCoverType} setAlbumCoverType={props.setAlbumCoverType} albumCoverDescription={props.albumCoverDescription} />
                                }
                                <div className='flex flex-col mt-2 justify-center items-center'>
                                    <p className='text-3xl font-semibold text-center'>{albumName}</p>
                                    {(albumCreator && songs.length) ? (
                                        <>
                                            <p className='text-primary/60 text-center'>{albumCreator}</p>
                                            <p className='text-primary/40'>{year} • {songs.length} songs</p>
                                        </>

                                    ) : (
                                        <>
                                            <Skeleton className='w-24 h-5' />
                                            <Skeleton className='w-16 h-6 translate-y-0.5' />
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>

                        <div className={cn(
                            "rounded-xl h-fit border border-muted bg-primary-foreground/50 w-full max-w-full mx-auto flex flex-col gap-2",
                            credits.length > 0 ? "p-4" : "px-4 py-2 opacity-50"
                        )}>
                            {credits.length > 0 ? (
                                <>
                                    <div className="inline-flex grow items-center text-primary/50">
                                        <div>
                                            Credits to{" "}
                                            {Object.entries(
                                                credits.reduce((acc, credit) => {
                                                    const type = credit.type;
                                                    const names = Array.isArray(credit.name) ? credit.name : [credit.name];
                                                    const links = Array.isArray(credit.originalLink) ? credit.originalLink : [credit.originalLink];

                                                    if (!acc[type]) acc[type] = [];
                                                    names.forEach((name, i) => {
                                                        acc[type].push({ name, link: links[i] ?? "#" });
                                                    });

                                                    return acc;
                                                }, {} as Record<string, { name: string; link: string }[]>)
                                            ).map(([type, entries], index, array) => (
                                                <span key={type}>
                                                    {entries.map((entry, i) => (
                                                        <span key={i}>
                                                            {entry.name}
                                                            {i === entries.length - 2
                                                                ? " & "
                                                                : i < entries.length - 2
                                                                    ? ", "
                                                                    : ""}
                                                        </span>
                                                    ))}{" "}
                                                    for the {type}
                                                    {index < array.length - 1 ? ", " : ""}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="rounded-xl" variant="secondary">
                                                Original link{credits.length > 1 ? "s" : ""}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-[95vw] md:max-w-lg rounded-2xl">
                                            <DialogTitle className="mb-2">Sources</DialogTitle>
                                            {Object.entries(
                                                credits.reduce((acc, credit) => {
                                                    const names = Array.isArray(credit.name) ? credit.name : [credit.name];
                                                    const links = Array.isArray(credit.originalLink) ? credit.originalLink : [credit.originalLink];

                                                    names.forEach((name, i) => {
                                                        acc.push({ name, link: links[i] ?? "#" });
                                                    });

                                                    return acc;
                                                }, [] as { name: string; link: string }[])
                                            ).map(([_, entry], i) => (
                                                <Link
                                                    key={i}
                                                    href={entry.link}
                                                    target="_blank"
                                                    className="w-full rounded-full group"
                                                >
                                                    <Button variant='link' className="-mb-6 p-0 rounded-xl w-full justify-between">
                                                        {entry.name}
                                                        <ArrowRightIcon size="24" className="opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                                                    </Button>
                                                </Link>
                                            ))}
                                        </DialogContent>
                                    </Dialog>
                                </>
                            ) : (
                                <p className="text-primary/50 text-center">No credits available</p>
                            )}
                        </div>
                    </div>
                </div>
                {!isWideEnough && <div className="my-2 h-px w-full bg-muted" />}
                <div className="flex flex-col gap-3 w-full h-full">
                    <div className='flex gap-4 justify-between items-center md:items-end w-full'>
                        <div className="font-semibold text-2xl">Tracklist</div>
                        <div className="w-full relative flex justify-end">
                            <div className="flex gap-2">
                                <AlbumPlayButton isPlaying={isPlaying} playAlbum={playAlbum} />
                                {!isMobile ?
                                    <>
                                        <DownloadAlbumButton songs={songs} id={id} variant={0} />
                                        <DesktopAlbumExplanation
                                            setShowExplanation={setShowExplanation}
                                            showExplanation={showExplanation}
                                            id={id}
                                            variant={0}
                                        />
                                    </>
                                    :
                                    <Drawer>
                                        <DrawerTrigger asChild>
                                            <Button className="rounded-full size-12" variant='outline' size='icon'>
                                                <EllipsisVertical size='24' />
                                            </Button>
                                        </DrawerTrigger>
                                        <DrawerContent className="rounded-t-3xl">
                                            <div className="w-full flex flex-col gap-2 *:w-full p-5">
                                                <DownloadAlbumButton songs={songs} id={id} variant={1} />
                                                <MobileAlbumExplanation
                                                    setShowExplanation={setShowExplanation}
                                                    showExplanation={showExplanation}
                                                    id={id}
                                                    variant={1}
                                                />
                                            </div>
                                        </DrawerContent>
                                    </Drawer>
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
                        id={id}
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
                    image={props.albumCover}
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