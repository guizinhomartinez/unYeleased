import React, { useEffect, useState } from 'react';
import { Lrc, LrcLine } from 'react-lrc';
import { fetchAlbumLyrics } from '../fetching';
import { cn } from '@/lib/utils';

interface LyricsInterface {
    currentTimeVal: number;
    id: string;
    songVal: string;
}

export default function Lyrics({ currentTimeVal, id, songVal }: LyricsInterface) {
    const [LyricFile, setLyricFile] = useState("[00:00.000]No Lyrics");

    useEffect(() => {
        const loadLyrics = async () => {
            if (!id || !songVal) return;

            try {
                const data = await fetchAlbumLyrics(id, songVal);
                setLyricFile(data);
            } catch (e) {
                console.error(e);
            }
        };

        loadLyrics();
    }, [songVal, id]);

    return (
        <div className='min-h-[300px] max-h-[500px] overflow-scroll rounded-lg p-2'>
            <Lrc
                lrc={LyricFile}
                lineRenderer={({ active, line }) => (
                    <div className={cn(active ? "text-green-500" : "text-primary")}>
                        {line.content}
                    </div>
                )}
                currentMillisecond={currentTimeVal}
            />
        </div>
    )

}