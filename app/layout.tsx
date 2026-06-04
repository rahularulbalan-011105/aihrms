import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireMind — Intelligent Hiring. Trusted Future.",
  description:
    "AI-powered recruitment platform that helps job seekers find genuine opportunities and helps agencies source, screen, and hire top talent faster.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-white text-ink-900">
        {children}
      </body>
    </html>
  );
}
