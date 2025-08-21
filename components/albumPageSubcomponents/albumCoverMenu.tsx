import { useIsMobile } from "@/hooks/use-mobile";
import { useRef, useState } from "react";
import { useClickAway, useMedia } from "react-use";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerFooter } from "../ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { X, ArrowLeftIcon, ArrowRightIcon, Disc } from "lucide-react";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import AlbumCover from "./albumCover";
import Image from 'next/image'
import { toast } from "sonner";

export const AlbumCoverDialog = (props: { albumCover: string, albumCoverInfo: string[], albumCoverType: number, setAlbumCoverType: any, id: string, newAlbumPage: boolean, albumName: string }) => {
    const [dialogOpened, setDialogOpened] = useState(false);
    const isMobile = useIsMobile();
    const [displayAlbumCover, setDisplayAlbumCover] = useState(false);
    const isWideEnough = useMedia('(min-width: 1024px)', true);
    const reallyBigScreen = useMedia('(min-width: 1700px)', true);
    const albumCoverSize = isWideEnough ? 450 : 350;
    const textRef = useRef<HTMLDivElement>(null);
    const emblaRef = useRef<any>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useClickAway(overlayRef, () => {
        isMobile && setDisplayAlbumCover(false);
    })

    const MainContent = () => {
        const [current, setCurrent] = useState(0);

        return (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <Carousel
                    opts={{
                        align: "center",
                        loop: true,
                        startIndex: props.albumCoverType - 2
                    }}
                    className="max-w-full md:max-w-[50%] rounded-2xl flex flex-col gap-3"
                    setApi={(api) => {
                        if (!api) return;

                        emblaRef.current = api;

                        setCurrent(api.selectedScrollSnap());

                        api.on("select", () => {
                            setCurrent(api.selectedScrollSnap());
                        });
                    }}
                >
                    <div className="relative flex overflow-hidden rounded-2xl shadow-xl bg-background">
                        <CarouselContent className="rounded-2xl">
                            {Array.from({ length: props.albumCoverInfo.length }).map((_, index) => (
                                <CarouselItem key={index}>
                                    <Image
                                        src={`/song-files/covers/${props.albumCoverInfo[index]}.jpg`}
                                        alt={`album cover`}
                                        width={albumCoverSize}
                                        height={albumCoverSize}
                                        className="w-full h-full flex-shrink-0 snap-center rounded-2xl"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-16 flex items-end justify-center rounded-b-2xl p-2 -order-last md:order-last bg-gradient-to-t from-black/60 to-transparent">
                            <div className="flex justify-center gap-1 opacity-80">
                                {Array.from({ length: props.albumCoverInfo.length }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            emblaRef.current?.scrollTo(index);
                                            setCurrent(index);
                                        }}
                                        className={cn("size-4 rounded-full transition-all duration-500 backdrop-blur-md", current === index ? "bg-primary" : "bg-muted/40")}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </Carousel>
                <div className={cn("flex flex-col gap-2", !isMobile ? "max-w-[50%] max-h-80 mt-1" : "max-w-full max-h-full mt-2", reallyBigScreen && "!max-w-96")}>
                    <p className="text-2xl font-semibold leading-none tracking-tight text-center md:text-left">{props.albumName}'s alternative covers</p>
                    <p className="text-md text-muted-foreground text-center md:text-left" ref={textRef}>Check these other album covers that were made for this album but were scrapped.</p>
                    <div className="w-full h-0.5 bg-secondary rounded-full" />
                    <ScrollArea className="w-full max-h-80 overflow-auto leading-6 text-base text-md text-muted-foreground/60">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                    </ScrollArea>
                </div>
            </div >
        )
    }

    const SelectButtons = (props: { isMobile: boolean, setAlbumCoverType: any }) => {
        const ApplyButton = () => {
            return (
                <Button
                    className={cn("rounded-full py-5 w-full", isMobile ? "w-full" : "w-[60%]")}
                    onClick={() => {
                        toast.success("Applied album cover!");

                        props.setAlbumCoverType(emblaRef.current?.selectedScrollSnap());

                        // location.reload();
                        setDialogOpened(false);
                    }}
                >
                    Apply
                </Button>
            )
        }

        return (
            <>
                <Button
                    className="rounded-full py-5 min-w-9"
                    variant="secondary"
                    onClick={() => emblaRef.current?.scrollPrev()}
                >
                    <ArrowLeftIcon />
                </Button>
                <ApplyButton />
                <Button
                    className="rounded-full py-5 min-w-9"
                    variant="secondary"
                    onClick={() => emblaRef.current?.scrollNext()}>
                    <ArrowRightIcon />
                </Button>
            </>
        )
    }

    return (
        <>
            <div className="group relative size-full overflow-hidden">
                <div
                    className={cn(
                        "absolute inset-0 opacity-0 bg-black/60 transition-opacity backdrop-blur-sm duration-500 z-20 rounded-xl",
                        displayAlbumCover ? "opacity-100" : "opacity-0",
                        !isMobile && "translate-y-4"
                    )}
                    ref={overlayRef}
                    onMouseOver={() => !isMobile && setDisplayAlbumCover(true)}
                    onMouseLeave={() => !isMobile && setDisplayAlbumCover(false)}
                    onClick={() => {
                        if (isMobile) {
                            setDisplayAlbumCover(!displayAlbumCover);
                            setTimeout(() => setDisplayAlbumCover(false), 2500);
                        }
                    }}
                >
                    <Button
                        className="absolute-div-center rounded-full py-5"
                        onClick={(e) => {
                            displayAlbumCover && setDialogOpened(true);
                        }}
                        variant="link"
                    >
                        <Disc />
                        Show all covers
                    </Button>
                </div>
                <AlbumCover id={props.id} newAlbumPage={props.newAlbumPage} albumCover={props.albumCover} />
            </div>

            {isMobile ?
                <Drawer open={dialogOpened} onOpenChange={setDialogOpened} dismissible={false}>
                    <DrawerContent className="h-full max-h-full rounded-t-none" showGrabThing={false}>
                        <ScrollArea className="size-full">
                            <div className="px-6 py-6 pt-14">
                                <MainContent />
                            </div>
                        </ScrollArea>
                        <Button
                            className="min-w-9 absolute z-20 right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-secondary/50 hover:bg-secondary p-1.5 rounded-full"
                            onClick={() => setDialogOpened(false)}
                        >
                            <X className="min-h-4 min-w-4 rounded-full text-primary" />
                        </Button>
                        <DrawerFooter className="border-t-2">
                            <div className="flex gap-4 items-center justify-center">
                                <SelectButtons isMobile={false} setAlbumCoverType={props.setAlbumCoverType} />
                            </div>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
                :
                <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                    </DialogHeader>
                    <DialogContent className={cn("lg:max-w-[70%] md:max-w-[80%] !rounded-3xl p-6", reallyBigScreen && "!max-w-[56rem]")} dialogCloseButton={false}>
                        <Button
                            className="min-w-9 absolute z-20 right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-secondary/50 hover:bg-secondary p-1 rounded-full"
                            onClick={() => setDialogOpened(false)}
                        >
                            <X className="min-h-4 min-w-4 rounded-full text-primary" />
                        </Button>
                        <MainContent />
                        <DialogFooter className="w-full">
                            <div className="flex pt-3 gap-4 items-center justify-center w-full">
                                <SelectButtons isMobile={false} setAlbumCoverType={props.setAlbumCoverType} />
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
        </>
    )
}