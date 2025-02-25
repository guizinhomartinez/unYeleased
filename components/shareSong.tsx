"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "./ui/button";

export default function ShareSong() {
    const id = useId();
    const [copied, setCopied] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleCopy = () => {
        if (inputRef.current) {
            navigator.clipboard.writeText(inputRef.current.value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    return (
        <div className="-p-4">
            <div className="relative flex gap-2 select-none w-full">
                <Input ref={inputRef} id={id} type="text" defaultValue={location.href} readOnly className="select-none w-full"/>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={handleCopy}
                                variant='secondary'
                                size='icon'
                                className="w-10"
                                aria-label={copied ? "Copied" : "Copy to clipboard"}
                                disabled={copied}
                            >
                                <div className={cn("absolute transition-all", copied ? "scale-100 opacity-100" : "scale-0 opacity-0")}>
                                    <CheckIcon className="stroke-emerald-500" size={16} aria-hidden="true" />
                                </div>
                                <div
                                    className={cn("transition-all", copied ? "scale-0 opacity-0" : "scale-100 opacity-100")}>
                                    <CopyIcon size={16} aria-hidden="true" />
                                </div>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="px-2 py-1 text-xs text-primary bg-background border border-input">Copy to clipboard</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}
