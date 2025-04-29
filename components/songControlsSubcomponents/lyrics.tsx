import React, { useState, useEffect, useCallback, CSSProperties } from 'react';
import { fetchAlbumLyrics } from '../../lib/fetching';
import { cn } from '@/lib/utils';
import { Lrc, LrcLine } from 'react-lrc';
import '@/public/CSS/lyrics.css'

export default function Lyrics({ currentTimeVal, id, songVal, isSynced }: { currentTimeVal: number, id: string, songVal: string, isSynced?: boolean }) {
    const [LyricFile, setLyricFile] = useState<string[]>([]);
    const [imageSize, setImageSize] = useState(260);
    const [lrcContent, setLrcContent] = useState("");
    const [lyricsAlignment, setLyricsAlignment] = useState("center");
    const [normalLyricsAlignment, setNormalLyricsAlignment] = useState("left");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const reiszeImage = () => setImageSize(window.innerWidth < 768 ? 280 : 260);
        reiszeImage();

        window.addEventListener("resize", reiszeImage);
        return () => {
            window.removeEventListener("resize", reiszeImage);
        }
    })

    useEffect(() => {
        const storedStyle = localStorage.getItem("lyrics-alignment");
        const storedNormalStyle = localStorage.getItem("normal-lyrics-alignment");
        storedStyle !== null && setLyricsAlignment(lyricsAlignment);
        storedNormalStyle !== null && setNormalLyricsAlignment(normalLyricsAlignment);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("lyrics-alignment", lyricsAlignment);
            localStorage.setItem("normal-lyrics-alignment", normalLyricsAlignment);
        }
    }, [lyricsAlignment]);

    useEffect(() => {
        const loadLyrics = async () => {
            try {
                const data = await fetchAlbumLyrics(id, songVal);
                setLrcContent(data);
                const formattedData = data.split('\n').filter(line => line.trim() !== "");
                setLyricFile(formattedData);
            } catch (e) {
                console.error("Error loading lyrics:", e);
            }
        };
        loadLyrics();
    }, [songVal, id]);

    const lrcContainerStyle: React.CSSProperties = {
        height: imageSize === 280 ? '100%' : '500px',
        margin: '0.2em',
        flex: 1,
        minHeight: 0,
    };

    const isLeftAlignedText = (active: boolean) => ((localStorage.getItem("lyrics-alignment") || lyricsAlignment) === "left") && active;
    const isRightAlignedText = (active: boolean) => ((localStorage.getItem("lyrics-alignment") || lyricsAlignment) === "right") && active;

    const lineRenderer = useCallback(
        ({ active, line: { content } }: { active: boolean; line: LrcLine }) => (
            <p
                className={
                    cn('text-2xl mb-3 z-10 select-none transition-all duration-500 font-semibold',
                        `text-${localStorage.getItem("lyrics-alignment") || lyricsAlignment}`,
                        isLeftAlignedText(active) && "translate-x-2.5", isRightAlignedText(active) && "-translate-x-2.5",
                        active ? 'text-white/95 scale-100' : 'text-white/10 scale-95 blur-[2px]')}
            >
                {content}
            </p>
        ),
        []
    );

    return (
        <div className={cn('rounded-lg p-2 relative', imageSize === 260 ? 'min-h-[300px] max-h-[500px]' : 'h-full')}>
            {!isSynced ?
                <Lrc
                    className='lrc scroll-smooth'
                    lrc={lrcContent}
                    currentMillisecond={currentTimeVal}
                    lineRenderer={lineRenderer}
                    verticalSpace
                    style={lrcContainerStyle}
                    recoverAutoScrollInterval={2500}
                />
                :
                <div className="overflow-y-auto scroll-smooth pb-16 px-5" style={lrcContainerStyle}>
                    {LyricFile.map((line, index) => (
                        <div key={index} className={cn("whitespace-pre-wrap text-white", `text-${localStorage.getItem("normal-lyrics-alignment") || normalLyricsAlignment}`, imageSize === 280 && "text-center mb-2 text-lg", LyricFile?.includes("Unable to fetch the lyrics :C") && "text-left text-md")}>
                            {line.replace(/\[.*?\] /g, "").replace(/\[.*?\]/g, "")}
                        </div>
                    ))}
                </div>
            }

        </div>
    );
}
