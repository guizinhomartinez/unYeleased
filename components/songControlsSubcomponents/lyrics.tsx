import React, { useState, useEffect } from 'react';
import { fetchAlbumLyrics } from '../fetching';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function Lyrics({ currentTimeVal, id, songVal }: { currentTimeVal: number, id: string, songVal: string }) {
    const [LyricFile, setLyricFile] = useState<string[]>([]);

    useEffect(() => {
        const loadLyrics = async () => {
            try {
                const data = await fetchAlbumLyrics(id, songVal);
                const formattedData = data.split('\n').filter(line => line.trim() !== "");
                setLyricFile(formattedData);
            } catch (e) {
                console.error("Error loading lyrics:", e);
                setLyricFile(["Error: Unable to fetch lyrics"]);
            }
        };
        loadLyrics();
    }, [songVal, id]);

    return (
        <div className={cn('min-h-[300px] max-h-[500px] rounded-lg p-2', !LyricFile?.includes("Error: Unable to fetch lyrics") && 'overflow-y-scroll')}>
            {LyricFile.length > 0 ? (
                LyricFile.map((line, index) => (
                    <div key={index} className="whitespace-pre-wrap">
                        {line}
                    </div>
                ))
            ) : (
                <Loader2 className={cn('h-16 w-16 text-primary/60 animate-spin')} />
            )}
        </div>
    );
}
