'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchAlbumSongs } from '@/lib/fetching';
import { cn, Song } from '@/lib/utils';
import { BookOpenText, ChevronLeft, Dot, PaintbrushVertical, Pause, Play, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image'
import Link from 'next/link';
import { Key, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import BasicPageStuff from '@/components/basicPageStuff';

export default function AlbumPageStyle() {
    return (
        <div className="flex justify-center items-center">
            <ActualAlbumPageStyle />
        </div>
    )
}

function ActualAlbumPageStyle() {
    const [styleOption, setStyleOption] = useState<Number>(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hidePane, setHidePane] = useState<Boolean>(false);

    useEffect(() => {
        const storedStyle = localStorage.getItem("album-page-style");
        if (storedStyle !== null) {
            setStyleOption(Number(storedStyle));
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        isLoaded && localStorage.setItem("album-page-style", String(styleOption));
    }, [styleOption]);

    return (
        <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">
            <div className="md:w-[60%] max-h-[80vh]">
                <div className='p-2 md:p-6 max-h-screen overflow-y-auto relative'>
                    <AnimatePresence>
                        {styleOption === 0 ?
                            <NormalStyle />
                            :
                            // <SecondStyle />
                            <SecondStyleWIP />
                        }
                    </AnimatePresence>
                </div>
            </div>
            <div className={cn("md:w-[40%] h-full relative md:overflow-hidden")} onClick={() => setHidePane(!hidePane)}>
                <div className="p-6 border-t-2 border-t-muted md:border-t-transparent md:border-l-2 md:border-l-muted h-fit md:h-screen rounded-t-2xl md:rounded-none bg-primary-foreground md:bg-primary-foreground/25 shadow-xl">
                    <p className='font-semibold text-2xl'>Preferred style</p>
                    <div className='w-[150%] h-[2px] bg-muted -translate-x-6 mt-6' />
                    <div className="flex flex-col gap-4 mt-6 [&>div]:overflow-hidden justify-center items-center grow">
                        <div className={cn('rounded-xl p-4 flex justify-center items-center select-none cursor-pointer w-full h-full transition-all border-2 duration-300 bg-primary-foreground/50', styleOption === 0 && 'bg-secondary border-primary')} onClick={() => setStyleOption(0)}>
                            <p>Normal style</p>
                        </div>
                        <div className={cn('rounded-xl p-4 flex justify-center items-center select-none cursor-pointer w-full h-full transition-all border-2 gap-2 duration-300 bg-primary-foreground/50', styleOption === 1 && 'bg-secondary border-primary')} onClick={() => setStyleOption(1)}>
                            <PaintbrushVertical />
                            <p>YT Music-like style</p>
                        </div>
                    </div>
                    <div className='w-[150%] h-[2px] bg-muted -translate-x-6 mt-6' />
                    <div className='w-full h-full flex justify-center items-start mt-6'>
                        <Button
                            className='rounded-xl w-full h-12'
                            onClick={() => {
                                // fun fact: i dont know how to make a form that updates when you click a button so rn this button does literally nothing
                                // its just here so that the user feels like they actually changed something
                                // or maybe im just stupid for thinking that way idk
                                toast("Saved settings successfully");
                            }}
                        >
                            Save settings
                        </Button>
                    </div>
                </div>
            </div>
            <BasicPageStuff albumPageStyle={true} />
        </div>
    )
}

function NormalStyle() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(-1);
    const credits = "Credits to...";
    const id = "yandhi";
    const albumName = "Yandhi";
    const albumCreator = "Kanye West";
    const year = "2019";
    const appearBar = true;
    const searchQuery = "";

    useEffect(() => {
        async function loadSongs() {
            const data = await fetchAlbumSongs(id);
            setSongs(data.tracks);
        }

        loadSongs();
    }, [id]);

    return (
        <motion.div initial={{ opacity: 0, y: 40, filter: "blur(20px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -40, filter: "blur(20px)" }} transition={{ duration: 0.6, ease: "easeInOut" }} className='mb-16 md:mb-0'>
            <div className='md:-translate-x-[16px]'>
                <div className='flex flex-col md:flex-row gap-4 transition-all duration-300'>
                    <div className='flex-1'>
                        <div className={`flex gap-4 items-center p-4 md:p-8 mt-4 overflow-x-hidden pt-16 w-full justify-center md:justify-normal border-b-2 border-b-primary-foreground`}>
                            <div className='flex flex-col md:flex-row items-center gap-5'>
                                <Image src={`/song-files/covers/${id.toLowerCase()}.jpg`} alt={id} width={!useIsMobile() ? 260 : 280} height={!useIsMobile() ? 260 : 280} priority={true} className='md:mt-4 rounded-xl outline outline-primary/10' />
                                <div className='flex flex-col gap-2'>
                                    <div className='text-4xl font-bold text-center md:text-left'>{albumName}</div>
                                    <div className='flex flex-col justify-center'>
                                        <div className='inline-flex items-center justify-center md:justify-normal'>
                                            <div className='text-md md:text-xl text-primary/75 whitespace-pre text-center md:text-left'>{albumCreator || <Skeleton className='w-24 h-5' />}</div>
                                            <Dot className='text-primary/75' />
                                            <div className='text-md md:text-xl text-primary/75 text-center md:text-left'>{year || <Skeleton className='w-16 h-6 translate-y-0.5' />}</div>
                                        </div>
                                        <div className='inline-flex items-center justify-center md:justify-normal'>
                                            <div className='text-md md:text-xl text-primary/75 whitespace-pre text-center md:text-left'>{String("20") || <Skeleton className='w-5 h-5 translate-y-1 inline-flex' />} songs</div>
                                        </div>
                                    </div>
                                    <div className='flex gap-2 justify-center md:justify-normal mt-2'>
                                        <Button className={`rounded-full h-12 transition-all duration-300 justify-normal ${isPlaying ? 'w-12' : 'w-24'}`}>
                                            {!isPlaying ? <Play /> : <Pause />}
                                            <div className={`transition-all text-center ml-1 duration-300 ${isPlaying ? 'opacity-0' : ''}`}>
                                                {!isPlaying ? String('Play') : String('')}
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='p-2 bg-primary-foreground/25 mt-6 rounded-lg mx-4 md:mx-8 border-2 border-secondary/50 text-sm text-primary/50'>{credits || "No credits provided"}</div>

                        <div className='m-4 md:m-8 md:mt-4 flex flex-col gap-4'>
                            <div className='flex items-center relative'>
                                <Input type='search' className='pl-[3em] border-2 border-secondary rounded-xl bg-primary-foreground/50' placeholder="Search for your favorite song"></Input>
                                <div className='absolute left-3 pr-2 py-2 border-r-2 border-r-secondary cursor-pointer'>
                                    <Search size={16} strokeWidth={2} className=' text-muted-foreground/80' />
                                </div>
                            </div>
                            <div className={cn('transition-all duration-500 bg-primary-foreground/50 rounded-xl overflow-hidden border-2 border-secondary', appearBar ? 'mb-24' : '-mb-4')}>
                                {songs.filter((op: Song) => (op.title.toLowerCase().includes(searchQuery.toLowerCase()))).map((element, index) => (
                                    <div key={index} className={cn("flex p-2 items-center [&:not(:last-of-type)]:border-b border-b-secondary [&:not(:last-of-type)]:pb-3 justify-start gap-2 transition-colors h-full", currentSongIndex === index ? 'bg-primary/15 border-b-transparent' : 'cursor-pointer hover:bg-primary/5')} onClick={() => setCurrentSongIndex(index)}>
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
            </div>
        </motion.div>
    )
}

function SecondStyleWIP() {
    return (
        !useIsMobile() ? <motion.div initial={{ opacity: 0, y: 40, filter: "blur(20px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -40, filter: "blur(20px)" }} transition={{ duration: 0.6, ease: "easeInOut" }} className='p-6 pt-20 text-center m-auto h-fit w-fit'>This show-off is currently in WIP, so just test it yourself by going to an album page</motion.div> : <div><SecondStyle /></div>
    )
}

function SecondStyle() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(-1);
    const credits = "Credits to...";
    const id = "yandhi";
    const albumName = "Yandhi";
    const albumCreator = "Kanye West";
    const year = "2019";
    const appearBar = true;
    const searchQuery = "";

    useEffect(() => {
        async function loadSongs() {
            const data = await fetchAlbumSongs(id);
            setSongs(data.tracks);
        }

        loadSongs();
    }, [id]);

    return (
        <motion.div initial={{ opacity: 0, y: 40, filter: "blur(20px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -40, filter: "blur(20px)" }} transition={{ duration: 0.6, ease: "easeInOut" }} className='h-screen p-3'>
            <div className='flex gap-4 flex-col'>
                <div className={'flex gap-y-2 flex-col items-center justify-start'}>
                    <div className="sticky top-5 flex flex-col gap-2">
                        <div className={cn("flex flex-col gap-3 items-center justify-center rounded-xl relative p-4 px-8", !useIsMobile() ? "border border-muted h-fit overflow-hidden" : "w-full h-full")}>
                            <Image src={`/song-files/covers/${id.toLowerCase()}.jpg`} alt={`${id.toLowerCase()}`} width={0} height={0} className="absolute inset-0 bg-cover bg-center opacity-10 blur-2xl size-full touch-none select-none z-10" />
                            <div className="flex gap-2 flex-col items-center justify-center">
                                <Image src={`/song-files/covers/${id.toLowerCase()}.jpg`} alt={id} width={!useIsMobile() ? 260 : 320} height={!useIsMobile() ? 260 : 320} priority={true} className='rounded-xl z-20' />
                                <div className='flex flex-col mt-2 justify-center items-center'>
                                    <p className='text-3xl font-semibold'>{albumName}</p>
                                    <p className='text-primary/60'>{albumCreator}</p>
                                    <p className='text-primary/40'>{year} • {songs.length} songs</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl h-fit border border-muted bg-primary-foreground/50 w-full">
                            <div className="text-primary/50">{credits}</div>
                        </div>
                    </div>
                </div>
                <div className="my-2 h-px w-full bg-muted" />
                <div className="flex flex-col gap-2 w-full h-full mb-16">
                    <div className='flex gap-4 justify-between items-center w-full'>
                        <p className="font-semibold text-3xl">Tracklist</p>
                        <div className="inline-flex gap-2">

                            <Button className={`rounded-full h-12 transition-all duration-300 justify-normal  ${isPlaying ? 'w-12' : 'w-24'}`}>
                                {!isPlaying ? <Play /> : <Pause />}
                                <div className={`transition-all text-center ml-1 duration-300 ${isPlaying ? 'opacity-0' : ''}`}>
                                    {!isPlaying ? String('Play') : String('')}
                                </div>
                            </Button>
                        </div>
                    </div>
                    <div className={cn('transition-all duration-500 bg-primary-foreground/50 rounded-xl overflow-hidden w-full border border-muted', appearBar ? 'mb-20' : '-mb-4')}>
                        {songs.filter((op: Song) => (op.title.toLowerCase().includes(searchQuery.toLowerCase()))).map((element, index) => (
                            <div key={index} className={cn("flex p-2 items-center [&:not(:last-of-type)]:border-b border-b-secondary [&:not(:last-of-type)]:pb-3 justify-start gap-2 transition-colors h-full", currentSongIndex === index ? 'bg-primary/15 border-b-transparent' : 'cursor-pointer hover:bg-primary/5')} onClick={() => setCurrentSongIndex(index)}>
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
        </motion.div >
    )
}