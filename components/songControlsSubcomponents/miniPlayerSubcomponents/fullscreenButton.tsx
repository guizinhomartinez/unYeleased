'use client'

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ChevronLeft, Maximize2 } from "lucide-react";
import { useState } from "react";
import Image from 'next/image'
import { motion } from "motion/react";
import { AutoMarquee } from "../autoMarquee";
import { PlayIcon } from "@/lib/songControlsFunctions";
import Lyrics from "../lyrics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DownloadMenu, ShareMenu } from "../moreOptionsMenu";
import { FullscreenButtonInterface } from "@/lib/interfaces";
import clsx from "clsx";
import { useLongPress } from "@uidotdev/usehooks";

export const FullscreenButton = (props: FullscreenButtonInterface) => {
    const [hidePill, setHidePill] = useState(false);
    const [hideDrawer, setHideDrawer] = useState(false);
    const [number, setNumber] = useState(1);
    const [draggedAmmount, setDraggedAmmount] = useState(0);
    const [secondDrawerShouldAppear, setSDSA] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isHolding, setIsHolding] = useState(false);

    const longPressEvent = useLongPress(
        () => {
            if (!isDragging) {
                setSDSA(true);
            }
        },
        {
            onStart: () => {
                if (!isDragging) setIsHolding(true);
            },
            onFinish: () => setTimeout(() => setIsHolding(false), 1000),
            onCancel: () => setIsHolding(false),
            threshold: 500,
        }
    );

    return (
        <Drawer open={hideDrawer} onOpenChange={setHideDrawer} onDrag={(_, newNumber) => setNumber(1 - newNumber)} dismissible={!isDragging}>
            <DrawerTrigger asChild>
                <Maximize2 className="rotate-90" size='12' />
            </DrawerTrigger>
            <DrawerContent
                className="h-full max-h-full rounded-none border flex flex-col overflow-hidden"
                showGrabThing={false}
            >
                <Image src={props.albumCover} alt={props.albumCover} width={0} height={0} className="absolute inset-0 bg-cover bg-center opacity-10 blur-2xl size-full pointer-events-none" />
                <div
                    className="p-3 px-6 w-full bg-secondary/25 border"
                    style={{
                        maskImage: "linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%)",
                        WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%)"
                    }}
                    onContextMenu={e => e.preventDefault()}
                >
                    <div
                        className="flex justify-between items-center outline-none"
                    >
                        <motion.div
                            className="w-full !max-w-[80%]"
                            style={{
                                maskImage: "linear-gradient(#000 5%, #000 95%, transparent 100%)",
                                WebkitMaskImage: "linear-gradient(#000 5%, #000 95%, transparent 100%)"
                            }}
                            drag="x"
                            onClick={() => {
                                if (!isDragging && !isHolding) {
                                    setHideDrawer(false);
                                }
                            }}
                            dragConstraints={{ left: 0, right: 0 }}
                            onDrag={(_, info) => {
                                setIsDragging(true);
                                setIsHolding(false);
                                setDraggedAmmount(-info.offset.x);
                            }}
                            {...longPressEvent}
                            transition={{ duration: 0.6 }}
                            whileTap={{ scale: 0.98 }}
                            onDragEnd={() => {
                                try {
                                    if (draggedAmmount !== 0) {
                                        props.setIsPlaying(true);
                                        if (draggedAmmount > 200) {
                                            props.handleSkipSong(true);
                                        }
                                        else if (draggedAmmount < -50) {
                                            props.handleSkipSong(false);
                                        }
                                    }
                                } catch (e) {
                                    return;
                                }
                                setTimeout(() => setIsDragging(false), 650);
                                setDraggedAmmount(0);
                            }}>
                            <div className="flex justify-center items-center gap-3">
                                <Image src={props.albumCover} alt="Album Cover" width={60} height={60} className="rounded-lg shadow-xl pointer-events-none aspect-square" />
                                <div className="flex flex-col w-full overflow-hidden">
                                    <AutoMarquee text={props.songVal || "No Track Found"} className="font-semibold max-w-48" number={0} />
                                    <AutoMarquee text={props.songCreator || "Unknown"} className="text-sm text-muted-foreground" number={2} />
                                </div>
                            </div>
                        </motion.div>

                        <div className="flex gap-2 items-end justify-end min-w-9 overflow-hidden" onClick={e => { e.stopPropagation(); e.preventDefault() }}>
                            <motion.button
                                className="size-9 bg-transparent rounded-full z-[1000] outline-none disabled:opacity-50 flex justify-center items-center antialiased"
                                onClick={() => {
                                    (!props.isLoading || props.isLoading === null) && props.setIsPlaying(props.songVal !== "" && !props.isPlaying)
                                }}
                                disabled={props.isLoading === null}
                                whileTap={{ scale: !isDragging ? 0.9 : 1 }}
                            >
                                <PlayIcon size={20} isLoading={props.isLoading} isPlaying={props.isPlaying} songRef={props.songRef} />
                            </motion.button>
                        </div>
                    </div>
                </div>
                <div className="relative size-full overflow-hidden px-4">
                    <Lyrics currentTimeVal={props.currentTimeVal} id={props.id} songVal={props.songVal} isSynced={!props.isSynced} isFullscreenMode={false} syncedLyricsClassName={clsx("pt-10")} haveVerticalSpace={false} />
                    <div className="absolute left-2.5 bottom-6">
                        <Button size='icon' variant='link' className="bg-secondary/50 hover:bg-secondary p-1.5 rounded-full opacity-75 hover:opacity-100 z-[1000]" onClick={() => setHidePill(!hidePill)}>
                            <ChevronLeft className={cn("transition-all duration-500", !hidePill ? "rotate-0" : "rotate-180")} />
                        </Button>
                    </div>
                    <motion.div
                        className="absolute flex justify-center items-center bottom-6 left-1/2 -translate-x-1/2 rounded-full opacity-75 transition-opacity duration-500 bg-primary-foreground py-1 w-[60%] px-2"
                        animate={{
                            left: !hidePill ? "-200px" : "50%",
                            opacity: !hidePill ? 0 : "75%"
                        }}
                        transition={{ type: "spring", duration: 1 }}
                    >
                        <div className="rounded-full flex justify-center items-center w-full relative">
                            <div onClick={() => props.setIsSynced(true)} className={cn("w-full text-center transition-colors duration-500 rounded-full cursor-default select-none", !props.isSynced && "cursor-pointer")}>
                                Synced
                            </div>
                            <div onClick={() => props.setIsSynced(false)} className={cn("w-full text-center transition-colors duration-500 rounded-full cursor-default select-none", props.isSynced && "cursor-pointer")}>
                                Normal
                            </div>
                        </div>
                        <motion.span
                            className="absolute top-0 bg-primary mix-blend-difference w-[52%] h-full"
                            animate={{
                                left: props.isSynced ? "0%" : "50%",
                            }}
                            transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
                            style={{ borderRadius: 9999 }}
                        />
                    </motion.div>
                </div>
            </DrawerContent>

            <Drawer open={!isDragging && secondDrawerShouldAppear} onOpenChange={setSDSA}>
                <DrawerContent className="max-h-full rounded-t-3xl">
                    <div className="p-5 w-full flex flex-col gap-2">
                        <ShareMenu songRef={props.songRef} songVal={props.songVal} />
                        <DownloadMenu songVal={props.songVal} id={props.id} />
                    </div>
                </DrawerContent>
            </Drawer>
        </Drawer>
    )
}