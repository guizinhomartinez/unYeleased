'use client'

import { Github, Home, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Separator } from "./ui/separator"
import React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile"
import SettingsPage from "./settingsPage"

const navigationStuff = [
    {
        name: "Home",
        component: <Home />,
        link: "/"
    },
    // {
    //     name: "About",
    //     component: <Info />,
    //     link: "/about"
    // },
    // {
    //     name: "Create Albums",
    //     component: <PlusCircle />,
    //     link: "/about/create-album"
    // },
    // {
    //     name: "Testing Homepage",
    //     component: <HardHat />,
    //     link: "/testing"
    // }
]

export default function Navbar({ className }: { className?: string }) {
    const pathName = usePathname();

    return (
        <>
            <div className={cn('flex place-content-between w-full py-1 pb-3 bg-background transition-all', className)}>
                <div className="items-center flex gap-2">
                    {navigationStuff.map((item, index) => (
                        <Link href={item.link} key={index}>
                            <Button variant='outline' size={`${!useIsMobile() ? 'default' : 'icon'}`} className={cn('items-center rounded-full transition-all', pathName === item.link && 'active-button')}>
                                {item.component}
                                {!useIsMobile() ? String(item.name) : String('')}
                            </Button>
                        </Link>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="rounded-full" variant='outline'>
                                <Settings />
                                Settings
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="h-max gap-0 m-0">
                            <SettingsPage />
                        </DialogContent>
                    </Dialog>
                    <a href="https://github.com/guizinhomartinez/unYeleased" target="_blank">
                        <Button variant='outline' className="rounded-full">
                            <Github />
                            Source
                        </Button>
                    </a>
                </div>
            </div>
            <Separator orientation="horizontal" className="h-[2px] rounded-full bg-muted/80" />
        </>
    )
}