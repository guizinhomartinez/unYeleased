'use client'

import { Github, Home, Info, Moon, PlusSquare, Sun } from "lucide-react"
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
import { useEffect, useRef, useState } from "react"

export default function Navbar({ activeItem, className }: { activeItem: number, className?:string }) {
    const [mediumScreen, setMediumScreen] = useState(false);

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
            <div className={`flex place-content-between w-full py-1 pb-3 bg-background transition-all ${className}`}>
                <div className="items-center flex gap-2">
                    <Link href='/'>
                        <Button variant='outline' size={`${!mediumScreen ? 'default' : 'icon'}`} className={`items-center rounded-full transition-all ${activeItem === 0 && 'active-button'}`}>
                            <Home />
                            {!mediumScreen ? String('Home') : String('')}
                        </Button>
                    </Link>
                    {/* <Separator orientation="vertical" className="h-[60%] mx-1"/> */}
                    <Link href='/about'>
                        <Button variant='outline' size={`${!mediumScreen ? 'default' : 'icon'}`} className={`items-center rounded-full transition-all ${activeItem === 1 && 'active-button'}`}>
                            <Info />
                            {!mediumScreen ? String('About') : String('')}
                        </Button>
                    </Link>
                    <Link href='/about/create-album'>
                        <Button variant='outline' size={`${!mediumScreen ? 'default' : 'icon'}`} className={`items-center rounded-full transition-all ${activeItem === 2 && 'active-button'}`}>
                            <PlusSquare />
                            {!mediumScreen ? String('Custom albums') : String('')}
                        </Button>
                    </Link>
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
                {/* <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}