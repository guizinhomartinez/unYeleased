"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Laptop2Icon, LoaderCircleIcon, Moon, PaintbrushVertical, Sun, AlignLeft, AlignCenter, AlignRight, ChevronLeft } from "lucide-react"
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Label } from "../ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { TutorialSection } from "./subComponents/tutorialSection";
import { UISection } from "./subComponents/uiSections";
import { Password } from "./subComponents/passwordSection";

export default function SettingsComponent({ mobile }: { mobile: boolean }) {
    return (
        <div>
            <div className="flex items-center justify-between rounded-full mb-4 relative">
                <Link href="/">
                    <Button className="rounded-full" size='icon' variant='ghost'>
                        <ChevronLeft />
                    </Button>
                </Link>
                <p className="text-2xl font-bold absolute top-1 left-1/2 -translate-x-1/2">Settings</p>
                <div />
            </div>
            <Tabs defaultValue="appearence" className="w-full gap-4 overflow-hidden">
                <TabsList className="w-full gap-1 rounded-lg *:rounded-lg *:w-full bg-primary-foreground/50 py-1 overflow-x-auto">
                    <TabsTrigger
                        value="appearence"
                        className="gap-2 data-[state=active]:bg-secondary hover:bg-secondary/50 data-[state=active]:hover:bg-secondary"
                    >
                        Appearence
                    </TabsTrigger>
                    <TabsTrigger
                        value="tweaks"
                        className="gap-2 data-[state=active]:bg-secondary hover:bg-secondary/50 data-[state=active]:hover:bg-secondary"
                    >
                        Tweaks
                    </TabsTrigger>
                    <TabsTrigger
                        value="password"
                        className="gap-2 data-[state=active]:bg-secondary hover:bg-secondary/50 data-[state=active]:hover:bg-secondary"
                    >
                        Password
                    </TabsTrigger>
                </TabsList>
                <div className="rounded-2xl bg-primary-foreground/50 p-4">
                    <TabsContent value="appearence"><UISection /></TabsContent>
                    <TabsContent value="tweaks"><TutorialSection /></TabsContent>
                    <TabsContent value="password"><Password /></TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

const DropDown = () => {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="left" className="rounded-xl [&>div]:rounded-lg [&>div]:transition-colors [&>div]:cursor-pointer">
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