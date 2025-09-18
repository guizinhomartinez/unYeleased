import { EllipsisVertical } from "lucide-react";
import { Menu, PopoverMenuItems } from "../player";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { toast } from "sonner";
import InfoCard from "./info-card";
import DownloadSingle from "./download-single";
import { ScrollArea } from "../ui/scroll-area";

const DrawerMenu = ({
    backgroundLore,
    linkToGenius,
    lyrics,
    source,
    text,
}: Menu) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button
                    className="rounded-full min-w-9"
                    variant="secondary"
                    size="icon"
                >
                    <EllipsisVertical size="24" />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-full rounded-t-3xl">
                <div className="p-5 w-full flex flex-col gap-2">
                    <Button
                        className="rounded-full h-12"
                        variant="secondary"
                        onClick={() => {
                            navigator.clipboard.writeText(location.href);
                            toast("Copied song link to clipboard");
                        }}
                    >
                        {PopoverMenuItems[0].icon}
                        {PopoverMenuItems[0].text}
                    </Button>
                    <DownloadSingle
                        className="rounded-full h-12 w-full"
                        source={source}
                        songVal={text}
                    />
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button
                                className="w-full rounded-full h-12"
                                size="icon"
                                variant="secondary"
                                id="share-button"
                            >
                                {PopoverMenuItems[2].icon}
                                {PopoverMenuItems[2].text}
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent
                            className="max-h-[95dvh] rounded-t-2xl pt-1"
                            showGrabThing={false}
                        >
                            <ScrollArea>
                                <InfoCard
                                    backgroundLore={backgroundLore}
                                    linkToGenius={linkToGenius}
                                    lyrics={lyrics}
                                    shouldShowClose={false}
                                />
                            </ScrollArea>
                        </DrawerContent>
                    </Drawer>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default DrawerMenu;
