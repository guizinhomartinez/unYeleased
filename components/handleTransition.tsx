// credits to https://github.com/TomIsLoading/next-14-page-transitions/tree/main
"use client";

import Link, { LinkProps } from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

interface TransitionLinkProps extends LinkProps {
    children: React.ReactNode;
    href: string;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const HandleTransition: React.FC<TransitionLinkProps> = ({
    children,
    href,
    ...props
  }) => {
    const router = useRouter();
  
    const handleTransition = async (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      e.preventDefault();
      const body = document.querySelector("body");
  
      // body?.classList.add("page-transition");
  
      // await sleep(400);
      router.push(href);
      // await sleep(400);
  
      // body?.classList.remove("page-transition");
    };
  
    return (
      <Link href={href} onClick={handleTransition} {...props}>
        {children}
      </Link>
    );
  };