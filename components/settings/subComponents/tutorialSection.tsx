import { useEffect, useState } from "react";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { RotateCcw } from "lucide-react";
import { useLocalStorage } from "react-use";

export const TutorialSection = () => {
    const [tutorialNumber, setTutorialNumber] = useLocalStorage("tutorial-number", 0);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col mb-2 text-center">
                <p className="text-3xl font-semibold">Tweaks</p>
                <p className="text-sm text-primary/50">Change more advanced stuff.</p>
            </div>
            <div className="flex justify-between items-center gap-4 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
                <Label className="text-base text-muted-foreground">Reset tutorial</Label>
                <Button size="icon" variant='destructive' className="rounded-full" onClick={() => setTutorialNumber(0)}>
                    <RotateCcw />
                </Button>
            </div>
        </div>
    )
}