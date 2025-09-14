import { useEffect, useState } from "react";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { OctagonAlert, RotateCcw, TriangleAlert } from "lucide-react";
import { useLocalStorage } from "react-use";
import { WrapperComponent } from "../settingsComponent";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const TutorialSection = () => {
    const [tutorialNumber, setTutorialNumber] = useLocalStorage("tutorial-number", 0, { raw: true });

    return (
        <>
            <WrapperComponent text="Reset all settings" id={1}>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='destructive' className="rounded-md">
                            <RotateCcw />
                            Reset settings
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="space-y-6 max-h-[85vh] overflow-y-auto">
                        <AlertDialogHeader className="flex flex-col items-center space-y-3">
                            <div className="text-primary p-4 relative">
                                <div className="bg-secondary/15 animate-pulse absolute inset-0 size-full rounded-full" />
                                <TriangleAlert className="size-10" />
                            </div>
                            <AlertDialogTitle className="text-center text-2xl font-bold">
                                Are you sure?
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="mx-auto max-w-md">
                            <p className="text-center text-muted-foreground/85">
                                Resetting your settings will permanently erase
                                all of your preferences and restore defaults.
                                <br />
                                Are you absolutely sure you want to proceed?
                            </p>
                        </div>
                        <AlertDialogFooter className="*:w-full flex !flex-col gap-2 !space-x-0">
                            <AlertDialogAction asChild>
                                <Button className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 py-5 rounded-xl" onClick={() => localStorage.clear()}>
                                    Reset
                                </Button>
                            </AlertDialogAction>
                            <AlertDialogCancel className="py-5 rounded-xl">
                                Cancel
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </WrapperComponent>
            <WrapperComponent text="Reset tutorial" id={0}>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='destructive' className="rounded-md">
                            <RotateCcw />
                            Reset tutorial
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="space-y-6 max-h-[85vh] overflow-y-auto">
                        <AlertDialogHeader className="flex flex-col items-center space-y-3">
                            <div className="text-primary p-4 relative">
                                <div className="bg-secondary/15 animate-pulse absolute inset-0 size-full rounded-full" />
                                <TriangleAlert className="size-10" />
                            </div>
                            <AlertDialogTitle className="text-center text-2xl font-bold">
                                Are you sure?
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="mx-auto max-w-md">
                            <p className="text-center text-muted-foreground/85">
                                Resetting your settings will permanently erase
                                all of your preferences and restore defaults.
                                <br />
                                Are you absolutely sure you want to proceed?
                            </p>
                        </div>
                        <AlertDialogFooter className="*:w-full flex !flex-col gap-2 !space-x-0">
                            <AlertDialogAction asChild>
                                <Button className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 py-5 rounded-lg" onClick={() => setTutorialNumber(0)}>
                                    Reset
                                </Button>
                            </AlertDialogAction>
                            <AlertDialogCancel className="py-5 rounded-lg">
                                Cancel
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </WrapperComponent>
        </>
    )
}