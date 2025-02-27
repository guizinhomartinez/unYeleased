'use client'

import { Github, HardHat, Home, Info, Moon, PlusCircle, PlusSquare, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Separator } from "./ui/separator"
import React, { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigationStuff = [
    {
        name: "Home",
        component: <Home />,
        link: "/"
    },
    {
        name: "About",
        component: <Info />,
        link: "/about"
    },
    {
        name: "Create Albums",
        component: <PlusCircle />,
        link: "/about/create-album"
    },
    {
        name: "Testing Home Page",
        component: <HardHat />,
        link: "/testing"
    }
]

export default function Navbar({ className }: { className?: string }) {
    const [mediumScreen, setMediumScreen] = useState(false);
    const pathName = usePathname();

    useEffect(() => {
        const isScreenSmall = () => {
            if (window.innerWidth < 768)
                setMediumScreen(true)
            else
                setMediumScreen(false)
        }
        isScreenSmall()

        window.addEventListener('resize', isScreenSmall)

        return () => (
            window.addEventListener('resize', isScreenSmall)
        )
    })

    return (
        <>
            <div className={cn('flex place-content-between w-full py-1 pb-3 bg-background transition-all', className)}>
                <div className="items-center flex gap-2">
                    {navigationStuff.map((item, index) => (
                        <Link href={item.link} key={index}>
                            <Button variant='outline' size={`${!mediumScreen ? 'default' : 'icon'}`} className={cn('items-center rounded-full transition-all', pathName === item.link && 'active-button')}>
                                {item.component}
                                {!mediumScreen ? String(item.name) : String('')}
                            </Button>
                        </Link>
                    ))}
                </div>
                <div className="flex gap-2">
                    <DropDown />
                    <a href="https://github.com/guizinhomartinez/ye-unreleased-songs" target="_blank">
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

const DropDown = () => {
    const { setTheme } = useTheme()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}