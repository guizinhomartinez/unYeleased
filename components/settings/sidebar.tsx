"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { Dispatch, memo, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Home, Menu, Sidebar } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Dialog as DialogPrimitive, VisuallyHidden } from "radix-ui";
import Options from "./options";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import { useKeyPressEvent } from "react-use";

export const SidebarComponent = ({
    isWideEnough,
    hideSidebar,
    setHideSidebarAction,
    appearenceTab,
    tweaksTab,
    passwordTab,
    setCurrentTabAction,
}: {
    isWideEnough: boolean;
    hideSidebar: boolean;
    setHideSidebarAction: Dispatch<SetStateAction<boolean>>;
    appearenceTab: boolean;
    tweaksTab: boolean;
    passwordTab: boolean;
    setCurrentTabAction: Dispatch<SetStateAction<string>>;
}) => {
    const [openedSheet, setOpenedSheet] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useKeyPressEvent("b", () => {
        setHideSidebarAction(!hideSidebar);
    });

    return (
        <motion.div
            className={cn(
                "w-full transition-[max-width] duration-500",
                "fixed top-0 left-0 bg-background/50 max-w-full z-50 backdrop-blur-md lg:h-full lg:bg-background lg:relative",
                "lg:!top-0 lg:!rounded-none lg:!left-0 lg:!border-b-0",
                hideSidebar ? "lg:!max-w-[68px]" : "lg:!max-w-64"
            )}
        >
            <div className="sticky top-0 left-0 w-full flex gap-2 items-center overflow-hidden justify-between px-4 py-3 lg:py-2 lg:justify-start">
                {isWideEnough && (
                    <Link href="/">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "rounded-[0.55rem] transiiton-opacity duration-500",
                                !hideSidebar
                                    ? "size-0 opacity-0"
                                    : "min-size-9 opacity-1"
                            )}
                        >
                            <Home />
                        </Button>
                    </Link>
                )}
                <Link href="/">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "rounded-[0.55rem] transition-opacity duration-500",
                            hideSidebar && "opacity-0"
                        )}
                    >
                        <ArrowLeft />
                    </Button>
                </Link>
                <p
                    className={cn(
                        "text-2xl font-semibold leading-none tracking-tight transition-opacity duration-500",
                        hideSidebar && "opacity-0"
                    )}
                >
                    Settings
                </p>
                {!isWideEnough && (
                    <Sheet open={openedSheet} onOpenChange={setOpenedSheet}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "rounded-[0.55rem] transition-opacity duration-500",
                                    hideSidebar && "opacity-0"
                                )}
                            >
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            className="flex flex-col gap-2 pt-12"
                            onClick={() => setOpenedSheet(false)}
                        >
                            <DialogPrimitive.Title asChild>
                                <VisuallyHidden.Root>
                                    Settings sheet
                                </VisuallyHidden.Root>
                            </DialogPrimitive.Title>
                            <Options
                                {...{
                                    appearenceTab,
                                    hideSidebar,
                                    passwordTab,
                                    tweaksTab,
                                }}
                                setCurrentTab={setCurrentTabAction}
                            />
                        </SheetContent>
                    </Sheet>
                )}
            </div>
            <div className="flex-col *:mb-1 items-start justify-center p-4 hidden lg:flex">
                <Options
                    {...{
                        appearenceTab,
                        hideSidebar,
                        passwordTab,
                        tweaksTab,
                    }}
                    setCurrentTab={setCurrentTabAction}
                />
            </div>
            <div className="fixed bottom-0 left-0 p-4 hidden lg:block">
                <TooltipProvider>
                    <Tooltip open={showTooltip}>
                        <TooltipTrigger asChild>
                            <div className="">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-[0.55rem]"
                                    onClick={() =>
                                        setHideSidebarAction(!hideSidebar)
                                    }
                                    onMouseLeave={() =>
                                        setTimeout(
                                            () => setShowTooltip(false),
                                            150
                                        )
                                    }
                                    onMouseOver={() =>
                                        setTimeout(
                                            () => setShowTooltip(true),
                                            250
                                        )
                                    }
                                >
                                    <Sidebar />
                                </Button>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent
                            side="right"
                            className="rounded-2xl"
                            secondaryColor
                        >
                            <p>Hide sidebar</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </motion.div>
    );
};

export default memo(SidebarComponent);
