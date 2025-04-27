import Link from "next/link";
import { Toaster } from "./ui/sonner";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

export default function BasicPageStuff({ albumPageStyle }: { albumPageStyle?: boolean }) {
    return (
        <>
            <Toaster position="top-center" className='toaster group' toastOptions={{ className: "group-[.toaster]:rounded-xl group-[.toaster]:bg-primary-foreground" }} />
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
                <div className='absolute left-4 md:left-5 top-2 md:top-4'>
                    <Link href="/">
                        <Button className="rounded-full" size='icon' variant='ghost'>
                            <ChevronLeft />
                        </Button>
                    </Link>
                </div>
            }

        </>
    )
}