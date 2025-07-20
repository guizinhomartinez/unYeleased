'use client'

import * as React from 'react'
import { useEffect, useState, useRef, use } from 'react';
import { useQueryState } from "nuqs";
import { fetchAlbumCredits, fetchAlbumSongs } from '@/lib/fetching';
import NewAlbumPage from '@/components/newAlbumPage';
import AlbumPage from '@/components/albumPage';
import { useIsMobile } from '@/hooks/use-mobile';
import { SongInterface, Credits } from '@/lib/interfaces';
import { useEffectOnce, useLocalStorage } from 'react-use';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [songs, setSongs] = useState<SongInterface[]>([]);
  const [year, setYear] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const { id } = use(params);
  const [isPlaying, setIsPlaying] = useState(false);
  const songRef = useRef<HTMLAudioElement | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [albumName, setAlbumName] = useState("");
  const [albumCreator, setAlbumCreator] = useState("Kanye West");
  const [credits, setCredits] = useState<Credits[]>([]);
  const [appearBar, setAppearBar] = useState(true);
  const [volumeVal, setVolumeVal] = useState<number>(100);
  const [songCreator, setSongCreator] = useState("");
  const [clickedAmmount, setClickedAmmount] = useState(0);
  const [playingSong, setPlayingSong] = useQueryState("playingSong", { defaultValue: "" });
  const [repeatAlbum, setRepeatAlbum] = useState(0); // 0 is off, 1 is repeat the album and 2 is repeat the current song
  const [skipDirection, setSkipDirection] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [newPageLayout] = useLocalStorage("album-page-style", 1);
  const [isLoading, setIsLoading] = useState<boolean | null>(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(false);
  const [showLyricsFullscreen, setShowLyricsFullscreen] = useState(true);
  const [shuffle, setShuffle] = useState(false);

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
      const data = await fetchAlbumSongs(id.toLowerCase().replace(" ", "-"));
      if (data === "NOT FOUND") {
        window.location.replace("/page-not-found");
      }
      setSongs(data.tracks);
      setYear(data.config[0].year);
      setAlbumName(data.config[0].albumName);
      setAlbumCreator(data.config[0].albumCreator);
    }

    async function loadSongCredits() {
      const data = await fetchAlbumCredits(id.toLowerCase().replace(" ", "-"));
      setCredits(data.credits);
    }

    loadSongCredits();
    loadSongs();
  }, [id, albumName]);

  useEffect(() => {
    if ((playingSong === null || playingSong === "") && !isPlaying)
      document.title = `${albumName || id.toLowerCase().replace(" ", "-")} | UnYeleased`;
    else
      document.title = `${playingSong} by ${songCreator} | UnYeleased`;
  }, [playingSong, songCreator, id, albumName])

  useEffect(() => {
    const audioPrefix = `/song-files/songs/${id.toLowerCase().replace(" ", "-")}/`;
    const audioFileType = '.m4a';

    if (playingSong) {
      try {
        setIsLoading(true);
        songRef.current = new Audio(audioPrefix + playingSong + audioFileType);
        songRef.current.loop = (repeatAlbum === 2 && true);
        songRef.current.addEventListener("canplaythrough", () => setIsLoading(false));
        songRef.current.addEventListener("error", () => setIsLoading(null));
      } catch (e) {
        console.log(e);
        setIsLoading(null);
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

  const handleClickEvent = (element: SongInterface, index: number) => {
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
        if (skipDirection && (Math.round(songRef.current.currentTime) >= 5 || currentSongIndex === 0)) {
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

    if (!shuffle)
      setupNextSong(0, repeatAlbum !== 0);
  }

  const handleSkipSong = (back: boolean) => setSkipDirection(back);

  useEffect(() => {
    if (skipDirection !== null) {
      endedSongFunction(skipDirection ? currentSongIndex - 1 : (shuffle ? Math.floor(Math.random() * songs.length) : currentSongIndex + 1));
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

    if (localVolume === null || localVolume === "NaN" || isNaN(Number(localVolume)) || (Number(localVolume) < 0 || Number(localVolume) > 100)) {
      song.volume = 0.5;
    } else {
      song.volume = Number(localVolume) / 100;
    }
  }, [volumeVal, handleSkipSong, isPlaying]);

  const isMobile = useIsMobile();

  useEffectOnce(() => {
    if (isMobile) {
      setAppearBar(playingSong !== "" ? true : false);
    }
  })

  if (newPageLayout === 1) {
    return (
      <NewAlbumPage
        albumName={albumName}
        albumCreator={albumCreator}
        id={id.toLowerCase().replace(" ", "-")}
        isPlaying={isPlaying}
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
        isFullscreenMode={isFullscreenMode}
        setIsFullscreenMode={setIsFullscreenMode}
        showLyricsFullscreen={showLyricsFullscreen}
        setShowLyricsFullscreen={setShowLyricsFullscreen}
        shuffle={shuffle}
        setShuffle={setShuffle}
      />
    )
  } else {
    return (
      <AlbumPage
        albumName={albumName}
        albumCreator={albumCreator}
        id={id.toLowerCase().replace(" ", "-")}
        isPlaying={isPlaying}
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
        isFullscreenMode={isFullscreenMode}
        setIsFullscreenMode={setIsFullscreenMode}
        showLyricsFullscreen={showLyricsFullscreen}
        setShowLyricsFullscreen={setShowLyricsFullscreen}
        shuffle={shuffle}
        setShuffle={setShuffle}
      />
    );
  }
}