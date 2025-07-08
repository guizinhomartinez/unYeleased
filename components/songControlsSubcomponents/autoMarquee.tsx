"use client"

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import { useLocalStorage } from "react-use";

export const AutoMarquee = (props: { text: string, className: string, number: number }) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollOnOverflow, setScrollOnOverflow] = useLocalStorage("text-scroll-overflow", true);
    const [addSecondClass, setAddSecondClass] = useState(false);

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
        setAddSecondClass(false);
        setTimeout(() => setAddSecondClass(true), 5000);
    }, [props.text])

    return (
        <div
            ref={containerRef}
            className={cn(
                "max-w-full w-full overflow-hidden",
                props.className
            )}
        >
            {isOverflowing && scrollOnOverflow ? (
                <Marquee className={cn("select-none leading-none block w-36 gap-2", isOverflowing && (addSecondClass ? "shadowed-song-name-2" : "shadowed-song-name"))} delay={5} speed={30}>
                    {props.text}
                </Marquee>
            ) : (
                <span className="select-none leading-none block w-36 whitespace-nowrap">
                    {props.text}
                </span>
            )}
        </div>
    );
};