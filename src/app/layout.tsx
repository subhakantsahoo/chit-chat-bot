import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talk to AI Instantly | Open Ai 2.0 – Chatbot for Automation",
  description:
    "Advanced AI chatbot for real-time conversations, task automation, and image analysis. Powered by Gemini and Next.js.",
  openGraph: {
    title: "Open Ai 2.0",
    description:
      "AI-powered chatbot for real-time communication and automation.",
    url:
      process.env.NEXT_PUBLIC_API_URL ||
      "https://main.d3g1sjoperhwf0.amplifyapp.com/",
    images: ["https://metatags.io/images/meta-tags.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Ai 2.0",
    description:
      "AI-powered chatbot for real-time communication and automation.",
    images: ["https://metatags.io/images/meta-tags.png"],
  },
  keywords: [
    "Open Ai 2.0 chatbot",
    "Gemini AI chat",
    "Next.js AI assistant",
    "real-time image recognition",
    "Subhakanta Sahoo AI developer",
    "d3g1sjoperhwf0 AI",
  ],
  authors: [{ name: "Subhakanta Sahoo" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="tz0vyvbN578ZjU6pI7AMNOQjs6p_RiRCxTCPsrGov_o"
        />
        <link rel="icon" href="/fox-svgrepo-com.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
