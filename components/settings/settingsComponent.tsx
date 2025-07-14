"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ChevronLeft } from "lucide-react"
import { Button } from "../ui/button";
import Link from "next/link";
import { TutorialSection } from "./subComponents/tutorialSection";
import { UISection } from "./subComponents/uiSections";
import { Password } from "./subComponents/passwordSection";

export default function SettingsComponent() {

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