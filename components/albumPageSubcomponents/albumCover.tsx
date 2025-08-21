import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import Image from 'next/image';
import { cn } from "@/lib/utils";

export default function AlbumCover({ id, newAlbumPage, albumCover }: { id: string, newAlbumPage: boolean, albumCover:string }) {
    const [loaded, setLoaded] = useState(false);
    const isMobile = useIsMobile();
    const size = !newAlbumPage ? (isMobile ? 280 : 260) : (isMobile ? 320 : 260);

    return (
        <div className={cn("relative", !loaded && "mt-4")}>
            {!loaded && (
                <Skeleton
                    className="absolute top-0 left-0 rounded-xl aspect-square"
                    style={{ width: 250, height: 250 }}
                />
            )}
            <Image
                src={albumCover}
                alt={id}
                width={size}
                height={size}
                priority={true}
                className={cn('rounded-xl transition-opacity duration-300 aspect-square', !newAlbumPage && "outline outline-primary/10", loaded ? 'opacity-100 md:mt-4' : 'opacity-0')}
                onLoad={() => setLoaded(true)}
            />
        </div>
    )
}