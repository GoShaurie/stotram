import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Noto_Serif_Devanagari, Tiro_Devanagari_Sanskrit } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

// Every page on this site is content that can be prerendered (SEO plan §2).
export const ensureStatic = "navigation";

const tiroSanskrit = Tiro_Devanagari_Sanskrit({
  variable: "--font-tiro-sanskrit",
  weight: "400",
  subsets: ["devanagari", "latin"],
});
const notoDeva = Noto_Serif_Devanagari({ variable: "--font-noto-deva", subsets: ["devanagari"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: Understand what you chant`, template: `%s | ${SITE.name}` },
  description: SITE.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${tiroSanskrit.variable} ${notoDeva.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="bg-black text-white print:hidden">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-black uppercase tracking-[0.2em]">
              <span className="font-sanskrit text-xl font-normal tracking-normal text-brand">ॐ</span>
              {SITE.name}
            </Link>
            <nav className="text-sm font-semibold text-white/70">
              <Link href="/#library" className="hover:text-white">
                Library
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="border-t border-line print:hidden">
          <p className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-ink-faint sm:px-6">
            Every word, note and translation is marked with its review status and cites its sources.
          </p>
        </footer>
      </body>
    </html>
  );
}
