import { RefObject, useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { KeyboardIcon, SearchIcon } from "lucide-react";
import { Dialog as DialogPrimitive, VisuallyHidden } from "radix-ui";
import { Input } from "../ui/input";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Kbd } from "../ui/kbd";
import { KeyboardThing } from "@/lib/interfaces";

const ShortcutsMenu = (props: {
    keyboardThing: KeyboardThing;
    songRef: RefObject<HTMLAudioElement | null>;
    searchBarRef: RefObject<HTMLInputElement | null>;
}) => {
    const [searchValue, setSearchValue] = useState("");

    const filteredKeyboardThing = useMemo(() => {
        return props.keyboardThing.filter((e) =>
            e.description.includes(searchValue)
        );
    }, [props.keyboardThing, searchValue]);

    useEffect(() => {
        return () => {
            props.searchBarRef.current = null;
        };
    }, []);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="w-full rounded-xl"
                    variant="secondary"
                    disabled={!props.songRef.current}
                    id="share-button"
                >
                    <KeyboardIcon />
                    Shortcuts
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90%] overflow-auto p-6">
                <DialogPrimitive.Title asChild>
                    <VisuallyHidden.Root>Album explanation</VisuallyHidden.Root>
                </DialogPrimitive.Title>
                <div className="flex flex-col gap-3 relative">
                    <h1 className="text-xl font-semibold leading-none tracking-tight text-center">
                        Keyboard Shortcuts
                    </h1>
                    <div className="-mx-4 p-4 pb-2 rounded-b-xl dark:shadow-xl bg-background">
                        <div className="relative">
                            <Input
                                className="w-full p-4 rounded-xl peer ps-9 pe-9"
                                placeholder="Search shortcuts..."
                                id="shortcuts-search"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                ref={props.searchBarRef}
                            />
                            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                <SearchIcon size={16} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        {filteredKeyboardThing.map((thing, index) => (
                            <div
                                className="flex items-center justify-between gap-2 bg-secondary/50 px-3 py-2.5 rounded-xl"
                                key={thing.description + index}
                            >
                                <span className="text-sm">
                                    {capitalizeFirstLetter(thing.description)}
                                </span>
                                <div className="flex items-center gap-1">
                                    {thing.letter && <Kbd>{thing.letter}</Kbd>}
                                    {thing.letter2 && (
                                        <Kbd className="shadow-xl">
                                            {thing.letter2}
                                        </Kbd>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShortcutsMenu;
