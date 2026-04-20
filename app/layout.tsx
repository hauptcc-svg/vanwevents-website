import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VanWEvents | Premium MSC Cruise Packages",
  description:
    "Experience the world's finest MSC Cruise packages, expertly curated for South Africa. Luxury voyages to East Africa, Mediterranean, Caribbean and beyond.",
  keywords: [
    "MSC Cruises",
    "cruise booking",
    "South Africa cruises",
    "luxury cruise",
    "VanWEvents",
    "MSC Sinfonia",
    "East Africa cruise",
  ],
  openGraph: {
    title: "VanWEvents | Premium MSC Cruise Packages",
    description:
      "Luxury MSC Cruise packages, expertly curated for South Africa. Book your dream voyage today.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vanwevents.co.za",
    siteName: "VanWEvents",
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VanWEvents | Premium MSC Cruise Packages",
    description: "Luxury MSC Cruise packages for South Africa.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
