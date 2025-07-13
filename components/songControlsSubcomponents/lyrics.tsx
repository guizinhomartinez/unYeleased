import React, { useState, useEffect, useCallback, CSSProperties } from 'react';
import { fetchAlbumLyrics } from '../../lib/fetching';
import { cn } from '@/lib/utils';
import { Lrc, LrcLine } from 'react-lrc';
import '@/public/CSS/lyrics.css'
import { LyricsInterface } from '@/lib/interfaces';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocalStorage } from 'react-use';

export default function Lyrics({ currentTimeVal, id, songVal, isSynced, isFullscreenMode, setLyricsStr, syncedLyricsClassName }: LyricsInterface) {
    const [LyricFile, setLyricFile] = useState<string[]>([]);
    const [lrcContent, setLrcContent] = useState("");
    const [lyricsAlignment] = useLocalStorage("lyrics-alignment", "center", { raw: true });
    const [normalLyricsAlignment] = useLocalStorage("normal-lyrics-alignment", "left", { raw: true });

    useEffect(() => {
        const loadLyrics = async () => {
            try {
                const data = await fetchAlbumLyrics(id, songVal);
                setLrcContent(data || "Unable to fetch the lyrics :C");
                setLyricsStr(data || "Unable to fetch the lyrics :C");

                const formattedData = data.split('\n').filter(line => line.trim() !== "");
                setLyricFile(formattedData);
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

    const isLeftAlignedText = (active: boolean) => (lyricsAlignment === "left") && active;
    const isRightAlignedText = (active: boolean) => (lyricsAlignment === "right") && active;

    const lineRenderer = useCallback(
        ({ active, line: { content } }: { active: boolean; line: LrcLine }) => (
            <p
                className={
                    cn('z-10 select-none transition-all duration-500 font-semibold',
                        !isFullscreenMode ? "text-2xl mb-3" : "text-4xl mb-8",
                        !isFullscreenMode ? `text-${lyricsAlignment}` : 'text-left',
                        !isFullscreenMode && (isLeftAlignedText(active) && "translate-x-2.5", isRightAlignedText(active) && "-translate-x-2.5"),
                        active ? 'text-white/95' : 'text-white/10 blur-[2px]',
                        !isFullscreenMode && (!active ? 'scale-90' : 'scale-95'))}
            >
                {content}
            </p>
        ),
        []
    );

    return (
        <div className={cn('rounded-lg p-2 relative', !useIsMobile() ? 'min-h-[300px] max-h-[500px]' : 'h-full', isFullscreenMode && "")}>
            {!isSynced ?
                (LyricFile?.includes("Unable to fetch the lyrics :C") ?
                    <div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full'>
                        <p className='text-center text-lg text-white/50'>Unable to fetch the lyrics :C</p>
                    </div>
                    :
                    <Lrc
                        className={cn('lrc scroll-smooth lrc-shadow', syncedLyricsClassName, isFullscreenMode && 'pt-7')}
                        lrc={lrcContent}
                        currentMillisecond={currentTimeVal}
                        lineRenderer={lineRenderer}
                        verticalSpace={!isFullscreenMode}
                        style={lrcContainerStyle}
                        recoverAutoScrollInterval={2500}
                    />
                )

                :
                <div className="overflow-y-auto scroll-smooth pb-16 px-6" style={lrcContainerStyle}>
                    {LyricFile.map((line, index) => (
                        <div key={index} className={cn("whitespace-pre-wrap text-white text-lg [&:not(:last-child)]:mb-3", `text-${normalLyricsAlignment}`, isMobile && "text-center mb-2 text-lg", LyricFile?.includes("Unable to fetch the lyrics :C") && "text-left text-md")}>
                            {line.replace(/\[.*?\] /g, "").replace(/\[.*?\]/g, "")}
                        </div>
                    ))}
                </div>
            }

        </div>
    );
}
