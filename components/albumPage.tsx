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
import { DesktopAlbumExplanation, MobileAlbumExplanation } from "./albumPageSubcomponents/albumExplanationWrappers";
import AlbumPageTracklist from "./albumPageSubcomponents/albumPageTracklist";
import AlbumPlayButton from "./albumPageSubcomponents/ui/albumPlayButton";
import { useState } from "react";
import AlbumCover from "./albumPageSubcomponents/albumCover";

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
                            <AlbumCover id={id} newAlbumPage={false} albumCover={`/song-files/covers/${id.toLowerCase()}.jpg`} />
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
                                    <AlbumPlayButton isPlaying={isPlaying} playAlbum={playAlbum} />
                                    {!useIsMobile() ?
                                        <DesktopAlbumExplanation
                                            setShowExplanation={setShowExplanation}
                                            showExplanation={showExplanation}
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
                            {credits.length > 0 ? (
                                <p>
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
                                    ).map(([type, contributors], index, array) => (
                                        <span key={type}>
                                            {contributors.map((entry, i) => (
                                                <span key={`${type}-${i}`}>
                                                    {entry.name}
                                                    {i === contributors.length - 2
                                                        ? " & "
                                                        : i < contributors.length - 2
                                                            ? ", "
                                                            : ""}
                                                </span>
                                            ))}{" "}
                                            for the {type}
                                            {index < array.length - 1 ? ", " : ""}
                                        </span>
                                    ))}
                                </p>
                            ) : (
                                <p>No credits available</p>
                            )}
                        </div>

                        {credits.length > 0 && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="rounded-xl w-fit" variant="secondary">
                                        Original link{credits.some(c => Array.isArray(c.name) && c.name.length > 1) ? "s" : ""}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Sources</DialogTitle>
                                    <DialogDescription>All sources used for this album</DialogDescription>
                                    {credits
                                        .flatMap((credit) => {
                                            const names = Array.isArray(credit.name) ? credit.name : [credit.name];
                                            const links = Array.isArray(credit.originalLink) ? credit.originalLink : [credit.originalLink];
                                            return names.map((name, i) => ({
                                                name,
                                                link: links[i] ?? "#",
                                            }));
                                        })
                                        .map((entry, i) => (
                                            <Link
                                                href={entry.link}
                                                key={i}
                                                target="_blank"
                                                className="w-full rounded-xl -mb-1"
                                            >
                                                <Button variant='secondary' className="w-full rounded-xl -mb-4">
                                                    {entry.name}
                                                </Button>
                                            </Link>
                                        ))}
                                </DialogContent>
                            </Dialog>
                        )}
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
                            id={id}
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