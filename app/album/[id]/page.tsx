'use client'

import Image from 'next/image'
import * as React from 'react'
import { useEffect, useState, useRef, use } from 'react';
import { BookOpenText, ChevronLeft, Dot, Pause, Play, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from '@/lib/utils';
import { HandleTransition } from '@/components/handleTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Song {
  title: string;
  artist: string;
  songLocation: string;
  // Add other properties if necessary
}

async function fetchSongs(id: string) {
  const response = await fetch(`../songLists/${id.toLowerCase()}.json`);
  return response.json(); // Return the parsed JSON data
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(0);
  const [color, setColor] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const { id } = use(params);
  const [isPlaying, setIsPlaying] = useState(false);
  const songRef = useRef<HTMLAudioElement | null>(null);
  const [currentTimeVal, setCurrentTimeVal] = useState(0);
  const [songTime, setSongtime] = useState(0);
  const [songVal, setSongVal] = useState("");
  const [queue, setQueue] = useState<string[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [albumName, setAlbumName] = useState(id);
  const [albumCreator, setAlbumCreator] = useState("Kanye West");
  const [credits, setCredits] = useState("");
  const [imageSize, setImageSize] = useState(250);
  const [appearBar, setAppearBar] = useState(true);
  const [volumeVal, setVolumeVal] = useState<number>(100); // Default to 100
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedVolume = localStorage.getItem("volume");
    setVolumeVal(Number(storedVolume));
  }, []);

  useEffect(() => {
    async function loadSongs() {
      const data = await fetchSongs(id);
      setSongs(data.tracks);
      setYear(data.config[0].year);
      setColor(data.config[0].color.toString());
      setAlbumName(data.config[0].albumName);
      setAlbumCreator(data.config[0].albumCreator);
      setCredits(data.config[0].credits);
      setLoading(false);
    }
    loadSongs();
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
    if (!songRef.current) return;

    const handleSongEnd = () => {
      if (currentSongIndex < queue.length - 1) {
        setCurrentSongIndex((prev) => prev + 1);
        setSongVal(queue[currentSongIndex + 1]);
      } else {
        setIsPlaying(false);
      }
    };

    songRef.current.addEventListener("ended", handleSongEnd);
    return () => {
      songRef.current?.removeEventListener("ended", handleSongEnd);
    };
  }, [currentSongIndex, queue]);

  useEffect(() => {
    const reiszeImage = () => {
      if (window.innerWidth < 768) {
        setImageSize(250);
      } else {
        setImageSize(250);
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

  return (
    <div>
      <div className='absolute left-2 top-2'>
        <HandleTransition href="/">
          <Button className="" size='icon' variant='ghost'><ChevronLeft /></Button>
        </HandleTransition>
      </div>
      <div className={`flex gap-4 items-center p-6 md:p-12 overflow-x-hidden pt-16 w-full bg-gradient-to-b from-secondary to-transparent justify-center md:justify-normal`}>
        <div className='flex flex-col md:flex-row items-center gap-4'>
          <Image src={`/covers/${id.toLowerCase()}.jpg`} alt={id} width={imageSize} height={imageSize} className='md:mt-4 rounded-xl' />
          <div className='flex flex-col gap-2'>
            <div className='text-4xl font-bold text-center md:text-left'>{albumName}</div>
            <div className='inline-flex items-center'>
              <div className='text-md md:text-xl text-primary/75 whitespace-pre text-center md:text-left'>{albumCreator}</div>
              <Dot />
              <div className='text-md md:text-xl text-primary/75 text-center md:text-left'>{year}</div>
            </div>
            <div className='flex gap-2 justify-center md:justify-normal mt-2'>
              <Button size='icon' className='rounded-full size-12' onClick={() => setAppearBar(true)}>
                <Play />
              </Button>
              <Button variant='outline' size='icon' className='bg-transparent rounded-full size-12'>
                <BookOpenText />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='m-6 md:m-12 md:mt-5 mb-0 flex flex-col gap-4'>
        <div className='flex items-center relative'>
          <Input type='search' className='pl-[3em] bg-primary-foreground/50 border-2 border-secondary' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for your favorite song"></Input>
          <div className='absolute left-3 pr-2 py-2 border-r-2 border-r-secondary cursor-pointer'>
            <Search size={16} strokeWidth={2} className=' text-muted-foreground/80' />
          </div>
        </div>
        <div className='border-2 border-secondary rounded-lg bg-primary-foreground/60'>
          {filteredContent.map((element, index) => (
            <div key={index} className='flex gap-2 border-b-2 border-b-secondary last-of-type:border-b-transparent p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-foreground items-center transition-colors' onClick={() => { setSongVal(element.songLocation); setIsPlaying(true); setAppearBar(true) }}>
              <Image src={`/covers/${id.toLowerCase()}.jpg`} alt="" width={50} height={50} className='rounded-md' />
              <div className='relative w-full items-center'>
                <div className='flex justify-between w-full'>
                  <div className='flex items-center'>
                    <div className='text-sm md:text-md font-bold'>{element.title}</div>
                    <Dot className='-mx-1 hidden md:block' />
                    <div className='text-sm md:text-md hidden md:block text-primary/50'>({element.songLocation.toString().split('/songs')})</div>
                  </div>
                  <div className='translate-y-2'>4:05</div>
                </div>
                <div className='text-sm'>{element.artist}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='text-center m-12 mb-28'>{credits}</div>
      <SongControls songRef={songRef} songVal={songVal} isPlaying={isPlaying} setIsPlaying={setIsPlaying} optionalAppear={appearBar} volumeVal={volumeVal} setVolumeVal={setVolumeVal} />
    </div>
  );
}

const SongControls = ({ songRef, songVal, isPlaying, setIsPlaying, optionalAppear, volumeVal, setVolumeVal }: { songRef: any, songVal: string, isPlaying: boolean, setIsPlaying: any, optionalAppear: boolean, volumeVal: number, setVolumeVal: any }) => {
  const [appearBar, setAppearBar] = useState(true);
  const [optAppear, setOptAppear] = useState(optionalAppear);

  function hideControls() {
    setAppearBar(!appearBar);
    setOptAppear(appearBar);
  }

  function handleTogglePlayback() {
    if (!songRef.current || songVal == "") return;
    if (songRef.current.paused) {
      songRef.current.play();
      setIsPlaying(true);
    } else {
      songRef.current.pause();
      setIsPlaying(false);
    }
  }

  return (
    <div
      className={`fixed bottom-2 rounded-2xl w-full max-w-[93.5vw] left-1/2 -translate-x-1/2 py-6 px-3 bg-primary-foreground/80 backdrop-blur-lg border-2 border-t-secondary flex items-center transition-all duration-500 ${appearBar ? "translate-y-0" : "translate-y-16"}`}
      onClick={hideControls}>
      <div className="flex-1 w-fit" onClick={(e) => e.stopPropagation()}>
        {songVal !== "" ? songVal.replace('/songs/yandhi/', '').replace('.m4a', '') : 'No Track Playing'}
      </div>

      <div className="flex justify-center">
        <Button
          className={`p-5 rounded-full active:scale-95 dark:bg-secondary dark:text-secondary-foreground ${songVal !== "" ? '' : 'opacity-50 cursor-not-allowed'}`}
          size="icon"
          onClick={(e) => { setIsPlaying(songVal !== "" && !isPlaying); e.stopPropagation() }}>
          {!isPlaying ? <Play /> : <Pause />}
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-1 justify-end w-full" onClick={(e) => e.stopPropagation()}>
        <VolumeSlider className='max-w-32' onValueChange={(e) => setVolumeVal(e[0])} />
        <Label>{typeof window !== "undefined" ? localStorage.getItem("volume") : 100}%</Label>
      </div>
    </div>

  );
}

type SliderProps = React.ComponentProps<typeof Slider>

function VolumeSlider({ className, ...props }: SliderProps) {
  return (
    <Slider
      defaultValue={[(localStorage.getItem("volume") != null ? Number(localStorage.getItem("volume")) : 100)]}
      max={100}
      step={1}
      className={cn("w-32", className)}
      {...props}
    />
  )
}

const InfoCard = ({ text }: { text: string }) => {
  return (
    <div className='w-[50vw] h-32 bg-primary-foreground rounded-xl border-2 border-secondary mr-12 mt-12'>
      <div>{text}</div>
    </div>
  )
}