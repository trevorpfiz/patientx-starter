import "~/styles/globals.css";

import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import LocalFont from "next/font/local";
import { cookies, headers } from "next/headers";

import { cn } from "@acme/ui";
import { Toaster } from "@acme/ui/toaster";

import { TRPCReactProvider } from "~/trpc/react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
const fontCal = LocalFont({
  src: "../../../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-cal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Create T3 Turbo",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Create T3 Turbo",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex h-full flex-col font-sans",
          fontSans.variable,
          fontCal.variable,
        )}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
