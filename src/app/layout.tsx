import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "./Providers";
import { Banner } from "@/components/Banner";

export const metadata: Metadata = {
  title: "AUTO21 | Used & New Cars from Hong Kong",
  description:
    "AUTO21 — Find high-quality used cars from Hong Kong. Reliable, transparent, and easy import process for Mongolia and beyond.",
  icons: {
    icon: "https://res.cloudinary.com/dlt1zyjia/image/upload/v1760673005/ChatGPT_Image_Oct_17_2025_11_45_50_AM_1_x2zd9d.png",
  },

  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",

  openGraph: {
    title: "AUTO21 — Hong Kong Car Exports",
    description:
      "Buy and import your next car directly from Hong Kong with AUTO21. Trusted, transparent, and efficient service.",
    url: "https://auto21.com.hk",
    siteName: "AUTO21",
    images: [
      {
        url: "https://res.cloudinary.com/dlt1zyjia/image/upload/v1760670972/ChatGPT_Image_Oct_17_2025_11_16_01_AM_guqndn.png",
        width: 400,
        height: 112,
        alt: "AUTO21 Hong Kong Logo",
      },
    ],
    locale: "en_HK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AUTO21 — Cars from Hong Kong",
    description:
      "Find and import your next car directly from Hong Kong with AUTO21.",
    images: [
      "https://res.cloudinary.com/dlt1zyjia/image/upload/v1760670972/ChatGPT_Image_Oct_17_2025_11_16_01_AM_guqndn.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/dlt1zyjia/image/upload/v1764310149/header_logo_nmftlr.png"
          fetchPriority="high"
        />


        
      </head>
      <body>
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Disable double-tap zoom
              document.addEventListener('dblclick', function (e) {
                e.preventDefault();
              });

              // Disable pinch zoom
              document.addEventListener('touchmove', function (event) {
                if (event.scale !== 1) {
                  event.preventDefault();
                }
              }, { passive: false });

              // Disable Safari gesture zoom
              document.addEventListener('gesturestart', function (e) {
                e.preventDefault();
              });
            `,
          }}
        />

        <Providers>
          <Header />
          <Banner />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
