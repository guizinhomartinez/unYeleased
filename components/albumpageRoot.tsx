"use client";

import { AlbumPageRoot } from "@/lib/interfaces";
import { useIsMobile } from "@/hooks/use-mobile";
import { Credits, SongInterface } from "@/lib/interfaces";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEffectOnce, useLocalStorage } from "react-use";
import NewAlbumPage from "./newAlbumPage";

export default function AlbumPageRootComponent({
    data,
    albumCreditData,
    id,
}: {
    data: AlbumPageRoot;
    albumCreditData: Credits[];
    id: string;
}) {
    const [showExplanation, setShowExplanation] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const songRef = useRef<HTMLAudioElement | null>(null);
    const [appearBar, setAppearBar] = useState(true);
    const [volumeVal, setVolumeVal] = useState<number>(100);
    const [songCreator, setSongCreator] = useState("");
    const [clickedAmmount, setClickedAmmount] = useState(0);
    const [currentSongIndex, setCurrentSongIndex] = useState(-1);
    const [playingSong, setPlayingSong] = useQueryState("playingSong", {
        defaultValue: "",
    });
    const [repeatAlbum, setRepeatAlbum] = useState(0); // 0 is off, 1 is repeat the album and 2 is repeat the current song
    const [skipDirection, setSkipDirection] = useState<boolean | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [fullscreen, setFullscreen] = useState<boolean>(false);
    const [newPageLayout] = useLocalStorage("album-page-style", 1);
    const [isLoading, setIsLoading] = useState<boolean | null>(false);
    const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(false);
    const [showLyricsFullscreen, setShowLyricsFullscreen] = useState(true);
    const [shuffle, setShuffle] = useState(false);
    const [albumCover, setAlbumCover] = useState(
        `/song-files/covers/${id}.jpg`
    );
    const [albumCoverType, setAlbumCoverType] = useLocalStorage(
        `${id}-album-cover-type`,
        0
    );
    const [albumCoverInfo, setAlbumCoverInfo] = useState<string[]>([""]);
    const [albumCoverDescription, setAlbumCoverDescription] = useState<
        string[]
    >([""]);

    // gets the locally stored value of volume and applies it to the volumeval variable if it exists
    useEffect(() => {
        const storedVolume = localStorage.getItem("volume") || 100;
        try {
            setVolumeVal(Math.min(100, Math.max(0, Number(storedVolume))));
        } catch (e: any) {
            throw new Error(e.message);
        }
    }, []);

    // sets the album cover based on what the user sets
    useEffect(() => {
        const covers = data.config[0].albumCover;
        const chosenCover =
            covers[
                albumCoverType &&
                albumCoverType >= 0 &&
                albumCoverType < covers.length
                    ? albumCoverType
                    : 0
            ];

        setAlbumCover(`/song-files/covers/${chosenCover ?? id}.jpg`);
        setAlbumCoverInfo(covers);
        setAlbumCoverDescription(data.config[0].albumCoverDescription ?? [""]);
    }, [data.config[0], albumCover, albumCoverInfo, albumCoverType]);

    // changes the website's title depending on the song being played
    useEffect(() => {
        document.title =
            (playingSong === null || playingSong === "") && !isPlaying
                ? `${data.config[0].albumName || id.toLowerCase().replace(" ", "-")} | UnYeleased`
                : `${playingSong} by ${songCreator} | UnYeleased`;
    }, [playingSong, songCreator, id, data.config[0].albumName]);

    // sets up the songRef variable to be used in other areas
    // songRef is used to play the song the user wants to play. it sets up all the basic audio stuff aswell
    // and loads the correct song
    useEffect(() => {
        if (playingSong) {
            try {
                setIsLoading(true);
                songRef.current = new Audio(
                    `/song-files/songs/${id}/` + playingSong + ".m4a"
                );
                songRef.current.loop = repeatAlbum === 2 && true;
                songRef.current.addEventListener("canplaythrough", () =>
                    setIsLoading(false)
                );
                songRef.current.addEventListener("error", () =>
                    setIsLoading(null)
                );
            } catch (e) {
                console.log(e);
                setIsLoading(null);
            }
        }
    }, [playingSong, id]);

    // plays/pauses the song when needed
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
        if (playingSong && playingSong !== "" && data.tracks.length > 0) {
            const songIndex = data.tracks.findIndex(
                (song) => song.title === playingSong
            );

            if (songIndex !== -1) {
                setSongCreator(data.tracks[songIndex].artist);
                setCurrentSongIndex(songIndex);
                setClickedAmmount(1);
            }
        }
    }, [data.tracks, playingSong]);

    const playAlbum = useCallback(() => {
        if (data.tracks.length > 0) {
            if (clickedAmmount < 1) {
                setPlayingSong(data.tracks[0].title);
                setIsPlaying(true);
                setCurrentSongIndex(0);
            }

            setIsPlaying(!isPlaying);
            setClickedAmmount(1);
            setSongCreator(data.tracks[0].artist);
        }
    }, [playingSong, isPlaying, data.tracks, clickedAmmount]);

    function endedSongFunction(newIndex: number) {
        const setupNextSong = (songIndex: number, play: boolean = true) => {
            if (songRef.current) {
                if (
                    skipDirection &&
                    (Math.round(songRef.current.currentTime) >= 5 ||
                        currentSongIndex === 0)
                ) {
                    songRef.current.currentTime = 0;
                    return;
                }
            }

            setCurrentSongIndex(songIndex);
            setPlayingSong(data.tracks[songIndex].title);
            setSongCreator(data.tracks[songIndex].artist);
            setIsPlaying(play);
        };

        const repeatSong = () => {
            if (songRef.current) {
                songRef.current.currentTime = 0;
                songRef.current.play();
            }
            setIsPlaying(true);
        };

        if (repeatAlbum === 2) return repeatSong();

        if (newIndex !== data.tracks.length) return setupNextSong(newIndex);

        if (!shuffle) setupNextSong(0, repeatAlbum !== 0);
    }

    const handleSkipSong = (back: boolean) => setSkipDirection(back);

    useEffect(() => {
        if (skipDirection !== null) {
            endedSongFunction(
                skipDirection
                    ? currentSongIndex - 1
                    : shuffle
                      ? Math.floor(Math.random() * data.tracks.length)
                      : currentSongIndex + 1
            );
            setSkipDirection(null);
        }
    }, [
        skipDirection,
        currentSongIndex,
        data.tracks,
        playingSong,
        repeatAlbum,
        endedSongFunction,
    ]);

    useEffect(() => {
        const song = songRef.current;
        if (!song) return;

        const handleSongEnd = () => endedSongFunction(currentSongIndex + 1);
        song.addEventListener("ended", handleSongEnd);

        return () => {
            song.removeEventListener("ended", handleSongEnd);
        };
    }, [
        currentSongIndex,
        data.tracks,
        playingSong,
        repeatAlbum,
        endedSongFunction,
    ]);

    useEffect(() => {
        const song = songRef.current;
        if (!song) return;

        localStorage.setItem("volume", Math.min(100, Math.max(0, volumeVal)).toString());

        const localVolume = localStorage.getItem("volume");

        if (
            localVolume === null ||
            localVolume === "NaN" ||
            isNaN(Number(localVolume)) ||
            Number(localVolume) < 0 ||
            Number(localVolume) > 100
        ) {
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
    });

    if (newPageLayout === 1) {
        return (
            <NewAlbumPage
                albumName={data.config[0].albumName || id}
                albumCreator={data.config[0].albumCreator || "Kanye West"}
                id={id}
                isPlaying={isPlaying}
                showExplanation={showExplanation}
                setShowExplanation={setShowExplanation}
                fullscreen={fullscreen}
                setFullscreen={setFullscreen}
                songs={data.tracks}
                searchQuery={searchQuery}
                playAlbum={playAlbum}
                appearBar={appearBar}
                currentSongIndex={currentSongIndex}
                handleClickEvent={handleClickEvent}
                setSearchQuery={setSearchQuery}
                setAppearBar={setAppearBar}
                year={data.config[0].year}
                songRef={songRef}
                playingSong={playingSong}
                setIsPlaying={setIsPlaying}
                volumeVal={volumeVal}
                setVolumeVal={setVolumeVal}
                songCreator={songCreator}
                handleSkipSong={handleSkipSong}
                repeatAlbum={repeatAlbum}
                setRepeatAlbum={setRepeatAlbum}
                credits={albumCreditData}
                isLoading={isLoading}
                isFullscreenMode={isFullscreenMode}
                setIsFullscreenMode={setIsFullscreenMode}
                showLyricsFullscreen={showLyricsFullscreen}
                setShowLyricsFullscreen={setShowLyricsFullscreen}
                shuffle={shuffle}
                setShuffle={setShuffle}
                albumCover={albumCover}
                albumCoverType={albumCoverType || 0}
                setAlbumCoverType={setAlbumCoverType}
                albumCoverInfo={albumCoverInfo}
                albumCoverDescription={albumCoverDescription}
            />
        );
    }
}
