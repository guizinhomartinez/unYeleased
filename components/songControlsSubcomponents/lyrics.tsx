import React, { useState } from 'react';
import { fetchAlbumLyrics } from '../fetching';

export default function Lyrics({ currentTimeVal, id, songVal }: { currentTimeVal: number, id: string, songVal: string, songRef: any }) {
    const [LyricFile, setLyricFile] = useState<string>();

    React.useEffect(() => {
        const loadLyrics = async () => {
            try {
                const data = await fetchAlbumLyrics(id, songVal);
                setTimeout(() => setLyricFile(data), 100);
            } catch (e) {
                console.error("Error loading lyrics:", e);
            }
        };
        loadLyrics();
    }, [songVal, id]);

    return (
        <div className='min-h-[300px] max-h-[500px] overflow-y-scroll rounded-lg p-2'>
            {LyricFile}
        </div>
    );
}