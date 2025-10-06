import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Brush, KeyRoundIcon, Settings2Icon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export const Options = ({
    setCurrentTab,
    hideSidebar,
    appearenceTab,
    tweaksTab,
    passwordTab,
}: {
    setCurrentTab: Dispatch<SetStateAction<string>>;
    hideSidebar: boolean;
    appearenceTab: boolean;
    tweaksTab: boolean;
    passwordTab: boolean;
}) => {
    return (
        <>
            <Button
                className={cn(
                    "rounded-[0.55rem] py-4 transition-all duration-500 overflow-hidden justify-start",
                    !hideSidebar ? "w-full" : "px-2.5 w-9 h-9",
                    appearenceTab ? "bg-primary-foreground" : "bg-transparent"
                )}
                variant="secondary"
                onClick={() => setCurrentTab("appearence")}
            >
                <Brush className="shrink-0" />
                <span
                    className={cn(
                        "ml-2 whitespace-nowrap transition-opacity duration-300",
                        hideSidebar && "opacity-0"
                    )}
                >
                    Appearence
                </span>
            </Button>

            <Button
                className={cn(
                    "rounded-[0.55rem] py-4 transition-all duration-500 overflow-hidden justify-start",
                    !hideSidebar ? "w-full" : "px-2.5 w-9 h-9",
                    tweaksTab ? "bg-primary-foreground" : "bg-transparent"
                )}
                variant="secondary"
                onClick={() => setCurrentTab("tweaks")}
            >
                <Settings2Icon className="shrink-0" />
                <span
                    className={cn(
                        "ml-2 whitespace-nowrap transition-opacity duration-300",
                        hideSidebar && "opacity-0"
                    )}
                >
                    Tweaks
                </span>
            </Button>

            <Button
                className={cn(
                    "rounded-[0.55rem] py-4 transition-all duration-500 overflow-hidden justify-start",
                    !hideSidebar ? "w-full" : "px-2.5 max-w-9 max-h-9",
                    passwordTab ? "bg-primary-foreground" : "bg-transparent"
                )}
                variant="secondary"
                onClick={() => setCurrentTab("password")}
            >
                <KeyRoundIcon className="shrink-0" />
                <span
                    className={cn(
                        "ml-2 whitespace-nowrap transition-opacity duration-300",
                        hideSidebar && "opacity-0"
                    )}
                >
                    Password
                </span>
            </Button>
        </>
    );
};

export default Options;
