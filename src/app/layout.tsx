import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Democratic Tech Fund — Community-Owned Tech, Funded Together",
  description:
    "The internet belongs to all of us. The Democratic Tech Fund pools resources so communities can build tech they own instead of renting their digital lives from Big Tech: members contribute together, the principal stays theirs, and members vote which projects the yield funds. A demo built on the open-source crowdstake protocol.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
