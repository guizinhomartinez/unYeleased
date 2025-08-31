import type { Metadata } from "next";
import localFont from 'next/font/local'
import { IBM_Plex_Mono, Geist, Geist_Mono, Inter, JetBrains_Mono } from 'next/font/google'
import "@/app/CSS-files/globals.css";
import { ThemeProvider } from "@/components/themeProvider"
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from "@/components/ui/sonner";

const yeezy = localFont({
  src: '../public/yeezy_tstar-bold-webfont.ttf'
})

const IBMPlexMono = IBM_Plex_Mono({ weight: ['400'], subsets: ['latin'] })
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const JetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ['400', '900'],
  subsets: ['latin'],
  variable: "--font-inter-sans"
})

export const metadata: Metadata = {
  title: "UnYeleased",
  description: "A compilation of all of Ye's unreleased projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-vaul-drawer-wrapper="" className="m-0 p-0">
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} ${JetBrainsMono.variable} antialiased overflow-x-hidden`}
      >
        <Toaster position="top-center" className='toaster group' toastOptions={{ className: "group-[.toaster]:rounded-xl group-[.toaster]:bg-primary-foreground" }} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader
            color="#c48bd1"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
            template='<div class="bar" role="bar"><div class="peg"></div></div>'
            zIndex={1600}
            showAtBottom={false}
          />
          <NuqsAdapter>
            {children}
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
