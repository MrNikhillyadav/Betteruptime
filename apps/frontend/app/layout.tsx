import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import { Instrument_Serif } from "next/font/google";

import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "BetteruptimeV1",
  description: "An open-source alternative to betterstack X for macOS. Now Monitor your websites 24x7 for free",
  creator: "BetterUptimeV1",
  publisher: "BetterUptimeV1",
   icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={` ${caveat.variable} antialiased ${instrumentSerif.className}`}
      >
        {children}
      </body>
    </html>
  );
}
