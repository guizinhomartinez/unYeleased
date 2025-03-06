import { VolumeOff, Volume2, Volume1, VolumeX, Volume, Repeat, Repeat1 } from "lucide-react";
import { RefObject } from "react";
import { LucideProps } from "lucide-react";

interface AudioControls {
    repeat: number;
    songRef: RefObject<HTMLAudioElement>;
    volumeVal: number;
}

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

export const handleSliderChange = (value: number[], setSliderValue:any, songRef:RefObject<HTMLAudioElement>, setCurrentTimeVal:any) => {
    const newValue = value[0];
    setSliderValue(newValue)
    if (songRef.current) {
        const newTime = (newValue / 100) * songRef.current.duration;
        songRef.current.currentTime = newTime;
        setCurrentTimeVal(newTime);
    }
}

export const muteSong = (songRef:RefObject<HTMLAudioElement>) => {
    if (!songRef.current) return;
    songRef.current && (songRef.current.muted = !songRef.current.muted);
}

export const VolumeIcon = ({ songRef, volumeVal, ...props }: AudioControls & LucideProps) => {
    if (songRef.current?.muted) {
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

export const RepeatIcon = ({ repeat, ...props }: Pick<AudioControls, "repeat">) => {
    return repeat === 2 ? <Repeat1 {...props} /> : <Repeat {...props} />;
};
