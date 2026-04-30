import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "phonk motivation",
  description:
    "Phonk radio + insane motivational quotes. A vibe site for grinding. Like lofi.cafe, but harder.",
  openGraph: {
    title: "phonk motivation",
    description:
      "Phonk radio + insane motivational quotes. A vibe site for grinding.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "phonk motivation",
    description:
      "Phonk radio + insane motivational quotes. A vibe site for grinding.",
    creator: "@charoori_ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground overflow-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
