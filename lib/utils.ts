import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export interface Song {
  title: string;
  artist: string;
}

export interface albumPage {
  albumName: string;
  albumCreator: string;
  id: any;
  isPlaying: boolean;
  showExplanation: boolean;
  setShowExplanation: any;
  fullscreen: boolean;
  setFullscreen: any;
  songs: Song[];
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
  credits: string;
}

export interface AlbumExplanationInterface {
  setShowExplanation: any;
  showExplanation: boolean;
  fullscreen?: boolean;
  setFullscreen?: any;
  id: string;
  variant: number;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const lyricsDelay = 1002; // might tweak this value a little bit