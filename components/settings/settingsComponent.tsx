"use client"

import { ArrowLeft, Brush, Home, KeyRoundIcon, Menu, Settings2Icon, Sidebar } from "lucide-react"
import { Button } from "../ui/button";
import Link from "next/link";
import { TutorialSection } from "./subComponents/tutorialSection";
import { UISection } from "./subComponents/uiSections";
import { Password } from "./subComponents/passwordSection";
import { useLockBodyScroll, useMedia } from "react-use";
import React, { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Label } from "../ui/label";

type HeadersInterface = {
    title: string;
    subtext: string;
    id: string;
}[];

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

    const mainTitle: HeadersInterface = [
        {
            title: "Appearence",
            subtext: "Change how some aspects of the UI look.",
            id: "appearence"
        },
        {
            title: "Tweaks",
            subtext: "Change more advanced stuff.",
            id: "tweaks"
        },
        {
            title: "Password",
            subtext: "Here you can type a secret code to access a hidden song.",
            id: "password"
        }
    ]

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

    const handleKeyDown = useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            switch (e.key) {
                case "b":
                    setHideSidebar(!hideSidebar)
                    e.preventDefault();
                    break;
            }
        };

        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    })

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
        <div className={cn("flex w-dvw h-dvh", !isWideEnough && "flex-col")}>
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
                <div className={cn("sticky top-0 left-0 w-full flex gap-2 items-center overflow-hidden", !isWideEnough ? "justify-between px-4 py-3 w-full" : "border-b px-4 py-2")} onKeyDown={(e) => handleKeyDown}>
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
                <div className="flex flex-col gap-2">
                    {mainTitle.map((element, index) => (
                        (element.id === currentTab) && (
                            <div className="flex flex-col mb-3 text-center" key={index}>
                                <p className="text-3xl font-semibold">{element.title}</p>
                                <p className="text-sm text-primary/50">{element.subtext}</p>
                            </div>
                        )
                    ))}
                    {appearenceTab && <UISection />}
                    {tweaksTab && <TutorialSection />}
                    {passwordTab && <Password />}
                </div>
            </div>
        </div>
    )
}

export const WrapperComponent = (props: { children: React.ReactNode, text: string, id: number }) => {
    return (
        <div className="flex justify-between items-center gap-4 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
            <Label className="text-base text-muted-foreground" htmlFor={`checkbox-element-${props.id}`}>{props.text}</Label>
            {props.children}
        </div>
    )
}