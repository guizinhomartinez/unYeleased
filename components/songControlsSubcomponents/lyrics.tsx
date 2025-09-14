import React, { useState, useEffect, useCallback, CSSProperties } from 'react';
import { fetchAlbumLyrics } from '../../lib/fetching';
import { cn } from '@/lib/utils';
import { Lrc, LrcLine } from 'react-lrc';
import '@/app/CSS-files/lyrics.css'
import { LyricsInterface } from '@/lib/interfaces';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocalStorage } from 'react-use';
import Img from 'next/image';
import { AudioLines } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

export default function Lyrics({ currentTimeVal, id, songVal, isSynced, isFullscreenMode, syncedLyricsClassName, haveVerticalSpace, style }: LyricsInterface) {
    const [LyricFile, setLyricFile] = useState<string[]>([]);
    const [lrcContent, setLrcContent] = useState("");
    const [lyricsAlignment] = useLocalStorage("lyrics-alignment", "center", { raw: true });
    const [normalLyricsAlignment] = useLocalStorage("normal-lyrics-alignment", "left", { raw: true });
    const [dancingEmoji] = useLocalStorage("dancing-emoji", false);

    useEffect(() => {
        const loadLyrics = async () => {
            try {
                const data = await fetchAlbumLyrics(id, songVal);

                if (data !== undefined) {
                    setLrcContent(data || "LYRICS NOT FOUND");
                    const formattedData = data.split('\n').filter(line => line.trim() !== "");
                    setLyricFile(formattedData);
                }
            } catch (e) {
                console.error("Error loading lyrics:", e);
            }
        };
        loadLyrics();
    }, [songVal, id]);

    const isMobile = useIsMobile();

    const lrcContainerStyle: React.CSSProperties = {
        height: !isFullscreenMode ? (isMobile ? '100%' : '500px') : '90vh',
        margin: '0.2em',
        flex: 1,
        minHeight: 0,
    };

    const lineRenderer = useCallback(
        ({ active, line: { content } }: { active: boolean; line: LrcLine }) => (
            <div
                className={
                    cn('z-10 select-none transition-all duration-500 font-semibold',
                        !isFullscreenMode ? `text-${lyricsAlignment} origin-${lyricsAlignment} text-2xl mb-3` : 'text-left text-4xl mb-8',
                        !isFullscreenMode && (!active ? 'scale-90' : 'scale-95'),
                        active ? 'text-white/95' : 'text-white/10 blur-[1.5px]'
                    )}
            >
                {content === "" || content === " " || content === "♪" ?
                    <div className={cn('flex items-center', lyricsAlignment === "center" && "justify-center", (lyricsAlignment === "left" || isFullscreenMode) && "justify-start", lyricsAlignment === "right" && "justify-end")}>
                        {dancingEmoji ?
                            <Img unoptimized width={75} height={75} alt="Dancing emoji" src={`/gifs/${active ? "dancing-emoji" : "first-frame-dacing-emoji"}.gif`} />
                            :
                            <AudioLines size='36' />
                        }
                    </div>
                    :
                    content
                }
            </div>
        ),
        []
    );

    return (
        <div className={cn('rounded-lg p-2 relative', !useIsMobile() ? 'min-h-[300px] max-h-[500px]' : 'h-full', isFullscreenMode && "w-full h-full")}>
            {!isSynced ?
                (LyricFile?.includes("LYRICS NOT FOUND") ?
                    <div className={cn('absolute w-full', !isFullscreenMode ? "top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" : "top-[40vh] -left-4")}>
                        <p className='text-center text-lg text-white/50 w-full'>Unable to fetch the lyrics :C</p>
                    </div>
                    :
                    <Lrc
                        className={cn('lrc scroll-smooth lrc-shadow', syncedLyricsClassName, isFullscreenMode && 'pt-7')}
                        lrc={lrcContent}
                        currentMillisecond={currentTimeVal}
                        lineRenderer={lineRenderer}
                        verticalSpace={haveVerticalSpace}
                        style={lrcContainerStyle}
                        recoverAutoScrollInterval={2500}
                    />
                )

                :
                <ScrollArea className='pb-16 px-6' style={lrcContainerStyle}>
                    {LyricFile.map((line, index) => (
                        <div key={index} className={cn("whitespace-pre-wrap text-white text-lg [&:not(:last-child)]:mb-3", `text-${normalLyricsAlignment}`, isMobile && "text-center mb-2 text-lg", LyricFile?.includes("LYRICS NOT FOUND") && "text-left text-md")}>
                            {line.replace(/\[.*?\] /g, "").replace(/\[.*?\]/g, "")}
                        </div>
                    ))}
                </ScrollArea>
            }

        </div>
    );
}