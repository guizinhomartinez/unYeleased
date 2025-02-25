import type { Metadata } from "next";
import localFont from 'next/font/local'
import { IBM_Plex_Mono, Geist, Geist_Mono, Inter } from 'next/font/google'
import "./globals.css";
import { ThemeProvider } from "@/components/themeProvider"
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app'

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

const inter = Inter({
  weight: ['400', '900'],
  subsets: ['latin'],
  variable: "--font-inter-sans"
})

export const metadata: Metadata = {
  title: "UnYeleased",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
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
