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
    const isMobile = useIsMobile();

    return (
        <div className="items-center flex gap-2">
            {navigationStuff.map((item, index) => (
                <Link href={item.link} key={index}>
                    <Button variant='ghost' size={`${!isMobile ? 'default' : 'icon'}`} className={cn('items-center rounded-full transition-all', pathName === item.link ? 'bg-secondary hover:bg-secondary' : "hover:bg-primary-foreground")}>
                        {item.component}
                        {!isMobile ? String(item.name) : String('')}
                    </Button>
                </Link>
            ))}
        </div>
    )
}