import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";
import { useEffect } from "react";

type SliderProps = React.ComponentProps<typeof Slider>;

export default function VolumeSlider({ className, ...props }: SliderProps) {
    return (
        <Slider
            defaultValue={[100]}
            max={100}
            step={1}
            className={cn("w-full", className)}
            onKeyDown={(e) => e.preventDefault()}
            {...props}
        />
    );
}