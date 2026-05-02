import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SkipLink } from "@/components/skip-link";
import { buildMetadata } from "@/lib/seo/meta";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(GeistSans.variable, GeistMono.variable)}
    >
      <body className="font-sans">
        <ThemeProvider>
          <Toaster>
            <SkipLink />
            <Navbar />
            <main id="main" className="container py-10">
              {children}
            </main>
            <Footer />
          </Toaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
