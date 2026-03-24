import type { Metadata } from "next";
import { Noto_Sans_KR, Space_Grotesk } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Hyeonjae's Site",
  description: "Portfolio, competitive programming, and writing by Hyeonjae",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.variable} ${spaceGrotesk.variable}`}>{children}</body>
    </html>
  );
}
