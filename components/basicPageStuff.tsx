import Link from "next/link";
import { Toaster } from "./ui/sonner";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function BasicPageStuff({ albumPageStyle, settingsPage, goToSettings }: { albumPageStyle?: boolean, settingsPage?: boolean, goToSettings?: boolean }) {
    return (
        <>
            {!albumPageStyle ?
                <div className="size-full relative">
                    <div className='absolute left-4 md:left-5 top-2 md:top-4'>
                        <Link href="/">
                            <Button className="rounded-full" size='icon' variant='ghost'>
                                <ChevronLeft />
                            </Button>
                        </Link>
                    </div>
                </div>
                :
                <div className={cn('absolute left-4 md:left-5', settingsPage ? (!useIsMobile() ? 'top-[1.4em]' : 'top-[1.4em] left-6') : 'top-2 md:top-4')}>
                    <Link href={"/" + !goToSettings ? "settings" : ""}>
                        <Button className="rounded-full" size='icon' variant='ghost'>
                            <ChevronLeft />
                        </Button>
                    </Link>
                </div>
            }

        </>
    )
}