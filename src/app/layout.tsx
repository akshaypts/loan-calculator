import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "Loan Calculator",
  description: "Calculate EMI, compare payments, and track extra payments",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-emerald-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
