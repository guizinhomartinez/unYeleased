import { useEffect, useState } from "react";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { RotateCcw } from "lucide-react";
import { useLocalStorage } from "react-use";

export const TutorialSection = () => {
    const [tutorialNumber, setTutorialNumber] = useLocalStorage("tutorial-number", 0, { raw: true });

    return (
        <div className="flex justify-between items-center gap-4 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
            <Label className="text-base text-muted-foreground">Reset tutorial</Label>
            <Button size="icon" variant='destructive' className="rounded-full" onClick={() => setTutorialNumber(0)}>
                <RotateCcw />
            </Button>
        </div>
    )
}