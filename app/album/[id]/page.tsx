'use client'

import Image from 'next/image'
import * as React from 'react'
import { useEffect, useState, useRef, use } from 'react';
import { BookOpenText, ChevronLeft, Dot, Pause, Play, Search } from "lucide-react";
import { HandleTransition } from '@/components/handleTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SongControls } from '@/components/songControls';
import { AnimatePresence, motion } from 'motion/react'
import '@public/CSS/song-controls.css';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import dynamic from 'next/dynamic';

interface Song {
  title: string;
  artist: string;
  songLocation: string;
  // Add other properties if necessary
}

async function fetchSongs(id: string) {
  const response = await fetch(`../song-files/songLists//${id.toLowerCase()}.json`);
  return response.json();
}

async function fetchInfo(id: string) {
  const response = await fetch(`../song-files/albumInfo/${id.toLowerCase()}/albumExplanation.mdx`);
  return response.text();
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [year, setYear] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const { id } = use(params);
  const [isPlaying, setIsPlaying] = useState(false);
  const songRef = useRef<HTMLAudioElement | null>(null);
  const [currentTimeVal, setCurrentTimeVal] = useState(0);
  const [songTime, setSongtime] = useState(0);
  const [songVal, setSongVal] = useState("");
  const [queue, setQueue] = useState<string[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [albumName, setAlbumName] = useState(id.replace('-', ' '));
  const [albumCreator, setAlbumCreator] = useState("Kanye West");
  const [credits, setCredits] = useState("");
  const [imageSize, setImageSize] = useState(250);
  const [appearBar, setAppearBar] = useState(true);
  const [volumeVal, setVolumeVal] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [songCreator, setSongCreator] = useState("");
  const [clickedAmmount, setClickedAmmount] = useState(0);
  const [albumExplanation, setAlbumExplanation] = useState("");

  useEffect(() => {
    const storedVolume = localStorage.getItem("volume");
    setVolumeVal(Number(storedVolume));
  }, []);

  useEffect(() => {
    async function loadSongs() {
      const data = await fetchSongs(id);
      setSongs(data.tracks);
      setYear(data.config[0].year);
      setAlbumName(data.config[0].albumName);
      setAlbumCreator(data.config[0].albumCreator);
      setCredits(data.config[0].credits);
    }

    async function loadInfo() {
      const data = await fetchInfo(id);
      setAlbumExplanation(data);
    }

    loadSongs();
    loadInfo();
  }, [id]);

  const filteredContent = songs.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    songRef.current = new Audio(songVal);
  }, [songVal]);

  useEffect(() => {
    const song = songRef.current;
    if (song) {
      if (isPlaying) {
        song.play();
      } else {
        song.pause();
      }

      return () => {
        song.pause();
      };
    }
  }, [isPlaying, songVal]);

  useEffect(() => {
    const song = songRef.current;
    if (!song) return;

    const updateTime = () => {
      setCurrentTimeVal(song.currentTime);
    };

    song.addEventListener("timeupdate", updateTime);

    return () => {
      song.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  useEffect(() => {
    const element = "";
    setSongTime(element);
  }, []);

  const setSongTime = (element: any) => {
    const song = element.songLocation;
    if (!song) return;

    song.onloadedmetadata = () => {
      setSongtime(song.duration);
    };

    return () => {
      song.onloadedmetadata = null;
    };
  }

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

  useEffect(() => {
    if (songRef.current) {
      songRef.current.volume = volumeVal / 100; // Ensure it directly updates from state
    }
    localStorage.setItem("volume", volumeVal.toString()); // Then update localStorage
  }, [volumeVal]);

  const handleClickEvent = (element: any, index: number) => {
    setSongVal(element.songLocation);
    setIsPlaying(true);
    setAppearBar(true);
    setSongCreator(element.artist);
    setCurrentSongIndex(index);
    setClickedAmmount(1);
  };

  const playAlbum = () => {
    if (songs.length > 0) {
      if (clickedAmmount < 1) {
        setSongVal(songs[0].songLocation);
        setIsPlaying(true);
        setCurrentSongIndex(0);
      }

      setIsPlaying(!isPlaying);
      setClickedAmmount(1);
      setSongCreator(songs[0].artist);
    }
  };

  const handleSkipSong = (back: boolean) => {
    if (!songRef.current || songs.length === 0) return;
    const newIndex = back ? currentSongIndex - 1 : currentSongIndex + 1;

    setCurrentSongIndex(newIndex);
    setSongVal(songs[newIndex].songLocation);
    setSongCreator(songs[newIndex].artist);
    setIsPlaying(true);
  };

  useEffect(() => {
    const song = songRef.current;
    if (song) {
      const handleSongEnd = () => {
        if (!songRef.current || songs.length === 0) return;
        const newIndex = currentSongIndex + 1;

        setCurrentSongIndex(newIndex);
        setSongVal(songs[newIndex].songLocation);
        setSongCreator(songs[newIndex].artist);
        setIsPlaying(true);
      }
      song.addEventListener("ended", handleSongEnd);

      return () => {
        song.removeEventListener("ended", handleSongEnd);
      };
    }
  }, [currentSongIndex, songs, songVal]);

  useEffect(() => {
    const song = songRef.current;
    if (!song) return;
    const updateTime = () => setCurrentTimeVal(song.currentTime);

    song.addEventListener("timeupdate", updateTime);

    return () => {
      song.removeEventListener("timeupdate", updateTime);
    };
  })

  // const formatTime = (time: number) => {
  //   const minutes = Math.floor(time / 60);
  //   const seconds = Math.floor(time % 60);
  //   return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  // };

  // function rgbToHex(r: string | any, g: bigint | any, b: any) {
  //   return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  // }

  // console.log(id);

  return (
    <div>
      <div className='flex flex-col md:flex-row gap-2 justify-between'>
        <div className='flex-1'>
          <div className='absolute left-2 top-2'>
            <HandleTransition href="/">
              <Button className="" size='icon' variant='ghost'><ChevronLeft /></Button>
            </HandleTransition>
          </div>
          <div className={`flex gap-4 items-center p-6 md:p-12 overflow-x-hidden pt-16 w-full justify-center md:justify-normal border-b-2 border-b-primary-foreground`}>
            <div className='flex flex-col md:flex-row items-center gap-5'>
              <Image src={`/song-files/covers/${id.toLowerCase()}.jpg`} alt={id} width={imageSize} height={imageSize} priority={true} className='md:mt-4 rounded-xl outline outline-primary/10' />
              <div className='flex flex-col gap-2'>
                <div className='text-4xl font-semibold text-center md:text-left'>{albumName}</div>
                <div className='inline-flex items-center justify-center md:justify-normal'>
                  <div className='text-md md:text-xl text-primary/75 whitespace-pre text-center md:text-left'>{albumCreator}</div>
                  <Dot className='text-primary/75' />
                  <div className='text-md md:text-xl text-primary/75 text-center md:text-left'>{year}</div>
                </div>
                <div className='flex gap-2 justify-center md:justify-normal mt-2'>
                  <Button className={`rounded-full h-12 transition-all duration-300 justify-normal  ${isPlaying ? 'w-12' : 'w-24'}`} onClick={() => { setAppearBar(true); playAlbum(); }}>
                    {!isPlaying ? <Play /> : <Pause />}
                    <div className={`transition-all text-center ml-1 duration-300 ${isPlaying ? 'opacity-0' : ''}`}>
                      {!isPlaying ? String('Play') : String('')}
                    </div>
                  </Button>
                  {imageSize === 260 ?
                    <Button size='icon' variant='outline' className='rounded-full size-12' onClick={() => setShowExplanation(!showExplanation)}>
                      <BookOpenText />
                    </Button>
                    :
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button size='icon' variant='outline' className='rounded-full size-12' onClick={() => setShowExplanation(!showExplanation)}>
                          <BookOpenText />
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <AlbumExplanationSmall id={id} />
                      </DrawerContent>
                    </Drawer>
                  }
                </div>
              </div>
            </div>
          </div>

          <div className='p-2 bg-primary-foreground/25 mt-6 rounded-lg mx-6 md:mx-12 border-2 border-secondary/50 text-sm text-primary/50'>{credits !== "" ? credits : "No credits provided"}</div>

          <div className='m-6 md:m-12 md:mt-4 flex flex-col gap-4'>
            <div className='flex items-center relative'>
              <Input type='search' className='pl-[3em] bg-primary-foreground border-2 border-secondary' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for your favorite song"></Input>
              <div className='absolute left-3 pr-2 py-2 border-r-2 border-r-secondary cursor-pointer'>
                <Search size={16} strokeWidth={2} className=' text-muted-foreground/80' />
              </div>
            </div>
            <div className='border-2 border-secondary rounded-lg bg-primary-foreground/60 mb-20 md:mb-20'>
              {filteredContent.map((element, index) => (
                <div key={index} className={`flex border-b-2 px-2 border-b-secondary last-of-type:border-b-transparent p-2 w-[100%] items-center transition-colors gap-6 md:gap-1 list-${index} ${currentSongIndex === index ? 'bg-primary/20 border-b-transparent' : ''}`} onClick={() => handleClickEvent(element, index)}>
                  <div className='flex items-center gap-4'>
                    <div className='text-muted-foreground/80 w-fit text-end min-w-[20px]'>{index + 1}</div>
                    <Image src={`/song-files/covers/${id.toLowerCase()}.jpg`} alt="" width={60} height={60} className='rounded-lg shadow-sm' />
                  </div>
                  <div className={`relative w-full items-center select-none ml-4`}>
                    <div className='flex'>
                      <div className="flex items-center">
                        <div className="text-sm md:text-md font-semibold tracking-wide">{element.title}</div>
                        <Dot className='hidden md:block text-primary/60' />
                        <div className='text-sm md:text-md hidden md:block text-primary/50'>({element.songLocation.toString().replace('/song-files/songs/', '')})</div>
                      </div>
                    </div>
                    <div className='text-sm'>{element.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showExplanation && <AlbumExplanation text={albumExplanation} />}
        </AnimatePresence>
      </div>
      <div>
        <SongControls
          songRef={songRef}
          songVal={songVal.replace(`/song-files/songs/${id}/`, "")
            .replace(".m4a", "")}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          optionalAppear={appearBar}
          volumeVal={volumeVal}
          setVolumeVal={setVolumeVal}
          image={`/song-files/covers/${id.toLowerCase()}.jpg`}
          songCreator={songCreator}
          handleSkipSong={handleSkipSong}
          id={id}
        />
      </div>
    </div>
  );
}

const AlbumExplanation = ({ text }: { text: string }) => {
  return (
    <motion.div className="flex" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }}>
      <Separator orientation="vertical" className="h-screen rounded-full bg-muted mt-1 -translate-x-2.5" />
      <div className="h-[82vh] w-[30vw] bg-primary-foreground p-3 mt-3 mr-12 rounded-xl border-2 border-secondary sticky top-3">
        <div className="text-3xl font-bold">Album Explanation</div>
        <Separator orientation="horizontal" className="h-1 rounded-full bg-muted mt-1 mb-2" />
        <ScrollArea>
          <div className='overflow-hidden h-[90%]'>
            {text}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  )
}

const AlbumExplanationSmall = ({ id }: { id:string }) => {
  const DynamicHeader = dynamic(() => import(`@/public/song-files/albumInfo/${id.toLowerCase()}/albumExplanation.mdx`), { loading: () => <p>Loading...</p>,})

  return (
    <div className="bg-primary-foreground p-3">
      <div className="text-2xl font-bold mt-6 text-center">Album Explanation</div>
      <Separator orientation="horizontal" className="h-1 rounded-full bg-muted mt-1 mb-2" />
      <React.Suspense>
        <div className='mx-auto w-fit'>
          <DynamicHeader />
        </div>
      </React.Suspense>
    </div>
  )
}