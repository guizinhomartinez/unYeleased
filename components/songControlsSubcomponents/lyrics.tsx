import React, { useState, useEffect } from 'react';
import { fetchAlbumLyrics } from '../../lib/fetching';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Lyrics({ currentTimeVal, id, songVal }: { currentTimeVal: number, id: string, songVal: string }) {
    const [LyricFile, setLyricFile] = useState<string[]>([]);
        const [imageSize, setImageSize] = useState(260);
    
        useEffect(() => {
            const reiszeImage = () => setImageSize(window.innerWidth < 768 ? 280 : 260);
            reiszeImage();
    
            window.addEventListener("resize", reiszeImage);
            return () => {
                window.removeEventListener("resize", reiszeImage);
            }
        })

    useEffect(() => {
        const loadLyrics = async () => {
            try {
                const data = await fetchAlbumLyrics(id, songVal);
                const formattedData = data.split('\n').filter(line => line.trim() !== "");
                setLyricFile(formattedData);
            } catch (e) {
                console.error("Error loading lyrics:", e);
            }
        };
        loadLyrics();
    }, [songVal, id]);

    return (
        <div className={cn('min-h-[300px] max-h-[500px] rounded-lg p-2 relative', !LyricFile?.includes("Unable to fetch the lyrics :C") && 'overflow-y-scroll')}>
            {LyricFile.length > 0 ? (
                LyricFile.map((line, index) => (
                    <div key={index} className={cn("whitespace-pre-wrap", imageSize ==- 280 && "text-xl")}>
                        {line.replace(/\[.*?\] /g, "").replace(/\[.*?\]/g, "")}
                    </div>
                ))
            ) : (
                <div className='w-full h-full absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
                    <Loader2 className={cn('h-16 w-16 text-primary/60 animate-spin')} />
                </div>
            )}
        </div>
    );
}
