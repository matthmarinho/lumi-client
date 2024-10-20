import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { MainNav } from "./_components/main-nav"
import { Toaster } from "./_components/ui/sonner"

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Lumi",
  description: "Lumi Client",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="flex flex-row items-center p-4">
          <div className="w-14 flex-none">
            <h1 className="text-3xl font-bold text-primary">Lumi</h1>
          </div>
          <div className="flex grow justify-center">
            <MainNav />
          </div>
          <div className="w-14 flex-none"></div>
        </nav>
        <div className="flex h-full flex-col">
          <div className="flex-1">{children}</div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
