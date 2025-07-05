"use client"

import SettingsComponent from "@/components/settings/settingsComponent";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SettingsPage() {
    const isMobile = useIsMobile();
    return (
        <div className="m-2 md:m-4">
            <SettingsComponent mobile={isMobile} />
        </div>
    )
}