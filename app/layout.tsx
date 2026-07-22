import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { course } from "@/config/course";
import MetaPixel from "@/components/MetaPixel";
import ClarityAnalytics from "@/components/ClarityAnalytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${course.programName} | ${course.organizer}`,
  description: course.tagline,
  openGraph: {
    title: `${course.programName} | ${course.organizer}`,
    description: course.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${lora.variable}`}>
      <body>
        {children}
        <MetaPixel />
        <ClarityAnalytics />
      </body>
    </html>
  );
}
