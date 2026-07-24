import type { ReactNode } from "react";
import Link from "next/link";
import { Body, Button, Caption, Heading2, Heading4 } from "@breadcoop/ui";
import {
  ArrowRight,
  ArrowsClockwise,
  Coins,
  GlobeHemisphereWest,
  GraduationCap,
  HandHeart,
  ShieldCheck,
  UsersThree,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";
import { AsteriskMark, OurCoopLogo } from "@/components/ourcoop-logo";
import { FundingCalculator } from "@/components/_home/funding-calculator";
import { HowItWorks } from "@/components/_home/how-it-works";
import { YieldEngine } from "@/components/_home/yield-engine";
import { YieldSliceExplainer } from "@/components/_home/yield-slice-explainer";

/** Static-export base path — public assets and static pages live under it. */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const DOCS_URL = "/docs"; // in-app documentation & walkthroughs
const APP_URL = `${BASE}/coop/`; // the Fund's governance app (demo data, static page)
const GITHUB_URL = "https://github.com/BreadchainCoop/crowdstake.fun"; // footer credit
const DTF_URL = "https://democratictech.fund"; // the real Democratic Tech Fund

export function LandingPage() {
  return (
    <div className="bg-paper-main min-h-screen">
      <SiteNav />
      <main>
        <Hero />
        <WhatWeDo />
        <KeyConcepts />
        <Features />
        <CalculatorSection />
        <UnderTheHood />
        <YieldSliceExplainer />
        <HowItWorks />
        <YieldEngine />
        <Membership />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------------------------------- Nav ---------------------------------- */

function SiteNav() {
  return (
    <header className="border-paper-2 bg-paper-main/80 sticky top-0 z-50 border-b backdrop-blur">
      <nav className="section-container flex h-16 items-center justify-between">
        <a
          href="#top"
          aria-label="Democratic Tech Fund — back to top"
          className="flex items-center gap-2"
        >
          <OurCoopLogo size={22} />
        </a>
        <div className="hidden items-center gap-8 md:flex">
          <NavLink href="#what-we-do">What we do</NavLink>
          <NavLink href="#how-it-works">How it works</NavLink>
          <NavLink href="#membership">Membership</NavLink>
        </div>
        <div className="flex items-center gap-3">
          <Button
            app="fund"
            variant="secondary"
            size="sm"
            as={Link}
            href={DOCS_URL}
          >
            Documentation
          </Button>
          <Button app="fund" variant="primary" size="sm" as="a" href={APP_URL}>
            Enter the Fund
          </Button>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="text-surface-grey hover:text-core-orange text-sm font-medium transition-colors"
    >
      {children}
    </a>
  );
}

/* --------------------------------- Hero ---------------------------------- */

/**
 * DTF hero — dark maroon ground with a red glow, the movement's headline set
 * in Boldonse, and the crowdstaking mechanism explained in the Fund's own
 * terms. Gradient hexes are DTF's ground; everything else is design tokens.
 */
function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(150deg, #2c1212 0%, #4a1616 100%)",
      }}
    >
      {/* Red glow, bottom-right. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -bottom-40 h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(207,38,38,0.45), transparent 72%)",
        }}
      />
      {/* Oversized background spark. */}
      <AsteriskMark
        size={420}
        className="text-core-orange pointer-events-none absolute -top-24 -right-16 rotate-12 opacity-20"
      />

      <div className="section-container relative py-24 lg:py-32">
        {/* Kicker */}
        <div className="flex items-center gap-2.5">
          <AsteriskMark size={14} className="text-core-orange" />
          <span className="text-jade-0 text-sm font-semibold tracking-wide">
            Tech · Shared Learning · Fund · Federation
          </span>
        </div>

        {/* Headline — DTF's rallying cry. */}
        <h1
          className="font-breadDisplay mt-6 max-w-4xl text-balance text-[#f7ecd8]"
          style={{
            fontSize: "clamp(1.9rem, 3.4vw + 0.9rem, 3.1rem)",
            lineHeight: 1.12,
            letterSpacing: "-0.01em",
          }}
        >
          The internet belongs to all of us. Let&apos;s take it back.
        </h1>

        <Body className="mt-7 max-w-2xl text-lg text-[#f3e7d0]/80">
          Imagine funding contra-infrastructure without anyone spending their
          savings. Members pool capital into a shared vault; the principal stays
          theirs, redeemable any time. Only the yield it earns is spent — and
          members vote, together, which community-tech projects each round
          funds.
        </Body>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Button
            app="fund"
            variant="primary"
            as="a"
            href={APP_URL}
            rightIcon={<ArrowRight weight="bold" />}
          >
            Explore the Fund
          </Button>
          <a
            href="#membership"
            className="text-sm font-medium text-[#f3e7d0]/70 underline underline-offset-4 transition-colors hover:text-[#f3e7d0]"
          >
            See how membership maps on
          </a>
        </div>

        {/* Meta line */}
        <div className="mt-12 flex items-center gap-2.5">
          <ArrowRight size={18} weight="bold" className="text-core-orange" />
          <span className="text-sm font-semibold text-[#f3e7d0]/80">
            Funding circles · member ballots · shared yield · principal always
            redeemable
          </span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- What we do ------------------------------ */

const PILLARS = [
  {
    icon: Wrench,
    title: "Tech",
    body: "Cooperative tools and infrastructure communities own — instead of renting their digital lives from Big Tech.",
  },
  {
    icon: GraduationCap,
    title: "Shared learning",
    body: "Experience-sharing, documentation, and peer training so communities can run their own tech with confidence.",
  },
  {
    icon: Coins,
    title: "Fund",
    body: "A methodology to pool resources for community projects — here, powered by shared on-chain yield.",
  },
  {
    icon: GlobeHemisphereWest,
    title: "Federation",
    body: "Solidarity and shared infrastructure across borders, so no community has to build alone.",
  },
];

function WhatWeDo() {
  return (
    <section id="what-we-do" className="py-20">
      <div className="section-container">
        <div className="flex items-center justify-center gap-3">
          <AsteriskMark size={22} className="text-core-orange" />
          <Heading2 className="text-text-standard text-center">
            What the Fund is for
          </Heading2>
        </div>
        <Body className="text-surface-grey mx-auto mt-4 max-w-2xl text-center text-lg">
          The Democratic Tech Fund backs contra-infrastructure across four
          connected areas. This demo shows how the money could flow through all
          of them.
        </Body>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="border-paper-2 bg-paper-0 rounded-2xl border p-6 transition-shadow hover:shadow-lg"
            >
              <div className="bg-core-orange/10 flex h-12 w-12 items-center justify-center rounded-xl">
                <Icon size={24} weight="bold" className="text-core-orange" />
              </div>
              <Heading4 className="text-text-standard mt-4">{title}</Heading4>
              <Body className="text-surface-grey mt-2">{body}</Body>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Key concepts ------------------------------- */

const CONCEPTS = [
  {
    title: "One member, one vote",
    body: "Voting power comes from membership, not from the size of your contribution. Every member's ballot weighs exactly the same — the whole point of democratic tech.",
  },
  {
    title: "Points ballots",
    body: "Each round you get 100 points to spread across project proposals however you like — all on one project, or a little everywhere. The sum is capped at 100.",
  },
  {
    title: "Funding rounds",
    body: "Each cycle's yield becomes that round's funding pool. Top-voted projects fund up to their full-budget caps; proposals that can't reach their minimum-viable floor pass their share down the list.",
  },
  {
    title: "Principal stays yours",
    body: "Contributions are redeemable 1:1 at any time. Only the yield is ever spent — leaving the Fund never costs you your stake.",
  },
];

function KeyConcepts() {
  return (
    <section id="how-it-works" className="bg-paper-1 py-20">
      <div className="section-container">
        <div className="flex items-center justify-center gap-3">
          <AsteriskMark size={22} className="text-core-orange" />
          <Heading2 className="text-text-standard text-center">
            How the Fund decides
          </Heading2>
        </div>
        <Body className="text-surface-grey mx-auto mt-4 max-w-2xl text-center text-lg">
          No boards, no whales. Membership carries the vote, ballots carry the
          points, and the yield carries the money.
        </Body>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {CONCEPTS.map((c) => (
            <div
              key={c.title}
              className="border-paper-2 bg-paper-0 rounded-2xl border p-6 transition-shadow hover:shadow-lg"
            >
              <AsteriskMark size={20} className="text-core-orange" />
              <Heading4 className="text-text-standard mt-4">{c.title}</Heading4>
              <Body className="text-surface-grey mt-2">{c.body}</Body>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Features -------------------------------- */

const FEATURES = [
  {
    icon: Coins,
    title: "A pool that pays for tech",
    body: "Members stake into a shared yield-bearing vault. The principal is never spent — only the interest it earns, cycle after cycle.",
  },
  {
    icon: Wrench,
    title: "Project proposals",
    body: "Members put forward work — self-hosted apps, community clouds, training, research — each with a full budget and a minimum-viable floor.",
  },
  {
    icon: ArrowsClockwise,
    title: "Cycle-based rounds",
    body: "Fixed-length cycles keep funding predictable: ballots close, the round's yield is split, and a fresh funding pool starts accruing.",
  },
  {
    icon: ShieldCheck,
    title: "Open source, community-controlled",
    body: "Open, auditable smart contracts the community owns — each funding circle sets its own voting rules and yield strategy, with nothing locked to a vendor.",
  },
];

function Features() {
  return (
    <section id="features" className="py-20">
      <div className="section-container">
        <div className="flex items-center justify-center gap-3">
          <AsteriskMark size={22} className="text-core-orange" />
          <Heading2 className="text-text-standard text-center">
            What the Fund runs on
          </Heading2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="border-paper-2 bg-paper-0 rounded-2xl border p-6 transition-shadow hover:shadow-lg"
            >
              <div className="bg-core-orange/10 flex h-12 w-12 items-center justify-center rounded-xl">
                <Icon size={24} weight="bold" className="text-core-orange" />
              </div>
              <Heading4 className="text-text-standard mt-4">{title}</Heading4>
              <Body className="text-surface-grey mt-2">{body}</Body>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Calculator -------------------------------- */

function CalculatorSection() {
  return (
    <section id="calculator" className="bg-paper-1 py-20">
      <div className="section-container grid items-center gap-12 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-3">
            <AsteriskMark size={22} className="text-core-orange" />
            <Heading2 className="text-text-standard">
              What a fund this size can sustain
            </Heading2>
          </div>
          <Body className="text-surface-grey mt-6 max-w-xl text-lg">
            Real math with adjustable assumptions. Slide the membership and the
            contribution to see the funding pool a community like yours could
            sustain — without anyone spending their savings.
          </Body>
          <div className="mt-8 flex items-center gap-2.5">
            <ArrowRight size={18} weight="bold" className="text-core-orange" />
            <Caption className="text-surface-grey font-semibold">
              Presets sized like real community-tech projects
            </Caption>
          </div>
          <div className="mt-10 flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <AsteriskMark key={i} size={12} className="text-primary-jade" />
            ))}
          </div>
        </div>
        <FundingCalculator />
      </div>
    </section>
  );
}

/* ----------------------------- Under the Hood ---------------------------- */

function UnderTheHood() {
  return (
    <section className="py-20">
      <div className="section-container text-center">
        <div className="flex items-center justify-center gap-3">
          <AsteriskMark size={22} className="text-core-orange" />
          <Heading2 className="text-text-standard">Under the hood</Heading2>
        </div>
        <Body className="text-surface-grey mx-auto mt-6 max-w-4xl text-lg">
          The Fund runs on a smart-contract system on Gnosis Chain. Members&apos;
          deposits are converted into yield-bearing stablecoins (sDAI), and in
          exchange members receive a redeemable token minted 1:1 against their
          deposit. All interest earned becomes the Fund&apos;s grant pool — the
          principal itself is never touched.
        </Body>
      </div>
    </section>
  );
}

/* ------------------------------ Membership ------------------------------- */

const TIERS = [
  {
    name: "Community",
    price: "Free",
    cadence: "",
    blurb: "Read access, newsletters, and the community spaces. No contribution required.",
    role: "Participant",
    featured: false,
  },
  {
    name: "Backer",
    price: "€5",
    cadence: "/mo equivalent",
    blurb: "The most popular tier — a steady contribution to the work, now delivered as yield instead of dues.",
    role: "Supporter",
    featured: true,
  },
  {
    name: "Full membership",
    price: "€10+",
    cadence: "/mo equivalent",
    blurb: "Full governance rights: vote in the General Assembly and in every funding round.",
    role: "Voting member",
    featured: false,
  },
  {
    name: "Funder",
    price: "€25",
    cadence: "/mo equivalent",
    blurb: "Funder rights in a designated Funding Circle, including project selection and meetings with founders.",
    role: "Funding Circle",
    featured: false,
  },
  {
    name: "Champion",
    price: "€84",
    cadence: "/mo equivalent",
    blurb: "Everything in Funder, plus an annual impact report on what the pool funded.",
    role: "Funding Circle+",
    featured: false,
  },
];

function Membership() {
  return (
    <section id="membership" className="bg-paper-1 py-20">
      <div className="section-container">
        <div className="flex items-center justify-center gap-3">
          <UsersThree size={26} weight="bold" className="text-core-orange" />
          <Heading2 className="text-text-standard text-center">
            Your membership tiers, reimagined
          </Heading2>
        </div>
        <Body className="text-surface-grey mx-auto mt-4 max-w-3xl text-center text-lg">
          DTF&apos;s existing tiers map cleanly onto this model. The same
          monthly commitment becomes a one-time contribution members keep — its
          yield funds the work, and governance rights scale by tier, not by
          balance.
        </Body>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-2xl border p-6 transition-shadow hover:shadow-lg ${
                t.featured
                  ? "border-core-orange bg-paper-0 shadow-lg"
                  : "border-paper-2 bg-paper-0"
              }`}
            >
              {t.featured && (
                <span className="bg-core-orange absolute -top-3 left-6 rounded-full px-3 py-0.5 text-[0.65rem] font-bold tracking-wide text-white uppercase">
                  Most popular
                </span>
              )}
              <Caption className="text-core-orange font-bold tracking-wide uppercase">
                {t.name}
              </Caption>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-breadDisplay text-text-standard text-2xl">
                  {t.price}
                </span>
                <span className="text-surface-grey text-xs">{t.cadence}</span>
              </div>
              <Body className="text-surface-grey mt-3 flex-1 text-sm">
                {t.blurb}
              </Body>
              <div className="border-paper-2 mt-5 flex items-center gap-2 border-t pt-4">
                <HandHeart size={16} weight="bold" className="text-primary-jade" />
                <Caption className="text-text-standard font-semibold">
                  {t.role}
                </Caption>
              </div>
            </div>
          ))}
        </div>

        <Body className="text-surface-grey mx-auto mt-8 max-w-3xl text-center text-sm">
          Illustrative mapping for this demo. Contribution-to-yield figures
          depend on the vault&apos;s rate; the point is that members fund the
          Fund without giving up their principal.
        </Body>
      </div>
    </section>
  );
}

/* ------------------------------- CTA band -------------------------------- */

function CtaBand() {
  return (
    <section className="bg-core-orange py-20 text-white">
      <div className="section-container text-center">
        <div className="flex justify-center">
          <AsteriskMark size={26} className="text-white" />
        </div>
        <Heading2 className="mt-4 text-white">
          Let&apos;s take the internet back.
        </Heading2>
        <Body className="mx-auto mt-4 max-w-3xl text-lg text-white/90">
          Community-owned tools, funded by the people who use them — with your
          principal always staying yours. This is what the Democratic Tech Fund
          could run on.
        </Body>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button app="fund" variant="light" as="a" href={APP_URL}>
            Explore the Fund
          </Button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Footer --------------------------------- */

const FOOTER_LINKS: { label: string; href: string; internal?: boolean }[] = [
  { label: "Enter the Fund", href: `${BASE}/coop/` },
  { label: "Documentation", href: DOCS_URL, internal: true },
  { label: "democratictech.fund", href: DTF_URL },
];

function SiteFooter() {
  return (
    <footer className="border-paper-2 bg-paper-main border-t py-14">
      <div className="section-container flex flex-col gap-10 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <OurCoopLogo size={22} />
          <Body className="text-surface-grey mt-3">
            A community-owned way to fund the internet we want: members pool
            capital, keep their principal, and the yield funds the work.
          </Body>
        </div>
        <div>
          <Caption className="text-text-standard font-semibold">
            Explore
          </Caption>
          <ul className="mt-4 space-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                {link.internal ? (
                  <Link
                    href={link.href}
                    className="text-surface-grey hover:text-core-orange text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="text-surface-grey hover:text-core-orange text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="section-container border-paper-2 mt-10 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Caption className="text-surface-grey">
          Concept demo · not affiliated with or endorsed by the Democratic Tech
          Fund
        </Caption>
        <a href={GITHUB_URL} className="flex items-center gap-2">
          <AsteriskMark size={12} className="text-core-orange" />
          <Caption className="text-surface-grey hover:text-core-orange transition-colors">
            Built on the open-source crowdstake protocol by Breadchain
            Cooperative
          </Caption>
        </a>
      </div>
    </footer>
  );
}
