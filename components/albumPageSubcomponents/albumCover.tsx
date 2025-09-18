import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function AlbumCover({
    id,
    newAlbumPage,
    albumCover,
    imageSize,
    className,
}: {
    id: string;
    newAlbumPage: boolean;
    albumCover: string | null;
    imageSize?: number;
    className?: string;
}) {
    const isMobile = useIsMobile();
    const size =
        imageSize !== undefined
            ? imageSize
            : !newAlbumPage
              ? isMobile
                  ? 280
                  : 260
              : isMobile
                ? 320
                : 260;

    return (
        <div className={cn("relative inline-block", className)}>
            <Image
                src={albumCover ?? ""}
                alt={id}
                width={size}
                height={size}
                priority={true}
                className={cn(
                    "rounded-xl aspect-square",
                    !newAlbumPage && "outline outline-primary/10"
                )}
            />
        </div>
    );
}
