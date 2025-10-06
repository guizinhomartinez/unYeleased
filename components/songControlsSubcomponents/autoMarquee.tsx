"use client"

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import { useLocalStorage } from "react-use";
import "@/app/CSS-files/song-controls.css";

export const AutoMarquee = (props: { text: string, className: string, marqueeClassName?: string, number: number }) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollOnOverflow] = useLocalStorage("text-scroll-overflow", true);
    const [shouldPlay, setShouldPlay] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current && props.text) {
                const { scrollWidth, clientWidth } = containerRef.current;
                setIsOverflowing(scrollWidth > clientWidth);
            }
        };

        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [props.text]);

    useEffect(() => {
        setShouldPlay(false);
        if (isOverflowing) setTimeout(() => setShouldPlay(true), 5000);
    }, [isOverflowing])

    return (
        <div
            ref={containerRef}
            className={cn(
                "w-full overflow-hidden h-full",
                props.className
            )}
        >
            {isOverflowing && scrollOnOverflow ? (
                <Marquee
                    className={cn("select-none w-36 z-0", props.marqueeClassName, `shadowed-song-name-${shouldPlay ? "2" : "1"}`)}
                    play={shouldPlay}
                    speed={30}
                    onCycleComplete={() => {
                        setShouldPlay(false);
                        setTimeout(() => setShouldPlay(true), 5000);
                    }}
                >
                    {props.text} {'\u00A0'.repeat(25)}
                </Marquee>
            ) : (
                <span className="select-none w-36 whitespace-nowrap max-w-32">
                    {props.text}
                </span>
            )}
        </div>
    );
};