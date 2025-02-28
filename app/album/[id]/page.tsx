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
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { AlbumExplanation, AlbumExplanationSmall } from '@/components/albumExplanation';
import { useQueryState } from "nuqs";

interface Song {
  title: string;
  artist: string;
  songLocation: string;
  // Add other properties if necessary
}

async function fetchSongs(id: string) {
  const response = await fetch(`../song-files/songLists/${id.toLowerCase()}.json`);
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
  const [queue, setQueue] = useState<string[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [albumName, setAlbumName] = useState(id.replace('-', ' '));
  const [albumCreator, setAlbumCreator] = useState("Kanye West");
  const [credits, setCredits] = useState("");
  const [imageSize, setImageSize] = useState(260);
  const [appearBar, setAppearBar] = useState(true);
  const [volumeVal, setVolumeVal] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [songCreator, setSongCreator] = useState("");
  const [clickedAmmount, setClickedAmmount] = useState(0);
  const [albumExplanation, setAlbumExplanation] = useState("");
  const [playingSong, setPlayingSong] = useQueryState("playingSong", { defaultValue: "" });

  useEffect(() => {
    const storedVolume = localStorage.getItem("volume") || 100;
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
    const audioPrefix = `/song-files/songs/${id}/`;
    const audioFileType = '.m4a';

    console.log(audioPrefix + playingSong + audioFileType);

    if (playingSong) {
      try {
        songRef.current = new Audio(audioPrefix + playingSong + audioFileType);
      } catch (e) {
        console.log(e);
      }
    }
  }, [playingSong, id]); // Only depend on playingSong and id

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
  }, [isPlaying, playingSong]);

  React.useMemo(() => {
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
    setAppearBar(true);
    setSongCreator(element.artist);
    setCurrentSongIndex(index);
    setClickedAmmount(1);
  };

  useEffect(() => {
    if (playingSong && playingSong !== "" && songs.length > 0) {
      const songIndex = songs.findIndex((song) => song.title === playingSong)

      if (songIndex !== -1) {
        setAppearBar(true);
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

  const handleSkipSong = (back: boolean) => {
    if (!songRef.current || songs.length === 0) return;
    const newIndex = back ? currentSongIndex - 1 : currentSongIndex + 1;

    setCurrentSongIndex(newIndex);
    setPlayingSong(songs[newIndex].title);
    setSongCreator(songs[newIndex].artist);
    setIsPlaying(true);
  };

  useEffect(() => {
    const song = songRef.current;
    if (song) {
      const handleSongEnd = () => {
        const newIndex = currentSongIndex + 1;

        setCurrentSongIndex(newIndex);
        setPlayingSong(songs[newIndex].title);
        setSongCreator(songs[newIndex].artist);
        setIsPlaying(true);
      }
      song.addEventListener("ended", handleSongEnd);

      return () => {
        song.removeEventListener("ended", handleSongEnd);
      };
    }
  }, [currentSongIndex, songs, playingSong]);

  useEffect(() => {
    const song = songRef.current;
    if (!song) return;
    const updateTime = () => setCurrentTimeVal(song.currentTime);

    song.addEventListener("timeupdate", updateTime);

    return () => {
      song.removeEventListener("timeupdate", updateTime);
    };
  })

  useEffect(() => {
    const song = songRef.current;
    if (!song) return;

    localStorage.setItem("volume", volumeVal.toString());

    const localVolume = localStorage.getItem("volume");

    if (localVolume === null) {
      song.volume = volumeVal / 100;
    } else {
      song.volume = Number(localVolume) / 100;
    }
  }, [volumeVal, handleSkipSong, isPlaying]);

  return (
    <div>
      <div className='flex flex-col md:flex-row gap-4 transition-all duration-300'>
        <div className='flex-1'>
          <div className='absolute left-4 md:left-5 top-2'>
            <HandleTransition href="/">
              <Button className="" size='icon' variant='ghost'><ChevronLeft /></Button>
            </HandleTransition>
          </div>
          <div className={`flex gap-4 items-center p-4 md:p-8 mt-4 overflow-x-hidden pt-16 w-full justify-center md:justify-normal border-b-2 border-b-primary-foreground`}>
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
                    <Button variant='outline' aria-label='Toggle explanation' className='rounded-full w-48 h-12' onClick={() => setShowExplanation(!showExplanation)}>
                      <BookOpenText size='24' />
                      Album Explanation
                    </Button>
                    :
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant='outline' className='rounded-full w-48 h-12' onClick={() => setShowExplanation(!showExplanation)}>
                          <BookOpenText />
                          Album Explanation
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className='h-[80%] items-center rounded-t-3xl'>
                        <AlbumExplanationSmall id={id} />
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
            <div className='border-2 border-secondary rounded-lg bg-primary-foreground/60 mb-24'>
              {filteredContent.map((element, index) => (
                <div key={index} className={`flex border-b-2 border-b-secondary last-of-type:border-b-transparent p-2 items-center justify-start gap-2 ${currentSongIndex === index ? 'bg-primary/10 border-b-transparent' : ''}`} onClick={() => handleClickEvent(element, index)}>
                  <div className='flex items-center gap-3'>
                    {imageSize === 260 && <div className='cursor-default rounded-full w-6 text-right'>{index + 1}</div>}
                    <Image src={`/song-files/covers/${id.toLowerCase()}.jpg`} alt="" width={60} height={60} className='rounded-lg shadow-sm' />
                  </div>
                  <div className='select-none'>
                    <div className="text-sm font-semibold">{element.title}</div>
                    <div className='text-sm text-muted-foreground'>{element.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showExplanation && imageSize === 260 && (
            <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} transition={{ duration: 0.8, ease: "backInOut", }} layoutId="albumExplanation">
              <AlbumExplanation id={id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <SongControls
          songRef={songRef}
          songVal={playingSong}
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