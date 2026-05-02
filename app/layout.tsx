import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SkipLink } from "@/components/skip-link";
import { buildMetadata } from "@/lib/seo/meta";

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Toaster>
            <SkipLink />
            <Navbar />
            <main id="main" className="container py-8">
              {children}
            </main>
            <Footer />
          </Toaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
