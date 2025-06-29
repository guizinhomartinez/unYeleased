import { AlbumExplanationInterface } from '@/lib/interfaces';
import { Drawer as Drawer2 } from 'vaul';
import { Button } from '../ui/button';
import { BookOpenText, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { AlbumExplanation } from '../albumExplanation';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';

export function DesktopAlbumExplanation({ setShowExplanation, showExplanation, fullscreen, setFullscreen, id, variant }: AlbumExplanationInterface) {
    return (
        <Drawer2.Root direction="right">
            <Drawer2.Trigger asChild>
                <Button variant='outline' className={cn('rounded-full h-12', variant === 1 && "w-48")} size={variant === 1 ? 'icon' : 'default'} onClick={() => setShowExplanation(!showExplanation)} title="Album explanation">
                    <BookOpenText />
                    {variant === 1 && "Album Explanation"}
                </Button>
            </Drawer2.Trigger>
            <Drawer2.Portal>
                <Drawer2.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer2.Content
                    className={cn("fixed right-4 top-4 bottom-4 outline-none transition-all duration-300 ease-in-out", fullscreen ? "max-w-[97.5vw]" : "max-w-[35%]")}
                    // The gap between the edge of the screen and the drawer2 is 8px in this case.
                    style={{ '--initial-transform': 'calc(100% + 24px)' } as React.CSSProperties}
                >
                    <div className="mt-4 h-1 w-12 rounded-full bg-muted-foreground absolute rotate-90 top-1/2 -translate-y-1/2 -left-[1.1em] cursor-grab group-active:cursor-grabbing" />
                    <div className="bg-primary-foreground size-full grow flex flex-col rounded-[16px]">
                        <div className="p-4 overflow-y-auto h-full">
                            <div className='pt-2'>
                                <div className='flex items-center justify-between mx-auto gap-2'>
                                    <div className='w-2' />
                                    <p className='text-3xl font-bold text-center'>Album Explanation</p>
                                    <div className='cursor-pointer mr-2' onClick={(e) => setFullscreen(!fullscreen)}>
                                        {!fullscreen ? <Maximize2 /> : <Minimize2 />}
                                    </div>
                                </div>
                                <Separator orientation="horizontal" className="h-1 rounded-full bg-muted mt-1 mb-2" />
                            </div>
                            <AlbumExplanation id={id} />
                        </div>
                    </div>
                </Drawer2.Content>
            </Drawer2.Portal>
        </Drawer2.Root>
    )
}

export function MobileAlbumExplanation(props: AlbumExplanationInterface) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant='outline' className={cn('rounded-full h-12', props.variant === 1 && "w-48")} size={props.variant === 1 ? 'icon' : 'default'} onClick={() => props.setShowExplanation(!props.showExplanation)}>
                    <BookOpenText />
                    {props.variant === 1 && "Album Explanation"}
                </Button>
            </DrawerTrigger>
            <DrawerContent className={cn('h-[100vh] max-h-[100vh] items-center rounded-t-3xl')}>
                <div className='overflow-y-auto size-full'>
                    <AlbumExplanation id={props.id} />
                </div>
            </DrawerContent>
        </Drawer>
    )
}