import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { BookOpenText, ExternalLink, Mic2Icon } from "lucide-react";

type InfoCard = {
    backgroundLore: string;
    linkToGenius: string;
    lyrics: string;
    shouldShowClose: boolean;
};

const InfoCard = ({
    backgroundLore,
    linkToGenius,
    lyrics,
}: InfoCard) => {

    const formattedLyrics = lyrics.split("\n").map((line, index) => {
        if (line.trim() === "") {
            return <div key={index} className="mb-8"></div>;
        } else {
            return (
                <div key={index} className="mb-0.5">
                    <div>{line}</div>
                </div>
            );
        }
    });

    const formattedExplanation = backgroundLore
        .split("\n")
        .map((line, index) => {
            if (line.trim() === "") {
                return (
                    <div
                        key={index}
                        className="[&:not(:last-child)]:mb-2"
                    ></div>
                );
            } else {
                return (
                    <div key={index} className="mb-0.5">
                        <div>{line}</div>
                    </div>
                );
            }
        });

    return (
        <div className="p-3 h-[93vh] max-h-[97vh] w-screen md:h-fit md:max-w-[initial] md:w-[initial]">
            <Tabs defaultValue="explanation">
                <div className="relative mb-2">
                    <TabsList className="w-full flex justify-between rounded-2xl gap-1 sticky top-10">
                        <TabsTrigger
                            value="explanation"
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full rounded-xl inline-flex gap-2 items-center"
                        >
                            <BookOpenText size="16" /> Explanation
                        </TabsTrigger>
                        <TabsTrigger
                            value="lyrics"
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full rounded-xl inline-flex gap-2 items-center"
                        >
                            <Mic2Icon size="16" /> Lyrics
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent
                    value="explanation"
                    className="bg-secondary rounded-xl mx-0.5"
                >
                    <div className="p-4">{formattedExplanation}</div>
                </TabsContent>
                <TabsContent
                    value="lyrics"
                    className="bg-secondary rounded-xl mx-0.5"
                >
                    <div className="p-4">{formattedLyrics}</div>
                </TabsContent>
                <div className="flex flex-col gap-3 justify-center items-center bg-secondary p-4 mx-0.5 rounded-xl mt-2">
                    <div className="text-primary/50 text-sm text-center">
                        (All descriptions and lyrics are from Genius/YouTube)
                    </div>
                    <a href={linkToGenius} className="w-full" target="_blank">
                        <Button className="antialiased items-center w-full rounded-full">
                            Original Source
                            <ExternalLink />
                        </Button>
                    </a>
                </div>
            </Tabs>
        </div>
    );
};

export default InfoCard;
