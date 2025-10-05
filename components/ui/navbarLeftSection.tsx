'use client'

import { useIsMobile } from "@/hooks/use-mobile";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { cn } from "@/lib/utils";

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
    // {
    //     name: "Testing Homepage",
    //     component: <HardHat />,
    //     link: "/testing"
    // }
]

export default function NavbarLeftSection() {
    const pathName = usePathname();

    return (
        <div className="items-center flex gap-2">
            {navigationStuff.map((item, index) => (
                <Link href={item.link} key={index}>
                    <Button variant='ghost' className={cn('items-center rounded-full transition-all w-9 md:w-[initial]', pathName === item.link ? 'bg-secondary hover:bg-secondary' : "hover:bg-primary-foreground")}>
                        {item.component}
                        <p className="hidden md:block text-sm font-medium">
                            {item.name}
                        </p>
                    </Button>
                </Link>
            ))}
        </div>
    )
}