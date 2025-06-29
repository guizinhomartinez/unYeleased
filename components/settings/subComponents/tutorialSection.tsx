import { useEffect, useState } from "react";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { RotateCcw } from "lucide-react";

export const TutorialSection = () => {
    const [tutorialNumber, setTutorialNumber] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedTutorialNumber = localStorage.getItem("tutorial-number");
        if (storedTutorialNumber !== null) {
            setTutorialNumber(Number(storedTutorialNumber));
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        isLoaded && localStorage.setItem("tutorial-number", String(tutorialNumber));
    }, [tutorialNumber, isLoaded]);

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