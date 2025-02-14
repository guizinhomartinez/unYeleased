'use client'

import Image from 'next/image'
import * as React from 'react'
import { useEffect, useState, useRef, use } from 'react';
import { BookOpenText, ChevronLeft, Dot, Pause, Play, Search, SkipBack, SkipForward } from "lucide-react";
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
  const [songCreator, setSongCreator] = useState("");
  const [durationArray, setDurationArray] = useState([""]);

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

  const handleClickEvent = (element: any) => {
    setSongVal(element.songLocation);
    setIsPlaying(true);
    setAppearBar(true);
    setSongCreator(element.artist);
    console.log(element.songLocation);
  }

  const playAlbum = () => {
    let clickedAmmount = 0;
    if (songs.length > 0) {
      clickedAmmount++;
      setCurrentSongIndex(0);
      setSongVal(songs[0].songLocation);
      setIsPlaying(true);
    }

    if (clickedAmmount > 0) {
      if (currentSongIndex < songs.length - 1) {
        setCurrentSongIndex(currentSongIndex);
        setIsPlaying(!isPlaying);
        setSongCreator(songs[currentSongIndex].artist);
      }
    }
  };

  useEffect(() => {
    const song = songRef.current;
    if (song) {
      const handleSongEnd = () => {
        if (currentSongIndex < songs.length - 1) {
          const nextIndex = currentSongIndex + 1;
          setCurrentSongIndex(nextIndex);
          setSongVal(songs[nextIndex].songLocation);
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      };

      song.addEventListener("ended", handleSongEnd);

      return () => {
        song.removeEventListener("ended", handleSongEnd);
      };
    }
  }, [currentSongIndex, songs, songVal]);

  const handleSkipSong = (back: boolean) => {
    if (!songRef.current || songs.length === 0) return;

    let newIndex = back ? Math.max(0, currentSongIndex - 1) : Math.min(songs.length - 1, currentSongIndex + 1);
    setCurrentSongIndex(newIndex);
    setSongVal(songs[newIndex].songLocation);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <div>
      {/* <Navbar text={albumName}/> */}
      <div className='absolute left-2 top-2'>
        <HandleTransition href="/">
          <Button className="" size='icon' variant='ghost'><ChevronLeft /></Button>
        </HandleTransition>
      </div>
      <div className={`flex gap-4 items-center p-6 md:p-12 overflow-x-hidden pt-16 w-full bg-gradient-to-b from-secondary to-transparent justify-center md:justify-normal border-b-2 border-b-primary-foreground`}>
        <div className='flex flex-col md:flex-row items-center gap-4'>
          <Image src={`/covers/${id.toLowerCase()}.jpg`} alt={id} width={imageSize} height={imageSize} className='md:mt-4 rounded-xl' />
          <div className='flex flex-col gap-2'>
            <div className='text-4xl font-bold text-center md:text-left'>{albumName}</div>
            <div className='inline-flex items-center'>
              <div className='text-md md:text-xl text-primary/75 whitespace-pre text-center md:text-left'>{albumCreator}</div>
              <Dot className='text-primary/75' />
              <div className='text-md md:text-xl text-primary/75 text-center md:text-left'>{year}</div>
            </div>
            <div className='flex gap-2 justify-center md:justify-normal mt-2'>
              <Button className={`rounded-full h-12 transition-all duration-300 justify-normal active:scale-95 ${isPlaying ? 'w-12' : 'w-20'}`} onClick={() => { setAppearBar(true); playAlbum(); }}>
                {!isPlaying ? <Play /> : <Pause />}
                <div className={`transition-all duration-300 ${isPlaying ? 'opacity-0' : ''}`}>
                  {!isPlaying ? String('Play') : String('')}
                </div>
              </Button>
              <Button size='icon' variant='outline' className='bg-transparent rounded-full size-12 active:scale-95'>
                <BookOpenText />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='p-2 bg-primary-foreground/25 mt-6 rounded-lg mx-6 md:mx-12 border-2 border-secondary/50 text-sm text-primary/50'>{credits}</div>

      <div className='m-6 md:m-12 md:mt-5 flex flex-col gap-4'>
        <div className='flex items-center relative'>
          <Input type='search' className='pl-[3em] bg-primary-foreground border-2 border-secondary sticky' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for your favorite song"></Input>
          <div className='absolute left-3 pr-2 py-2 border-r-2 border-r-secondary cursor-pointer'>
            <Search size={16} strokeWidth={2} className=' text-muted-foreground/80' />
          </div>
        </div>
        <div className='border-2 border-secondary rounded-lg bg-primary-foreground/60'>
          {filteredContent.map((element, index) => (
            <div key={index} className={`flex gap-2 border-b-2 px-2 border-b-secondary last-of-type:border-b-transparent p-2 items-center transition-colors list-${index}`} onClick={() => document.querySelector(`.list-${index}`)?.classList.toggle('list-active')} onDoubleClick={() => handleClickEvent(element)} onTouchEnd={() => handleClickEvent(element)}>
              <div className='flex items-center gap-2'>
                <div className='text-muted-foreground/80 w-fit text-center min-w-[20px]'>{index + 1}</div>
                <Image src={`/covers/${id.toLowerCase()}.jpg`} alt="" width={50} height={50} className='rounded-sm shadow-sm' />
              </div>
              <div className='relative w-full items-center ml-6 md:ml-2 select-none'>
                <div className='flex justify-between w-full'>
                  <div className='flex items-center'>
                    <div className='text-sm md:text-md font-bold'>{element.title}</div>
                    <Dot className='-mx-1 hidden md:block text-primary/60' />
                    <div className='text-sm md:text-md hidden md:block text-primary/50'>({element.songLocation.toString().split('/songs')})</div>
                  </div>
                  {/* <div className='translate-y-2'>{formatTime(0)}</div> */}
                </div>
                <div className='text-sm'>{element.artist}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <SongControls
          songRef={songRef}
          songVal={songVal}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          optionalAppear={appearBar}
          volumeVal={volumeVal}
          setVolumeVal={setVolumeVal}
          image={`/covers/${id.toLowerCase()}.jpg`}
          songCreator={songCreator}
          handleSkipSong={handleSkipSong}
        />
      </div>
    </div>
  );
}

const Navbar = ({ text }: { text: string }) => {
    const [showNavbar, setShowNavbar] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowNavbar(true);
            } else {
                setShowNavbar(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`flex justify-between items-center fixed border-2 border-secondary w-[87vw] md:w-[93vw] h-12 px-2 bg-primary-foreground/50 backdrop-blur-md z-[500] shadow-lg transition-all duration-500 my-3 left-[50%] -translate-x-[50%] rounded-full ${!showNavbar ? '-translate-y-12 opacity-0' : ''}`}>
            <Button variant="outline" className="bg-transparent rounded-full border-none text-lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{text}</Button>
        </div>
    );
};

const SongControls = ({ songRef, songVal, isPlaying, setIsPlaying, optionalAppear, volumeVal, setVolumeVal, image, songCreator, handleSkipSong }: { songRef: any, songVal: string, isPlaying: boolean, setIsPlaying: any, optionalAppear: boolean, volumeVal: number, setVolumeVal: any, image: string, songCreator: string, handleSkipSong: (back: boolean) => void }) => {
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

  const pressedKeyOne = useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "j") {
        handleSkipSong(true);
      }
      if (e.key === "l") {
        handleSkipSong(false);
      }
      if (e.key === "k") {
        setIsPlaying(!isPlaying);
      }
      if (e.key === "h") {
        hideControls();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSkipSong, hideControls]);

  return (
    <div
      className={`fixed bottom-2 rounded-2xl w-full max-w-[93.5vw] left-1/2 -translate-x-1/2 py-6 px-3 bg-primary-foreground/80 backdrop-blur-lg border-2 border-t-secondary flex items-center transition-all duration-500 shadow-lg ${appearBar ? "translate-y-0" : "translate-y-24"}`}
      onClick={hideControls}
      onKeyDown={(e) => pressedKeyOne}
    >
      <div className="flex items-center gap-2 flex-1 select-none" onClick={(e) => e.stopPropagation()}>
        <Image src={image} alt={image} width={60} height={60} className='rounded-sm' />
        <div>
          <div className='font-bold'>
            {songVal !== "" ? songVal.replace('/songs/yandhi/', '').replace('.m4a', '') : 'No Track Found'}
          </div>
          <div className='text-sm text-muted-foreground'>{songCreator}</div>
        </div>
      </div>

      <div className="flex justify-center gap-1" onClick={(e) => e.stopPropagation()}>
        <Button
          size='icon'
          className={`p-5 rounded-full active:scale-95 ${songVal !== "" ? '' : 'opacity-50 cursor-not-allowed'}`}
          variant='ghost'
          onClick={() => handleSkipSong(true)}
          onKeyDown={() => pressedKeyOne}
        >
          <SkipBack />
        </Button>
        <Button
          className={`p-5 rounded-full active:scale-95 ${songVal !== "" ? '' : 'opacity-50 cursor-not-allowed'}`}
          size="icon"
          onClick={() => setIsPlaying(songVal !== "" && !isPlaying)}
          onKeyDown={() => pressedKeyOne}
        >
          {!isPlaying ? <Play /> : <Pause />}
        </Button>
        <Button
          size='icon'
          className={`p-5 rounded-full active:scale-95 ${songVal !== "" ? '' : 'opacity-50 cursor-not-allowed'}`}
          variant='ghost'
          onClick={() => handleSkipSong(false)}
          onKeyDown={() => pressedKeyOne}
        >
          <SkipForward />
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-1 justify-end w-full select-none" onClick={(e) => e.stopPropagation()}>
        <VolumeSlider className='w-20 md:w-32' />
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