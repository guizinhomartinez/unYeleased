import { Github, Home, Info, Settings } from "lucide-react"
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
import NavbarLeftSection from "./ui/navbarLeftSection"

export default function Navbar({ className }: { className?: string }) {
    return (
        <>
            <div className={cn('flex place-content-between w-full py-1 pb-3 bg-background transition-all sticky', className)}>
                <NavbarLeftSection />
                <div className="flex gap-2">
                    <Link href="/settings" aria-label="Settings page">
                        <Button className="rounded-full p-5" variant='outline' size="icon">
                            <Settings />
                        </Button>
                    </Link>
                    <Link href="https://unyeleased-bankan-board.vercel.app" target="_blank" aria-label="Roadmap of the project">
                        <Button variant='secondary' className="rounded-full py-5">
                            <Info />
                            Roadmap
                        </Button>
                    </Link>
                    <Link href="https://github.com/guizinhomartinez/unYeleased" target="_blank" aria-label="Source code of the project">
                        <Button variant='default' className="rounded-full py-5">
                            <Github />
                            Source
                        </Button>
                    </Link>
                </div>
            </div>
            <Separator orientation="horizontal" className="h-[2px] rounded-full bg-muted/80" />
        </>
    )
}