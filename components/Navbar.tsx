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
import SettingsComponent from "./settings/settingsComponent"
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer"

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
    const isMobile = useIsMobile();

    return (
        <>
            <div className={cn('flex place-content-between w-full py-1 pb-3 bg-background transition-all sticky', className)}>
                <div className="items-center flex gap-2">
                    {navigationStuff.map((item, index) => (
                        <Link href={item.link} key={index}>
                            <Button variant='ghost' size={`${!isMobile ? 'default' : 'icon'}`} className={cn('items-center rounded-full transition-all', pathName === item.link ? 'bg-secondary hover:bg-secondary' : "hover:bg-primary-foreground")}>
                                {item.component}
                                {!isMobile ? String(item.name) : String('')}
                            </Button>
                        </Link>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Link href="/settings" aria-label="Settings page">
                        <Button className="rounded-full p-5" variant='outline' size="icon">
                            <Settings />
                        </Button>
                    </Link>
                    <a href="https://github.com/guizinhomartinez/unYeleased" target="_blank" aria-label="Source code of the project">
                        <Button variant='default' className="rounded-full p-5">
                            <Github className="-translate-x-1" />
                            Source
                        </Button>
                    </a>
                </div>
            </div>
            <Separator orientation="horizontal" className="h-[2px] rounded-full bg-muted/80" />
        </>
    )
}