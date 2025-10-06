import { cn } from "@/lib/utils";
import { HeadersInterface } from "./settingsComponent";
import { UISection } from "./subComponents/uiSections";
import { TutorialSection } from "./subComponents/tutorialSection";
import { Password } from "./subComponents/passwordSection";
import { memo } from "react";

export const SettingsContent = ({
    isWideEnough,
    mainTitle,
    currentTab,
    appearenceTab,
    tweaksTab,
    passwordTab,
}: {
    appearenceTab: boolean;
    tweaksTab: boolean;
    passwordTab: boolean;
    isWideEnough: boolean;
    mainTitle: HeadersInterface;
    currentTab: string;
}) => {
    return (
        <div
            className={cn(
                "bg-primary-foreground/50 w-full p-4 md:p-8",
                isWideEnough ? "border-l overflow-y-auto rounded-tl-xl" : ""
            )}
        >
            <div className="flex flex-col gap-2 pt-16 lg:pt-0">
                {mainTitle.map(
                    (element, index) =>
                        element.id === currentTab && (
                            <div
                                className="flex flex-col mb-3 text-center"
                                key={index}
                            >
                                <p className="text-3xl font-semibold">
                                    {element.title}
                                </p>
                                <p className="text-sm text-primary/50">
                                    {element.subtext}
                                </p>
                            </div>
                        )
                )}
                {appearenceTab && <UISection />}
                {tweaksTab && <TutorialSection />}
                {passwordTab && <Password />}
            </div>
        </div>
    );
};

export default memo(SettingsContent);