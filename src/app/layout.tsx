import type { Metadata } from "next";
import { Lora, Lato } from "next/font/google";
import localFont from "next/font/local";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const lato = Lato({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Lato Medium (500) isn't served by Google Fonts' static Lato family — self-hosted from the OFL release for Subheading.
const latoMedium = localFont({
  variable: "--font-sans-medium",
  src: "../fonts/Lato-Medium.ttf",
  weight: "500",
});

export const metadata: Metadata = {
  title: "Hurt 2 Heal",
  description:
    "A safe, peer-led digital sanctuary for trauma-informed education, support, and community healing for survivors of sexual assault and domestic violence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${lato.variable} ${latoMedium.variable} min-h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <SiteNav />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
