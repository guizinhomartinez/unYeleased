import { VolumeOff, Volume2, Volume1, VolumeX, Volume, Repeat, Repeat1, LoaderCircleIcon, Play, Pause } from "lucide-react";
import { RefObject } from "react";
import { LucideProps } from "lucide-react";
import { AudioSettingsInterface } from "./interfaces";

export const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};

export const formattedSongTime = (songTime: number, songTimeType: number, currentTimeVal: number): string => {
    if (isNaN(songTime)) {
        return "0:00";
    }

    return songTimeType === 1
        ? `-${formatTime(songTime - currentTimeVal)}`
        : formatTime(songTime);
};

export const handleSliderChange = (value: number[], setSliderValue: any, songRef: RefObject<HTMLAudioElement | null>, setCurrentTimeVal: any) => {
    const newValue = value[0];
    setSliderValue(newValue)
    if (songRef.current) {
        const newTime = (newValue / 100) * songRef.current.duration;
        songRef.current.currentTime = newTime;
        setCurrentTimeVal(newTime);
    }
}

export const muteSong = (songRef: RefObject<HTMLAudioElement | null>) => {
    if (!songRef.current) return;
    songRef.current && (songRef.current.muted = !songRef.current.muted);
}

export const VolumeIcon = ({ songRef, volumeVal, ...props }: AudioSettingsInterface & LucideProps) => {
    if (volumeVal === undefined) return;

    if (!songRef.current) return <Volume1 />;

    if (songRef.current.muted) {
        return <VolumeOff {...props} />;
    }

    if (volumeVal > 60) {
        return <Volume2 {...props} />;
    } else if (volumeVal > 30) {
        return <Volume1 {...props} />;
    } else if (volumeVal === 0) {
        return <VolumeX {...props} />;
    } else {
        return <Volume {...props} />;
    }
};

export const RepeatIcon = ({ repeat, size }: { repeat: number, size?: string | any }) => {
    return repeat === 2 ? <Repeat1 size={size} /> : <Repeat size={size} />;
};

export const PlayIcon = ({ isLoading, isPlaying, songRef, size }: { isLoading: boolean | null, isPlaying: boolean, songRef: RefObject<HTMLAudioElement | null>, size?: number }) => {
    if (isLoading)
        return <LoaderCircleIcon className="animate-spin" size={size} />

    if (!songRef.current) {
        return <Play size={size?.toString()} />
    } else {
        if (!isPlaying)
            return <Play size={size?.toString()} />
        else
            return <Pause size={size?.toString()} />
    }
}