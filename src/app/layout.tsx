import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/util";
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constant";
import { SidebarInset, SidebarProvider } from "@/component/ui/sidebar";
import { TreeViewProvider } from "@/context/tree-view";
import { RateLimitProvider } from "@/context/rate-limit";
import { VisualizeProvider } from "@/context/visualizer";

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
  children,
  sidebar,
  header,
}: Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="oSV9NtTWaNbiQLGBEQoyeABgw0rLEsPLWryHpK-SqCI"
        />
        <meta name="google-adsense-account" content="ca-pub-8854904636978298" />
        <link rel="icon" href="/favicon/aflow-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon/aflow-apple-icon.png" />
      </head>
      <body
        className={cn("min-h-screen font-sans antialiased", inter.variable)}
      >
        <TreeViewProvider>
          <SidebarProvider>
            <RateLimitProvider>
              <VisualizeProvider>
                <aside>{sidebar}</aside>
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex flex-1 items-center gap-2 px-4">
                      {header}
                    </div>
                  </header>
                  <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="flex flex-1 flex-col gap-2 px-4 pt-0">
                      {children}
                    </div>
                  </main>
                </SidebarInset>
              </VisualizeProvider>
            </RateLimitProvider>
          </SidebarProvider>
        </TreeViewProvider>
      </body>
    </html>
  );
}
