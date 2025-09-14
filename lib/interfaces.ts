import { Dispatch, SetStateAction } from "react";

// Songs stuff (their title and artist)
export interface SongInterface {
    title: string;
    artist: string;
}

// Volume value and repeat value
export interface AudioSettingsInterface {
    repeat?: number;
    songRef: any;
    volumeVal: number;
}

// Credits JSON file stuff
export interface Credits {
    credits: CreditParts[];
    name: string[];
    type: string;
    originalLink: any;
}

export interface CreditParts {
    name: string[];
    type: string;
    originalLink: any;
}

// Related to the mini player and the song controls (basically the same stuff just different interface for more flexibility)
export interface songControlsInterface {
    songRef: any;
    songVal: string;
    isPlaying: boolean;
    setIsPlaying: Dispatch<SetStateAction<boolean>>;
    volumeVal: number;
    setVolumeVal: any;
    image: string;
    songCreator: string;
    handleSkipSong: (back: boolean) => void;
    repeat: number;
    setRepeat: Dispatch<SetStateAction<number>>;
    id: string;
    albumName?: string;
    appearBar: boolean;
    setAppearBar: any;
    isLoading: boolean | null;
    tutorialNumber?: number;
    isFullscreenMode?: boolean;
    setIsFullscreenMode?: any;
    showLyricsFullscreen?: boolean;
    setShowLyricsFullscreen?: any;
    shuffle: boolean;
    setShuffle: any;
}

export interface isFullscreenModeInterface {
    image: string;
    currentTimeVal: number;
    id: string;
    songVal: string;
    songCreator: string;
    isFullscreenMode: boolean;
    isPlaying: boolean;
    setIsPlaying: any;
    showLyricsFullscreen?: boolean;
    setShowLyricsFullscreen?: any;
    isLoading: boolean | null;
}

export interface MiniPlayerInterface {
    albumCover: string;
    songRef: any;
    songVal: string;
    isPlaying: boolean;
    setIsPlaying: any;
    volumeVal: number;
    setVolumeVal: any;
    songCreator: string;
    handleSkipSong: any;
    repeat: number;
    setRepeat: any;
    id: string;
    isLoading: boolean | null;
    shuffle: boolean;
    setShuffle: any;
}

// Fullscreen lyrics (rn it's deprecated)
export interface FullscreenButtonInterface {
    albumCover: string;
    isSynced: boolean;
    setIsSynced: any;
    showLyrics: boolean;
    currentTimeVal: number;
    id: string;
    songVal: string;
    songRef: any;
    songCreator: string;
    isPlaying: boolean;
    setIsPlaying: any;
    handleSkipSong: any;
    isLoading: boolean | null;
}

// Homepage stuff
export interface HomepageInterface {
    link: string;
    image: string;
    text: string;
    tags: string[];
    subtext: string;
    creators: string;
}

export interface AlbumsInterface {
    entry: any;
    isGrid: boolean;
    setSearchQuery: any;
    index: any;
}

// Everything related to the album pages
export interface AlbumPageInterface {
    albumName: string;
    albumCreator: string;
    id: any;
    isPlaying: boolean;
    showExplanation: boolean;
    setShowExplanation: any;
    fullscreen: boolean;
    setFullscreen: any;
    songs: SongInterface[];
    searchQuery: string;
    setSearchQuery: any;
    playAlbum: any;
    appearBar: boolean;
    setAppearBar: any;
    currentSongIndex: number;
    handleClickEvent: any;
    year: number;
    songRef: any;
    playingSong: any;
    setIsPlaying: any;
    volumeVal: number;
    setVolumeVal: any;
    songCreator: string;
    handleSkipSong: any;
    repeatAlbum: number;
    setRepeatAlbum: any;
    credits: CreditParts[];
    isLoading: boolean | null;
    isFullscreenMode?: boolean;
    setIsFullscreenMode?: any;
    showLyricsFullscreen?: boolean;
    setShowLyricsFullscreen?: any;
    shuffle: boolean;
    setShuffle: any;
    albumCover: string;
    albumCoverType: number;
    setAlbumCoverType: any;
    albumCoverInfo: string[];
    albumCoverDescription: string[];
}

// Stuff related to album explanations
export interface AlbumExplanationInterface {
    setShowExplanation: any;
    showExplanation: boolean;
    id: string;
    variant: number;
}

// Lyrics
export interface LyricsInterface {
    currentTimeVal: number;
    id: string;
    songVal: string;
    isSynced?: boolean;
    isFullscreenMode?: boolean;
    syncedLyricsClassName?: string;
    haveVerticalSpace?: boolean;
    style?: React.CSSProperties;
    ref?: any;
}

//Album page tracklist subcompoennt
export interface AlbumPageTracklistInterface {
    songs: SongInterface[];
    appearBar: boolean;
    currentSongIndex: number;
    handleClickEvent: any;
    newStyle: boolean;
    playingSong: string;
    id: string;
}

// Song player interface
export interface SongPlayerButtonsInterface {
    shuffle?: boolean | false;
    setShuffle?: any | undefined;
    handleSkipSong: any;
    songVal: string;
    isLoading: boolean | null;
    isPlaying: boolean;
    setIsPlaying: any;
    songRef: any;
    repeat?: number | 0;
    setRepeat?: any | undefined;
    biggerPadding: boolean;
    buttonVariant: any;
    extraButtons: boolean;
}

// album page interfaces
export interface AlbumPageRoot {
    config: AlbumPageRootConfig[];
    tracks: AlbumPageRootTracks[];
}

export interface AlbumPageRootConfig {
    albumCover: string[];
    albumCoverDescription: string[];
    albumCreator: string;
    albumName: string;
    credits: string;
    year: number;
}

export interface AlbumPageRootTracks {
    artist: string;
    title: string;
}