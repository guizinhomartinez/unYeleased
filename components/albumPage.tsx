import Link from "next/link";
import { Button } from "./ui/button";
import { Dot, Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { SongControls } from "./songControls";
import BasicPageStuff from "./basicPageStuff";
import { AlbumPageInterface } from "@/lib/interfaces";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import {
    DesktopAlbumExplanation,
    MobileAlbumExplanation,
} from "./albumPageSubcomponents/albumExplanationWrappers";
import AlbumPageTracklist from "./albumPageSubcomponents/albumPageTracklist";
import AlbumPlayButton from "./albumPageSubcomponents/ui/albumPlayButton";
import AlbumCover from "./albumPageSubcomponents/albumCover";

export default function AlbumPage({
    albumName,
    albumCreator,
    id,
    isPlaying,
    showExplanation,
    setShowExplanation,
    fullscreen,
    setFullscreen,
    songs,
    searchQuery,
    setSearchQuery,
    playAlbum,
    appearBar,
    setAppearBar,
    currentSongIndex,
    handleClickEvent,
    year,
    songRef,
    playingSong,
    setIsPlaying,
    volumeVal,
    setVolumeVal,
    songCreator,
    handleSkipSong,
    repeatAlbum,
    setRepeatAlbum,
    credits,
    isLoading,
    isFullscreenMode,
    setIsFullscreenMode,
    showLyricsFullscreen,
    setShowLyricsFullscreen,
    shuffle,
    setShuffle,
}: AlbumPageInterface) {
    return (
        <div>
            <BasicPageStuff />
            <div className="flex flex-col gap-4 transition-all duration-300 md:flex-row">
                <div className="flex-1">
                    <div
                        className={`mt-4 flex w-full items-center justify-center gap-4 overflow-x-hidden border-b-2 border-b-primary-foreground p-4 pt-16 md:justify-normal md:p-8`}
                    >
                        <div className="flex flex-col items-center gap-5 md:flex-row">
                            <AlbumCover
                                id={id}
                                newAlbumPage={false}
                                albumCover={`/song-files/covers/${id.toLowerCase()}.jpg`}
                            />
                            <div className="flex flex-col gap-2">
                                <div className="text-center text-4xl font-semibold md:text-left">
                                    {albumName ||
                                        capitalizeFirstLetter(
                                            id.replace("-", " "),
                                        )}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="inline-flex items-center justify-center md:justify-normal">
                                        <div className="text-md whitespace-pre text-center text-primary/75 md:text-left md:text-xl">
                                            {albumCreator || (
                                                <Skeleton className="h-5 w-24" />
                                            )}
                                        </div>
                                        <Dot className="text-primary/75" />
                                        <div className="text-md text-center text-primary/75 md:text-left md:text-xl">
                                            {year || (
                                                <Skeleton className="h-6 w-16 translate-y-0.5" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="inline-flex items-center justify-center md:justify-normal">
                                        <div className="text-md whitespace-pre text-center text-primary/75 md:text-left md:text-xl">
                                            {songs.length || (
                                                <Skeleton className="inline-flex h-5 w-5 translate-y-1" />
                                            )}{" "}
                                            songs
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 flex justify-center gap-2 md:justify-normal">
                                    <AlbumPlayButton
                                        isPlaying={isPlaying}
                                        playAlbum={playAlbum}
                                        songRef={songRef}
                                    />
                                    {!useIsMobile() ? (
                                        <DesktopAlbumExplanation
                                            setShowExplanation={
                                                setShowExplanation
                                            }
                                            showExplanation={showExplanation}
                                            id={id}
                                            variant={1}
                                        />
                                    ) : (
                                        <MobileAlbumExplanation
                                            setShowExplanation={
                                                setShowExplanation
                                            }
                                            showExplanation={showExplanation}
                                            id={id}
                                            variant={1}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mx-4 mt-6 flex flex-col gap-2 rounded-xl border-2 border-secondary/50 bg-primary-foreground/25 p-2 text-sm text-primary/50 md:mx-8">
                        <div className="inline-flex grow items-center text-primary/50">
                            {credits.length > 0 ? (
                                <p>
                                    Credits to{" "}
                                    {Object.entries(
                                        credits.reduce(
                                            (acc, credit) => {
                                                const type = credit.type;
                                                const names = Array.isArray(
                                                    credit.name,
                                                )
                                                    ? credit.name
                                                    : [credit.name];
                                                const links = Array.isArray(
                                                    credit.originalLink,
                                                )
                                                    ? credit.originalLink
                                                    : [credit.originalLink];

                                                if (!acc[type]) acc[type] = [];
                                                names.forEach((name, i) => {
                                                    acc[type].push({
                                                        name,
                                                        link: links[i] ?? "#",
                                                    });
                                                });

                                                return acc;
                                            },
                                            {} as Record<
                                                string,
                                                { name: string; link: string }[]
                                            >,
                                        ),
                                    ).map(
                                        (
                                            [type, contributors],
                                            index,
                                            array,
                                        ) => (
                                            <span key={type}>
                                                {contributors.map(
                                                    (entry, i) => (
                                                        <span
                                                            key={`${type}-${i}`}
                                                        >
                                                            {entry.name}
                                                            {i ===
                                                            contributors.length -
                                                                2
                                                                ? " & "
                                                                : i <
                                                                    contributors.length -
                                                                        2
                                                                  ? ", "
                                                                  : ""}
                                                        </span>
                                                    ),
                                                )}{" "}
                                                for the {type}
                                                {index < array.length - 1
                                                    ? ", "
                                                    : ""}
                                            </span>
                                        ),
                                    )}
                                </p>
                            ) : (
                                <p>No credits available</p>
                            )}
                        </div>

                        {credits.length > 0 && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        className="w-fit rounded-xl"
                                        variant="secondary"
                                    >
                                        Original link
                                        {credits.some(
                                            (c) =>
                                                Array.isArray(c.name) &&
                                                c.name.length > 1,
                                        )
                                            ? "s"
                                            : ""}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Sources</DialogTitle>
                                    <DialogDescription>
                                        All sources used for this album
                                    </DialogDescription>
                                    {credits
                                        .flatMap((credit) => {
                                            const names = Array.isArray(
                                                credit.name,
                                            )
                                                ? credit.name
                                                : [credit.name];
                                            const links = Array.isArray(
                                                credit.originalLink,
                                            )
                                                ? credit.originalLink
                                                : [credit.originalLink];
                                            return names.map((name, i) => ({
                                                name,
                                                link: links[i] ?? "#",
                                            }));
                                        })
                                        .map((entry, i) => (
                                            <Link
                                                href={entry.link}
                                                key={i}
                                                target="_blank"
                                                className="-mb-1 w-full rounded-xl"
                                            >
                                                <Button
                                                    variant="secondary"
                                                    className="-mb-4 w-full rounded-xl"
                                                >
                                                    {entry.name}
                                                </Button>
                                            </Link>
                                        ))}
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    <div className="m-4 flex flex-col gap-4 md:m-8 md:mt-4">
                        <div className="relative flex items-center">
                            <Input
                                type="search"
                                className="rounded-xl border-2 border-secondary bg-primary-foreground/50 pl-[3em]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for your favorite song"
                            ></Input>
                            <div className="absolute left-3 cursor-pointer border-r-2 border-r-secondary py-2 pr-2">
                                <Search
                                    size={16}
                                    strokeWidth={2}
                                    className="text-muted-foreground/80"
                                />
                            </div>
                        </div>
                        <AlbumPageTracklist
                            appearBar={appearBar}
                            currentSongIndex={currentSongIndex}
                            handleClickEvent={handleClickEvent}
                            songs={songs}
                            newStyle={false}
                            playingSong={playingSong}
                            id={id}
                        />
                    </div>
                </div>
            </div>
            <div>
                <SongControls
                    songRef={songRef}
                    songVal={playingSong}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    volumeVal={volumeVal}
                    setVolumeVal={setVolumeVal}
                    image={`/song-files/covers/${id.toLowerCase()}.jpg`}
                    songCreator={songCreator}
                    handleSkipSong={handleSkipSong}
                    repeat={repeatAlbum}
                    setRepeat={setRepeatAlbum}
                    id={id}
                    albumName={albumName}
                    appearBar={appearBar}
                    setAppearBar={setAppearBar}
                    isLoading={isLoading}
                    isFullscreenMode={isFullscreenMode}
                    setIsFullscreenMode={setIsFullscreenMode}
                    showLyricsFullscreen={showLyricsFullscreen}
                    setShowLyricsFullscreen={setShowLyricsFullscreen}
                    shuffle={shuffle}
                    setShuffle={setShuffle}
                />
            </div>
        </div>
    );
}
