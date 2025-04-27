'use client'

import * as React from 'react'
import { useEffect, useState, useRef, use } from 'react';
import '@public/CSS/song-controls.css';
import { useQueryState } from "nuqs";
import { fetchAlbumInfo, fetchAlbumSongs } from '@/lib/fetching';
import NewAlbumPage from '@/components/newAlbumPage';
import AlbumPage from '@/components/albumPage';
import { capitalizeFirstLetter, Song } from '@/lib/utils';

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
  const [newPageLayout, setNewPageLayout] = useState<Number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedVolume = localStorage.getItem("volume") || 100;
    try {
      setVolumeVal(Number(storedVolume));
    } catch (e: any) {
      throw new Error(e.message);
    }
  }, []);

  useEffect(() => {
    const storedStyle = localStorage.getItem("album-page-style");
    if (storedStyle !== null) {
      setNewPageLayout(Number(storedStyle));
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
    document.title = `${albumName || capitalizeFirstLetter(id)} | UnYeleased`;
  }, [albumName]);

  useEffect(() => {
    const audioPrefix = `/song-files/songs/${id}/`;
    const audioFileType = '.m4a';

    if (playingSong) {
      try {
        setIsLoading(true);
        songRef.current = new Audio(audioPrefix + playingSong + audioFileType);
        songRef.current.loop = (repeatAlbum === 2 && true);
        songRef.current.addEventListener("canplaythrough", () => setIsLoading(false));
      } catch (e) {
        console.log(e);
        setIsLoading(false);
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
      if (songRef.current) {
        if (Math.round(songRef.current.currentTime) >= 5 && skipDirection === true) {
          songRef.current.currentTime = 0;
          return;
        }
      }
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

  if (newPageLayout === 1) {
    return (
      <NewAlbumPage
        albumName={albumName}
        albumCreator={albumCreator}
        id={id} isPlaying={isPlaying}
        showExplanation={showExplanation}
        setShowExplanation={setShowExplanation}
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
        songs={songs}
        searchQuery={searchQuery}
        playAlbum={playAlbum}
        appearBar={appearBar}
        currentSongIndex={currentSongIndex}
        handleClickEvent={handleClickEvent}
        setSearchQuery={setSearchQuery}
        setAppearBar={setAppearBar}
        year={year}
        songRef={songRef}
        playingSong={playingSong}
        setIsPlaying={setIsPlaying}
        volumeVal={volumeVal}
        setVolumeVal={setVolumeVal}
        songCreator={songCreator}
        handleSkipSong={handleSkipSong}
        repeatAlbum={repeatAlbum}
        setRepeatAlbum={setRepeatAlbum}
        credits={credits}
        isLoading={isLoading}
      />
    )
  } else {
    return (
      <AlbumPage
        albumName={albumName}
        albumCreator={albumCreator}
        id={id} isPlaying={isPlaying}
        showExplanation={showExplanation}
        setShowExplanation={setShowExplanation}
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
        songs={songs}
        searchQuery={searchQuery}
        playAlbum={playAlbum}
        appearBar={appearBar}
        currentSongIndex={currentSongIndex}
        handleClickEvent={handleClickEvent}
        setSearchQuery={setSearchQuery}
        setAppearBar={setAppearBar}
        year={year}
        songRef={songRef}
        playingSong={playingSong}
        setIsPlaying={setIsPlaying}
        volumeVal={volumeVal}
        setVolumeVal={setVolumeVal}
        songCreator={songCreator}
        handleSkipSong={handleSkipSong}
        repeatAlbum={repeatAlbum}
        setRepeatAlbum={setRepeatAlbum}
        credits={credits}
        isLoading={isLoading}
      />
    );
  }
}