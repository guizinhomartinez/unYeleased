"use client"

import { LoadingComponent } from "@/components/albumExplanation";
import SettingsComponent from "@/components/settings/settingsComponent";
import { Suspense } from "react";

export default function SettingsPage() {
    return (
        <Suspense fallback={<LoadingComponent />}>
            <SettingsComponent />
        </Suspense>
    )
}