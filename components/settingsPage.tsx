import { Badge } from "@/components/ui/badge"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { BoxIcon, Brush, HouseIcon, KeyRound, Laptop2Icon, LoaderCircleIcon, Moon, PaintbrushVertical, PanelsTopLeftIcon, Sun } from "lucide-react"
import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import Link from "next/link";
import { Label } from "./ui/label";

export default function SettingsPage({ mobile }: { mobile: boolean }) {
    const { setTheme, theme } = useTheme();

    return (
        <div className="flex flex-col gap-4">
            <p className={cn("font-semibold text-xl", mobile && "text-center mt-4 -mb-2")}>Settings</p>
            {mobile && <div className="w-full h-[2px] bg-muted" />}
            <Tabs defaultValue="appearence" orientation="vertical" className="flex-row rounded-full h-full">
                <TabsList className="flex-col justify-start rounded-xl bg-primary-foreground">
                    <TabsTrigger value="appearence" title="appearence" className="py-3 inline-flex gap-2 justify-start rounded-xl">
                        <Brush size={16} aria-hidden="true" />
                    </TabsTrigger>
                    <TabsTrigger value="password" title="Password" className="py-3 rounded-xl inline-flex gap-2 justify-start w-full">
                        <KeyRound size={16} aria-hidden="true" />
                    </TabsTrigger>
                </TabsList>
                <div className="grow justify-center items-center rounded-xl border border-muted text-start">
                    <TabsContent value="appearence" className="gap-2 px-4 py-3 text-xs flex flex-col justify-center">
                        <div className="flex justify-between items-center border-b border-b-muted py-2">
                            <Label className="text-base text-muted-foreground">Theme</Label>
                            <div className="flex gap-0.5 items-center justify-between rounded-full border border-muted">
                                <div className={cn("rounded-full p-1 duration-300 cursor-pointer hover:bg-secondary/50", theme === "light" && "bg-secondary hover:bg-secondary")} aria-label='light' onClick={() => setTheme("light")}>
                                    <Sun size='18' />
                                </div>
                                <div className={cn("rounded-full p-1 duration-300 cursor-pointer hover:bg-secondary/50", theme === "dark" && "bg-secondary hover:bg-secondary")} aria-label='dark' onClick={() => setTheme("dark")}>
                                    <Moon size='18' />
                                </div>
                                <div className={cn("rounded-full p-1 duration-300 cursor-pointer hover:bg-secondary/50", theme === "system" && "bg-secondary hover:bg-secondary")} aria-label='system' onClick={() => setTheme("system")}>
                                    <Laptop2Icon size='18' />
                                </div>
                            </div>
                        </div>
                        <div className="items-center border-b border-b-muted py-2 flex justify-between">
                            <Label className="text-base text-muted-foreground">Album page style</Label>
                            <Link href="/album-page-style" className="">
                                <Button variant='secondary' className="rounded-full">
                                    <PaintbrushVertical />
                                    Change style
                                </Button>
                            </Link>
                        </div>
                    </TabsContent>
                    <TabsContent value="password" className="p-4 flex justify-center items-center">
                        <Password />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

const Password = () => {
    const router = useRouter();
    const [loadingNextPage, setLoadingNextPage] = useState(false);

    const FormSchema = z.object({
        pin: z.string().min(4, {
            message: "Your one-time password must be 6 characters.",
        }),
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(JSON.stringify(data, null, 2));

        if (String(JSON.stringify(data, null, 2)).includes("2424")) {
            router.push("/single/2424");
        }

        setLoadingNextPage(true);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-fit flex flex-col gap-5 justify-center items-center">
                <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                        <FormItem className="flex flex-col place-items-center">
                            <FormLabel className='font-bold text-xl'>Enter the secret code</FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className={cn("flex justify-center items-center", loadingNextPage && "cursor-progress")} disabled={loadingNextPage}>
                    {loadingNextPage && <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true" />}
                    {!loadingNextPage && "Submit"}
                </Button>
            </form>
        </Form>
    )
}

const DropDown = () => {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="left" className="rounded-xl [&>div]:rounded-lg [&>div]:transition-colors [&>div]:cursor-pointer">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}