import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/util";
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constant";
import { SidebarInset, SidebarProvider } from "@/component/ui/sidebar";
import { TreeViewProvider } from "@/context/tree-view";
import { RateLimitProvider } from "@/context/rate-limit";
import { CookieBanner } from "@/component/cookie-banner";
import { GoogleMeta } from "@/component/google-meta";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: APP_TITLE,
  description: APP_DESCRIPTION,
  keywords: [
    "GitHub",
    "repository",
    "tree",
    "viewer",
    "ASCII",
    "folder structure",
    "file structure",
  ],
  authors: [{ name: "Zamoca42", url: "https://github.com/Zamoca42" }],
  openGraph: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
  },
  twitter: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  sidebar,
  children,
}: Readonly<{
  sidebar: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon/aflow-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon/aflow-apple-icon.png" />
        <GoogleMeta />
      </head>
      <body
        className={cn("min-h-screen font-sans antialiased", inter.variable)}
      >
        <TreeViewProvider>
          <SidebarProvider>
            <RateLimitProvider>
              <aside>{sidebar}</aside>
              <SidebarInset>
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                  {children}
                </main>
              </SidebarInset>
              <CookieBanner />
            </RateLimitProvider>
          </SidebarProvider>
        </TreeViewProvider>
      </body>
    </html>
  );
}
