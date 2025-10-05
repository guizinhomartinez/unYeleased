"use client";

import { TutorialSection } from "./subComponents/tutorialSection";
import { UISection } from "./subComponents/uiSections";
import { Password } from "./subComponents/passwordSection";
import { useLockBodyScroll, useMedia } from "react-use";
import React, { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import SidebarComponent from "./sidebar";
import SettingsContent from "./settingsContent";

export type HeadersInterface = {
    title: string;
    subtext: string;
    id: string;
}[];

export default function SettingsComponent() {
    const [currentTab, setCurrentTab] = useQueryState("tab", {
        defaultValue: "appearence",
    });
    const isWideEnough = useMedia("(min-width: 1024px)", true);
    const [hideSidebar, setHideSidebar] = useState(false);

    const appearenceTab = currentTab === "appearence";
    const tweaksTab = currentTab === "tweaks";
    const passwordTab = currentTab === "password";

    const mainTitle: HeadersInterface = [
        {
            title: "Appearence",
            subtext: "Change how some aspects of the UI look.",
            id: "appearence",
        },
        {
            title: "Tweaks",
            subtext: "Change more advanced stuff.",
            id: "tweaks",
        },
        {
            title: "Password",
            subtext: "Here you can type a secret code to access a hidden song.",
            id: "password",
        },
    ];

    useEffect(() => {
        if (window.innerWidth < 1024 && hideSidebar) {
            setHideSidebar(false);
        }
    }, [hideSidebar]);

    return (
        <div className={cn("flex w-dvw h-dvh flex-col lg:flex-row")}>
            <SidebarComponent
                {...{
                    appearenceTab,
                    hideSidebar,
                    isWideEnough,
                    passwordTab,
                    tweaksTab,
                }}
                setCurrentTabAction={setCurrentTab}
                setHideSidebarAction={setHideSidebar}
            />
            <SettingsContent
                {...{
                    appearenceTab,
                    currentTab,
                    isWideEnough,
                    mainTitle,
                    passwordTab,
                    tweaksTab,
                }}
            />
        </div>
    );
}
