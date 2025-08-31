"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ArrowLeft, Brush, ChevronLeft, Home, KeyRoundIcon, Menu, Settings2Icon, Sidebar } from "lucide-react"
import { Button } from "../ui/button";
import Link from "next/link";
import { TutorialSection } from "./subComponents/tutorialSection";
import { UISection } from "./subComponents/uiSections";
import { Password } from "./subComponents/passwordSection";
import { useLockBodyScroll, useMedia } from "react-use";
import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export default function SettingsComponent() {
    return (
        <NewSettingsPage />
    )
}

const NewSettingsPage = () => {
    const [openedSheet, setOpenedSheet] = useState(false);
    const [currentTab, setCurrentTab] = useQueryState("tab", { defaultValue: "appearence" });
    const isWideEnough = useMedia('(min-width: 1024px)', true);
    const [hideSidebar, setHideSidebar] = useState(false);
    const [showBackArrow, setShowBackArrow] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [changeNavbarStyle, setChangeNavbarStyle] = useState(false);


    const appearenceTab = (currentTab === "appearence");
    const tweaksTab = (currentTab === "tweaks");
    const passwordTab = (currentTab === "password");

    useLockBodyScroll(isWideEnough);

    useEffect(() => {
        !isWideEnough && setHideSidebar(false);
    }, [hideSidebar, isWideEnough]);

    useEffect(() => window.addEventListener("scroll", () => setChangeNavbarStyle(window.scrollY >= 10)));

    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const maxScroll = 200; // scroll distance to reach full animation
            const progress = Math.min(window.scrollY / maxScroll, 1);
            setScrollProgress(progress);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const Options = () => {
        return (
            <>
                <Button
                    className={cn(
                        "rounded-[0.55rem] py-4 transition-all duration-500 overflow-hidden justify-start",
                        !hideSidebar ? "w-full" : "px-2.5 w-9 h-9",
                        appearenceTab ? "bg-primary-foreground" : "bg-transparent"
                    )}
                    variant='secondary'
                    onClick={() => setCurrentTab("appearence")}
                >
                    <Brush className="shrink-0" />
                    <span className={cn("ml-2 whitespace-nowrap transition-opacity duration-300", hideSidebar && "opacity-0")}>
                        Appearence
                    </span>
                </Button>

                <Button
                    className={cn(
                        "rounded-[0.55rem] py-4 transition-all duration-500 overflow-hidden justify-start",
                        !hideSidebar ? "w-full" : "px-2.5 w-9 h-9",
                        tweaksTab ? "bg-primary-foreground" : "bg-transparent"
                    )}
                    variant='secondary'
                    onClick={() => setCurrentTab("tweaks")}
                >
                    <Settings2Icon className="shrink-0" />
                    <span className={cn("ml-2 whitespace-nowrap transition-opacity duration-300", hideSidebar && "opacity-0")}>
                        Tweaks
                    </span>
                </Button>

                <Button
                    className={cn(
                        "rounded-[0.55rem] py-4 transition-all duration-500 overflow-hidden justify-start",
                        !hideSidebar ? "w-full" : "px-2.5 max-w-9 max-h-9",
                        passwordTab ? "bg-primary-foreground" : "bg-transparent"
                    )}
                    variant='secondary'
                    onClick={() => setCurrentTab("password")}
                >
                    <KeyRoundIcon className="shrink-0" />
                    <span className={cn("ml-2 whitespace-nowrap transition-opacity duration-300", hideSidebar && "opacity-0")}>
                        Password
                    </span>
                </Button>
            </>
        )
    }

    const pagePercentage = Math.min(scrollProgress / 0.5, 1);

    return (
        <div className={cn("flex w-dvw h-dvh", !isWideEnough && "flex-col bg-primary-foreground/80")}>
            <div
                className={cn(
                    "relative w-full transition-all duration-500",
                    isWideEnough ? "h-full bg-background" : "sticky top-0 bg-background/50 !max-w-full z-50 backdrop-blur-md",
                    !hideSidebar ? "max-w-[20vw]" : "max-w-[5vw]",
                    !isWideEnough && (changeNavbarStyle ? "left-[3vw] !max-w-[94vw]" : "!top-0 !left-0 !max-w-full border-b"))}
                style={{
                    top: pagePercentage * 15,
                    borderRadius: !isWideEnough ? (changeNavbarStyle ? pagePercentage * 24 : 0) : 0
                }}
            >
                <div className={cn("sticky top-0 left-0 w-full flex gap-2 items-center overflow-hidden", !isWideEnough ? "justify-between px-4 py-3 w-full" : "border-b px-4 py-2")}>
                    {hideSidebar ?
                        <Link href='/'>
                            <Button variant='ghost' size='icon' className={cn("rounded-[0.55rem]", !isWideEnough && "hidden")} onMouseOver={() => setShowBackArrow(true)} onMouseLeave={() => setShowBackArrow(false)}>
                                {!showBackArrow ? <Home /> : <ArrowLeft />}
                            </Button>
                        </Link>
                        :
                        <>
                            <Link href='/'>
                                <Button variant='ghost' size='icon' className={cn("rounded-[0.55rem] transition-opacity duration-500", hideSidebar && "opacity-0")}>
                                    <ArrowLeft />
                                </Button>
                            </Link>
                            <p className={cn("text-2xl font-semibold leading-none tracking-tight transition-opacity duration-500", hideSidebar && "opacity-0")}>Settings</p>
                            {!isWideEnough &&
                                <Sheet open={openedSheet} onOpenChange={setOpenedSheet}>
                                    <SheetTrigger asChild>
                                        <Button variant='ghost' size='icon' className={cn("rounded-[0.55rem] transition-opacity duration-500", hideSidebar && "opacity-0")}>
                                            <Menu />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent className="flex flex-col gap-2 pt-12" onClick={() => setOpenedSheet(false)}>
                                        <Options />
                                    </SheetContent>
                                </Sheet>
                            }
                        </>
                    }
                </div>
                <div className={cn("flex flex-col gap-2 items-start justify-center p-4 *:transition-all *:duration-500", !isWideEnough && "hidden")}>
                    <Options />
                </div>
                <div className={cn("fixed bottom-0 left-0 p-4", !isWideEnough && "hidden")}>
                    <TooltipProvider>
                        <Tooltip open={showTooltip}>
                            <TooltipTrigger asChild>
                                <div className="">
                                    <Button variant='ghost' size='icon' className="rounded-[0.55rem]" onClick={() => setHideSidebar(!hideSidebar)} onMouseLeave={() => setTimeout(() => setShowTooltip(false), 150)} onMouseOver={() => setTimeout(() => setShowTooltip(true), 250)}>
                                        <Sidebar />
                                    </Button>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="rounded-2xl" secondaryColor>
                                <p>Hide sidebar</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <div className={cn("bg-primary-foreground/50 w-full p-4 md:p-8", isWideEnough ? "border-l overflow-y-auto rounded-tl-xl" : "")}>
                {appearenceTab && <UISection />}
                {tweaksTab && <TutorialSection />}
                {passwordTab && <Password />}
            </div>
        </div>
    )
}

const OldSettingsPage = () => {
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
                <div className="rounded-2xl border bg-primary-foreground/50 p-4">
                    <TabsContent value="appearence"><UISection /></TabsContent>
                    <TabsContent value="tweaks"><TutorialSection /></TabsContent>
                    <TabsContent value="password"><Password /></TabsContent>
                </div>
            </Tabs>
        </div>
    )
}