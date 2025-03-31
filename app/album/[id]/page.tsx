'use client'

import Image from 'next/image'
import * as React from 'react'
import { useEffect, useState, useRef, use, useMemo } from 'react';
import { BookOpenText, ChevronLeft, Dot, Maximize2, Minimize2, Pause, Play, Search } from "lucide-react";
import { Button } from '@/components/ui/button';
import { SongControls } from '@/components/songControls';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import '@public/CSS/song-controls.css';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { AlbumExplanation } from '@/components/albumExplanation';
import { useQueryState } from "nuqs";
import { Skeleton } from '@/components/ui/skeleton';
import { fetchAlbumInfo, fetchAlbumSongs } from '@/lib/fetching';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Toaster } from 'sonner';
import Link from 'next/link';
import { Drawer as Drawer2 } from 'vaul';
import { Separator } from '@/components/ui/separator';

interface Song {
  title: string;
  artist: string;
}

const snapPoints = [0.8, 1];

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [year, setYear] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const { id } = use(params);
  const [isPlaying, setIsPlaying] = useState(false);
  const songRef = useRef<HTMLAudioElement | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [albumName, setAlbumName] = useState("");
  const [albumCreator, setAlbumCreator] = useState("Kanye West");
  const [credits, setCredits] = useState("");
  const [imageSize, setImageSize] = useState(260);
  const [appearBar, setAppearBar] = useState(true);
  const [volumeVal, setVolumeVal] = useState<number>(100);
  const [songCreator, setSongCreator] = useState("");
  const [clickedAmmount, setClickedAmmount] = useState(0);
  const [albumExplanation, setAlbumExplanation] = useState("");
  const [playingSong, setPlayingSong] = useQueryState("playingSong", { defaultValue: "" });
  const [repeatAlbum, setRepeatAlbum] = useState(0);
  const [skipDirection, setSkipDirection] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const storedVolume = localStorage.getItem("volume") || 100;
    try {
      setVolumeVal(Number(storedVolume));
    } catch (e: any) {
      throw new Error(e.message);
    }
  }, []);

  useEffect(() => {
    async function loadSongs() {
      const data = await fetchAlbumSongs(id);
      setSongs(data.tracks);
      setYear(data.config[0].year);
      setAlbumName(data.config[0].albumName);
      setAlbumCreator(data.config[0].albumCreator);
      setCredits(data.config[0].credits);
    }

    async function loadInfo() {
      const data = await fetchAlbumInfo(id);
      setAlbumExplanation(data);
    }

    loadSongs();
    loadInfo();
  }, [id]);

  useEffect(() => {
    const audioPrefix = `/song-files/songs/${id}/`;
    const audioFileType = '.m4a';

    if (playingSong) {
      try {
        songRef.current = new Audio(audioPrefix + playingSong + audioFileType);
        songRef.current.loop = (repeatAlbum === 2 && true);
      } catch (e) {
        console.log(e);
      }
    }
  }, [playingSong, id]);

  useEffect(() => {
    const song = songRef.current;
    if (!song) return;
    isPlaying ? song.play() : song.pause();

    return () => {
      song.pause();
    };
  }, [isPlaying, playingSong]);

  useEffect(() => {
    const reiszeImage = () => {
      if (window.innerWidth < 768) {
        setImageSize(280);
      } else {
        setImageSize(260);
      }
    }

    reiszeImage();

    window.addEventListener("resize", reiszeImage);
    return () => {
      window.removeEventListener("resize", reiszeImage);
    }
  })

  const handleClickEvent = (element: Song, index: number) => {
    setPlayingSong(element.title);
    setIsPlaying(true);
    setSongCreator(element.artist);
    setCurrentSongIndex(index);
    setClickedAmmount(1);
  };

  useEffect(() => {
    if (playingSong && playingSong !== "" && songs.length > 0) {
      const songIndex = songs.findIndex((song) => song.title === playingSong)

      if (songIndex !== -1) {
        setSongCreator(songs[songIndex].artist);
        setCurrentSongIndex(songIndex);
        setClickedAmmount(1);
      }
    }
  }, [songs, playingSong]);

  const playAlbum = () => {
    if (songs.length > 0) {
      if (clickedAmmount < 1) {
        setPlayingSong(songs[0].title);
        setIsPlaying(true);
        setCurrentSongIndex(0);
      }

      setIsPlaying(!isPlaying);
      setClickedAmmount(1);
      setSongCreator(songs[0].artist);
    }
  };

  function endedSongFunction(newIndex: number) {
    const setupNextSong = (songIndex: number, play: boolean = true) => {
      setCurrentSongIndex(songIndex);
      setPlayingSong(songs[songIndex].title);
      setSongCreator(songs[songIndex].artist);
      setIsPlaying(play);
    }
    const repeatSong = () => {
      if (songRef.current) {
        songRef.current.currentTime = 0;
        songRef.current.play();
      }
      setIsPlaying(true);
    }

    if (repeatAlbum === 2)
      return repeatSong();

    if (newIndex !== songs.length)
      return setupNextSong(newIndex);

    const newSongIndex: any[] = [(repeatAlbum === 0 ? currentSongIndex + 1 : 0), (repeatAlbum === 0 ? false : true)];

    setupNextSong(0, repeatAlbum !== 0);
  }

  const handleSkipSong = (back: boolean) => setSkipDirection(back);

  useEffect(() => {
    if (skipDirection !== null) {
      endedSongFunction(skipDirection ? currentSongIndex - 1 : currentSongIndex + 1);
      setSkipDirection(null);
    }
  }, [skipDirection, currentSongIndex, songs, playingSong, repeatAlbum, endedSongFunction]);

  useEffect(() => {
    const song = songRef.current;
    if (!song) return;

    const handleSongEnd = () => endedSongFunction(currentSongIndex + 1);
    song.addEventListener("ended", handleSongEnd);

    return () => {
      song.removeEventListener("ended", handleSongEnd);
    };
  }, [currentSongIndex, songs, playingSong, repeatAlbum, endedSongFunction]);

  useEffect(() => {
    const song = songRef.current;
    if (!song) return;

    localStorage.setItem("volume", volumeVal.toString());

    const localVolume = localStorage.getItem("volume");

    if (localVolume === null || localVolume === "NaN" || isNaN(Number(localVolume))) {
      song.volume = 0.5;
    } else {
      song.volume = Number(localVolume) / 100;
    }
  }, [volumeVal, handleSkipSong, isPlaying]);

  const capitalizeFirstLetter = (val: string) => String(val).charAt(0).toUpperCase() + String(val).slice(1);

  return (
    <div>
      <Toaster position="top-center" style={{ backgroundColor: 'red' }} />
      <div className='flex flex-col md:flex-row gap-4 transition-all duration-300'>
        <div className='flex-1'>
          <div className='absolute left-4 md:left-5 top-2'>
            <Link href="/">
              <Button className="rounded-full" size='icon' variant='ghost'>
                <ChevronLeft />
              </Button>
            </Link>
          </div>
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
                    {/* {<Dot className='text-primary/75' />
                    <div className='text-md md:text-xl text-primary/75 text-center md:text-left'> {albumDuration || <Skeleton className='w-28 h-6 translate-y-0.5' />}</div>} */}
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
                    <Drawer2.Root direction="right">
                      <Drawer2.Trigger asChild>
                        <Button variant='outline' className='rounded-full w-48 h-12' onClick={() => setShowExplanation(!showExplanation)}>
                          <BookOpenText />
                          Album Explanation
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
                                <div className='flex items-center justify-between mx-auto'>
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
                    :
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant='outline' className='rounded-full w-48 h-12' onClick={() => setShowExplanation(!showExplanation)}>
                          <BookOpenText />
                          Album Explanation
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className={cn('h-[93vh] items-center overflow-y-auto')}>
                        <div className='overflow-y-auto h-full'>
                          <AlbumExplanation id={id} />
                        </div>
                      </DrawerContent>
                    </Drawer>
                  }
                </div>
              </div>
            </div>
          </div>

          <div className='p-2 bg-primary-foreground/25 mt-6 rounded-lg mx-4 md:mx-8 border-2 border-secondary/50 text-sm text-primary/50'>{credits || "No credits provided"}</div>

          <div className='m-4 md:m-8 md:mt-4 flex flex-col gap-4'>
            <div className='flex items-center relative'>
              <Input type='search' className='pl-[3em] bg-primary-foreground border-2 border-secondary' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for your favorite song"></Input>
              <div className='absolute left-3 pr-2 py-2 border-r-2 border-r-secondary cursor-pointer'>
                <Search size={16} strokeWidth={2} className=' text-muted-foreground/80' />
              </div>
            </div>
            <div className={cn('border-2 border-secondary rounded-lg bg-primary-foreground/60 transition-all duration-500', appearBar ? 'mb-24' : '-mb-4')}>
              {songs.filter((op: Song) => (op.title.toLowerCase().includes(searchQuery.toLowerCase()))).map((element, index) => (
                <div key={index} className={cn("flex border-b-2 border-b-secondary last-of-type:border-b-transparent p-2 items-center justify-start gap-2 transition-colors", currentSongIndex === index ? 'bg-primary/10 border-b-transparent' : 'cursor-pointer')} onClick={() => handleClickEvent(element, index)}>
                  <div className='flex items-left gap-3 relative'>
                    <div className={cn('cursor-default rounded-full w-6 items-center flex justify-center', imageSize === 280 && 'absolute top-0.5 left-0.5 mask-circle bg-background/50 backdrop-blur-md rounded-full text-sm')}>{index + 1}</div>
                    <Image src={`/song-files/covers/${id.toLowerCase()}.jpg`} alt="" width={60} height={60} className='rounded-lg shadow-sm' />
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
  );
}