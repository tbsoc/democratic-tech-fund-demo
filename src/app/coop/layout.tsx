import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Democratic Tech Fund — Governance",
  description:
    "The Fund's live governance: funding circles, project proposals, member ballots, funding rounds, and withdrawal votes.",
};

export default function CoopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
