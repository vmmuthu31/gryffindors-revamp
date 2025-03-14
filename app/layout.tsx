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
  title: "Gryffindors | Web3 Blockchain Development Agency",
  description:
    "Gryffindors is a Web3 native agency specializing in blockchain smart contracts, dApps and crypto solutions that scale. We create elegant experiences and decentralized solutions.",
  keywords: [
    "blockchain",
    "web3",
    "smart contracts",
    "dApps",
    "defi",
    "nft",
    "blockchain agency",
  ],
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
