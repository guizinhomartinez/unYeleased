'use client'

import { Github, HardHat, Home, Info, KeyRound, LoaderCircleIcon, Moon, PlusCircle, PlusSquare, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Separator } from "./ui/separator"
import React, { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Form,
    FormControl,
    FormDescription,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile"

const navigationStuff = [
    {
        name: "Home",
        component: <Home />,
        link: "/"
    },
    // {
    //     name: "About",
    //     component: <Info />,
    //     link: "/about"
    // },
    // {
    //     name: "Create Albums",
    //     component: <PlusCircle />,
    //     link: "/about/create-album"
    // },
    {
        name: "Testing Homepage",
        component: <HardHat />,
        link: "/testing"
    }
]

export default function Navbar({ className }: { className?: string }) {
    const pathName = usePathname();

    return (
        <>
            <div className={cn('flex place-content-between w-full py-1 pb-3 bg-background transition-all', className)}>
                <div className="items-center flex gap-2">
                    {navigationStuff.map((item, index) => (
                        <Link href={item.link} key={index}>
                            <Button variant='outline' size={`${!useIsMobile() ? 'default' : 'icon'}`} className={cn('items-center rounded-full transition-all', pathName === item.link && 'active-button')}>
                                {item.component}
                                {!useIsMobile() ? String(item.name) : String('')}
                            </Button>
                        </Link>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="rounded-full" variant='outline' size='icon'>
                                <KeyRound />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Password</DialogTitle>
                            </DialogHeader>
                            <Password />
                        </DialogContent>
                    </Dialog>
                    <DropDown />
                    <a href="https://github.com/guizinhomartinez/unYeleased" target="_blank">
                        <Button variant='outline' className="rounded-full">
                            <Github />
                            Source
                        </Button>
                    </a>
                </div>
            </div>
            <Separator orientation="horizontal" className="h-[2px] rounded-full bg-muted/80" />
        </>
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

                <Button type="submit" className="flex justify-center items-center" disabled={loadingNextPage}>
                    {loadingNextPage && <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true" />}
                    {!loadingNextPage && "Submit"}
                </Button>
            </form>
        </Form>
    )
}

const DropDown = () => {
    const { setTheme } = useTheme()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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