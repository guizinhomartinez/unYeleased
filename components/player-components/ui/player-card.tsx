import AlbumCover from "@/components/albumPageSubcomponents/albumCover";
import { PlayerRewriteInterface } from "@/components/player";
import { AutoMarquee } from "@/components/songControlsSubcomponents/autoMarquee";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import PopoverMenu from "../popover-menu";
import DrawerMenu from "../drawer-menu";
import { Slider } from "@/components/ui/slider";
import {
    formattedSongTime,
    formatTime,
    muteSong,
    RepeatIcon,
    VolumeIcon,
} from "@/lib/songControlsFunctions";
import { Button } from "@/components/ui/button";
import VolumeSlider from "@/components/songControlsSubcomponents/volumeSlider";
import { Dispatch, RefObject, SetStateAction, useEffect, useState } from "react";
import PlayerControls from "./player-controls";
import PlayerSongProgress from "./player-song-progress";

type PlayerCardInterface = {
    songRef: RefObject<HTMLAudioElement | null>;
    showExplanation: boolean;
    setShowExplanation: Dispatch<SetStateAction<boolean>>;
    isPlaying: boolean;
    setIsPlaying: Dispatch<SetStateAction<boolean>>;
    repeat: boolean;
    setRepeat: Dispatch<SetStateAction<boolean>>;
    volumeVal: number | any;
    setVolumeVal: Dispatch<SetStateAction<number | any>>;
};

const PlayerCard = ({
    image,
    text,
    subtext,
    songVal,
    backgroundLore,
    linkToGenius,
    lyrics,
    songRef,
    setShowExplanation,
    showExplanation,
    isPlaying,
    setIsPlaying,
    repeat,
    setRepeat,
    volumeVal,
    setVolumeVal,
}: PlayerRewriteInterface & PlayerCardInterface) => {
    const isMobile = useIsMobile();

    return (
        <div
            className={cn(
                "p-6 rounded-3xl",
                isMobile
                    ? "rounded-none h-[107vh] pt-12"
                    : "bg-secondary/30 border w-96 max-h-[95vh] absolute-div-center shadow-xl overflow-y-auto"
            )}
        >
            <div className="flex flex-col gap-2 justify-center items-start max-w-[100%]">
                <div className="mx-auto">
                    <AlbumCover
                        id={text}
                        newAlbumPage={true}
                        albumCover={image || "/song-files/covers/yandhi.jpg"}
                        imageSize={360}
                    />
                </div>
                <div className="flex justify-between items-center relative w-full mt-3">
                    <div
                        className={cn(
                            isMobile ? "w-[93.5vw]" : "w-full max-w-[85%]"
                        )}
                    >
                        <div className="w-full flex flex-col">
                            <AutoMarquee
                                text={text}
                                className="font-bold text-2xl"
                                number={0}
                            />
                            <AutoMarquee
                                text={subtext}
                                className="text-muted-foreground/80"
                                number={2}
                            />
                        </div>
                    </div>
                    {!isMobile ? (
                        <PopoverMenu
                            showExplanation={showExplanation}
                            setShowExplanation={setShowExplanation}
                            backgroundLore={backgroundLore}
                            linkToGenius={linkToGenius}
                            lyrics={lyrics}
                            source={songVal}
                            text={text}
                        />
                    ) : (
                        <DrawerMenu
                            showExplanation={showExplanation}
                            setShowExplanation={setShowExplanation}
                            backgroundLore={backgroundLore}
                            linkToGenius={linkToGenius}
                            lyrics={lyrics}
                            songRef={songRef}
                            source={songVal}
                            text={text}
                        />
                    )}
                </div>
                <div className="flex flex-col justify-center items-center pt-4 gap-4 w-full">
                    <PlayerSongProgress
                        isPlaying={isPlaying}
                        songRef={songRef}
                        songVal={songVal}
                    />
                    <div className="flex justify-between w-full items-center gap-2 mt-2">
                        <PlayerControls
                            isMobile={isMobile}
                            isPlaying={isPlaying}
                            repeat={repeat}
                            setIsPlaying={setIsPlaying}
                            setRepeat={setRepeat}
                            songRef={songRef}
                            songVal={songVal}
                        />
                    </div>
                </div>
            </div>
            <div className={cn("flex justify-center items-end w-full pt-8")}>
                <div className="w-full flex justify-center items-center gap-2">
                    <Button
                        onClick={() => {
                            songRef.current && muteSong(songRef);
                        }}
                        variant="outline"
                        className="rounded-full bg-transparent px-4"
                        size="icon"
                        disabled={!songRef.current}
                    >
                        <VolumeIcon
                            size="18"
                            songRef={songRef}
                            volumeVal={volumeVal || 100}
                        />
                    </Button>
                    <VolumeSlider
                        className="[&>:last-child>span]:bg-primary [&>:last-child>span]:border-transparent [&>:first-child>span]:opacity-70"
                        value={[volumeVal]}
                        onValueChange={setVolumeVal}
                    />
                    <div className="text-foreground text-sm leading-4 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                        {volumeVal}%
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;
