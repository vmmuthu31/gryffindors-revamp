import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import ClientBody from "./ClientBody";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Gryffindors | Web3 Blockchain Development Solutions",
    template: "%s | Gryffindors",
  },
  description:
    "Gryffindors is a Web3 native Solutions specializing in blockchain smart contracts, dApps and crypto solutions that scale. We create elegant experiences and decentralized solutions.",
  keywords: [
    "blockchain",
    "web3",
    "smart contracts",
    "dApps",
    "defi",
    "nft",
    "blockchain Solutions",
  ],
  authors: [{ name: "Gryffindors Team" }],
  creator: "Gryffindors",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gryffindors.in",
    title: "Gryffindors | Web3 Blockchain Development Solutions",
    description:
      "Gryffindors is a Web3 native Solutions specializing in blockchain smart contracts, dApps and crypto solutions that scale.",
    siteName: "Gryffindors",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "Gryffindors Web3 Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gryffindors | Web3 Blockchain Development Solutions",
    description:
      "Gryffindors is a Web3 native Solutions specializing in blockchain smart contracts, dApps and crypto solutions that scale.",
    images: ["/assets/logo.png"],
    creator: "@Gryffindor_W3",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable}`}>
      <ClientBody>{children}</ClientBody>
    </html>
  );
}
