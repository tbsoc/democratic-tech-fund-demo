"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { isAddress, type Address } from "viem";
import { Body, Button, Caption, Chip, Heading4 } from "@breadcoop/ui";
import { ArrowRight, ArrowsClockwise, SpinnerGap } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { shortenAddress } from "@/lib/format";
import {
  COOP,
  coopAddressUrl,
  coopDmAbi,
  coopPowerAbi,
  coopRegistryAbi,
  coopTxUrl,
  coopVotingAbi,
  toCoopWei,
  type CoopState,
} from "@/lib/coop";
import { useCoopState, useCoopTx } from "@/hooks/use-coop";
import { AsteriskMark, OurCoopLogo } from "@/components/ourcoop-logo";
import { Card, EmptyState, PageHeader, StatCard } from "@/components/dapp/ui";
import { WalletButton } from "@/components/dapp/wallet-button";

const VIEWS = [
  ["overview", "Overview"],
  ["vote", "Vote"],
  ["members", "Members"],
] as const;
type ViewId = (typeof VIEWS)[number][0];

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export default function CoopPage() {
  const [view, setView] = useState<ViewId>("overview");
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useCoopState();

  return (
    <div className="bg-paper-main min-h-screen">
      <CoopNav view={view} setView={setView} />
      <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-20 sm:px-6">
        <MembershipBanner state={data} />
        {isLoading && (
          <Card className="mt-6 flex items-center gap-3">
            <SpinnerGap size={22} className="text-core-orange animate-spin" />
            <Body className="text-surface-grey-2">
              Loading the Fund&apos;s demo state…
            </Body>
          </Card>
        )}
        {isError && (
          <Card className="mt-6">
            <Body className="text-system-red">
              Couldn&apos;t read the chain: {String(error)}
            </Body>
            <Button
              app="fund"
              variant="secondary"
              className="mt-3"
              onClick={() => void refetch()}
            >
              Retry
            </Button>
          </Card>
        )}
        {data && (
          <>
            {view === "overview" && (
              <OverviewView state={data} setView={setView} />
            )}
            {view === "vote" && <VoteView state={data} />}
            {view === "members" && <MembersView state={data} />}
            <div className="mt-10 flex items-center justify-between">
              <Caption className="text-surface-grey">
                Concept demo · illustrative on-chain data · one member, one
                vote · built on the open-source crowdstake protocol
              </Caption>
              <button
                type="button"
                onClick={() => void refetch()}
                className="text-surface-grey-2 hover:text-core-orange flex items-center gap-1 text-sm font-medium"
              >
                <ArrowsClockwise
                  size={16}
                  weight="bold"
                  className={isRefetching ? "animate-spin" : undefined}
                />
                Refresh
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/* ---------------------------------- Nav ---------------------------------- */

function CoopNav({
  view,
  setView,
}: {
  view: ViewId;
  setView: (v: ViewId) => void;
}) {
  return (
    <header className="border-paper-2 bg-paper-main/85 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Democratic Tech Fund home">
              <OurCoopLogo size={22} />
            </Link>
            <Chip size="small" className="text-core-orange hidden sm:inline-flex">
              governance
            </Chip>
          </div>
          <WalletButton />
        </div>
        <nav className="flex items-center gap-1 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-3">
          {VIEWS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors",
                view === id
                  ? "bg-core-orange text-white"
                  : "text-surface-grey-2 hover:text-text-standard",
              )}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ----------------------------- Shared elements ---------------------------- */

function MembershipBanner({ state }: { state?: CoopState }) {
  const { isConnected } = useAccount();
  if (!state) return null;
  if (!isConnected) {
    return (
      <Card className="border-core-orange/30 bg-core-orange/5 mt-6">
        <Body className="text-surface-grey-2 text-sm">
          You&apos;re browsing the Democratic Tech Fund&apos;s pool. This is an
          illustrative preview — the figures are sample data. Browse the
          projects, ballots, and activity freely; in a live deployment, members
          connect a wallet to act. One member, one vote.
        </Body>
      </Card>
    );
  }
  return null;
}

/** Section label in the poster style: ✳ + small bold caps. */
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 mb-3 flex items-center gap-2">
      <AsteriskMark size={12} className="text-core-orange" />
      <Caption className="text-surface-grey-2 font-semibold tracking-wide uppercase">
        {children}
      </Caption>
    </div>
  );
}

function CycleBanner({ state }: { state: CoopState }) {
  return (
    <Card className="border-core-orange/25 mt-2 flex flex-wrap items-center gap-4">
      <span className="from-core-orange to-orange-0 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br text-white">
        <AsteriskMark size={22} className="text-white" />
      </span>
      <div className="min-w-0 flex-1">
        <Heading4 className="text-text-standard">
          Funding cycle {state.cycle}
        </Heading4>
        <Caption className="text-surface-grey-2 mt-0.5 block">
          {state.cycleComplete
            ? "Cycle complete — a funding round can run now"
            : `~${state.blocksLeft.toLocaleString()} blocks until the next round can run`}{" "}
          · round ready:{" "}
          <span
            className={
              state.ready
                ? "text-system-green font-semibold"
                : "text-surface-grey font-semibold"
            }
          >
            {state.ready ? "yes" : "no"}
          </span>
        </Caption>
      </div>
      <div className="text-right">
        <Caption className="text-surface-grey block">Funding pool</Caption>
        <Heading4 className="text-text-standard">
          {usd(state.funds.artFund)}
        </Heading4>
        <Caption className="text-surface-grey block">
          claimable yield {usd(state.artYield)}
        </Caption>
      </div>
    </Card>
  );
}

function TxLine({
  status,
  hash,
  error,
  successLabel,
}: {
  status: ReturnType<typeof useCoopTx>["status"];
  hash?: `0x${string}`;
  error?: string | null;
  successLabel: string;
}) {
  if (status === "idle") return null;
  if (status === "error")
    return (
      <Caption className="text-system-red mt-2 block">
        {error ?? "Transaction failed"}
      </Caption>
    );
  if (status === "success")
    return (
      <Caption className="text-system-green mt-2 block">
        {successLabel}{" "}
        {hash && (
          <a
            href={coopTxUrl(hash)}
            target="_blank"
            rel="noreferrer"
            className="text-core-orange hover:underline"
          >
            View on Etherscan ↗
          </a>
        )}
      </Caption>
    );
  return (
    <Caption className="text-surface-grey-2 mt-2 flex items-center gap-1.5">
      <SpinnerGap size={14} className="animate-spin" />
      {status === "signing" ? "Confirm in your wallet…" : "Confirming…"}
    </Caption>
  );
}

/* -------------------------------- Overview -------------------------------- */

function OverviewView({
  state,
  setView,
}: {
  state: CoopState;
  setView: (v: ViewId) => void;
}) {
  const fundedLastRound = state.projects.filter((p) => p.funded > 0).length;
  return (
    <div>
      <div className="mt-6">
        <PageHeader
          title="Democratic Tech Fund"
          subtitle="One shared pool, funded by yield. Members vote to split it across the projects in the fund — one member, one vote. Nobody spends their principal."
        />
      </div>
      <CycleBanner state={state} />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projects in the fund" value={state.projects.length} />
        <StatCard label="Funded (last round)" value={fundedLastRound} />
        <StatCard label="Funding pool" value={usd(state.funds.artFund)} accent />
        <StatCard label="Members" value={state.memberCount} />
      </div>

      <SectionTitle>How it works</SectionTitle>
      <Card>
        <Heading4 className="text-text-standard">How the money moves</Heading4>
        <Body className="text-surface-grey-2 mt-2 text-sm">
          Members contribute into a shared vault; the principal stays theirs,
          redeemable 1:1 anytime. Only the yield it earns is ever spent — each
          cycle, members&apos; 100-point ballots decide how that pool is split
          across the projects in the fund.
        </Body>
        <dl className="mt-4 grid gap-2 sm:grid-cols-2">
          <KvRow k="Unit of account" v="cUSD (1 cUSD = $1)" />
          <KvRow k="Funding cycle" v={`#${state.cycle}`} />
          <KvRow k="Governance" v="One member, one vote" />
          <KvRow k="Your principal" v="Redeemable 1:1, anytime" />
        </dl>
      </Card>

      <SectionTitle>Take part</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        <QuickAction
          title="Vote on projects"
          body="Distribute your 100 points across the projects in the fund — the pool follows the ratio."
          cta="Open voting"
          onClick={() => setView("vote")}
        />
        <ContributeCard state={state} />
      </div>

      <SectionTitle>Recent activity</SectionTitle>
      <RecentActivity state={state} />
    </div>
  );
}

function ContributeCard({ state }: { state: CoopState }) {
  const { isConnected } = useAccount();
  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-2">
        <AsteriskMark size={14} className="text-core-orange" />
        <Heading4 className="text-text-standard">Contribute</Heading4>
      </div>
      <Body className="text-surface-grey-2 mt-2 flex-1 text-sm">
        Deposit a stablecoin 1:1 to mint cUSD, the Fund&apos;s unit of account.
        The pooled principal earns the yield — only the interest is spent, and
        you can redeem 1:1 anytime.
      </Body>
      <Caption className="text-surface-grey mt-3 block">
        {isConnected
          ? `Your balance: ${usd(state.myCusd)} cUSD · redeemable 1:1`
          : "Connect a wallet to contribute — this preview shows sample balances."}
      </Caption>
    </Card>
  );
}

function QuickAction({
  title,
  body,
  cta,
  onClick,
}: {
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-2">
        <AsteriskMark size={14} className="text-core-orange" />
        <Heading4 className="text-text-standard">{title}</Heading4>
      </div>
      <Body className="text-surface-grey-2 mt-2 flex-1 text-sm">{body}</Body>
      <div className="mt-4">
        <Button
          app="fund"
          variant="primary"
          size="sm"
          rightIcon={<ArrowRight weight="bold" />}
          onClick={onClick}
        >
          {cta}
        </Button>
      </div>
    </Card>
  );
}

function KvRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-paper-2 flex items-center justify-between border-t pt-2">
      <Caption className="text-surface-grey">{k}</Caption>
      <Caption className="text-text-standard font-semibold">{v}</Caption>
    </div>
  );
}

/* ---------------------------------- Vote ---------------------------------- */

/** Distinct colors for the results distribution, on the DTF palette. */
const VOTE_PALETTE = ["#cf2626", "#ee7e2c", "#3aa85f", "#6d8cc9", "#d8a13a"];
const voteColor = (i: number) => VOTE_PALETTE[i % VOTE_PALETTE.length];

function VoteView({ state }: { state: CoopState }) {
  return (
    <div>
      <div className="mt-6">
        <PageHeader
          title="Vote"
          subtitle="Set how your voting power is split across the projects. The points are just weights — they form a ratio, and your voting power is applied in those proportions. The pool follows the combined ratio of everyone's ballots."
        />
      </div>
      <CycleBanner state={state} />
      <div className="mt-4">
        <ResultsDistribution state={state} />
      </div>
      <div className="mt-4">
        <VoteBallot state={state} />
      </div>
      <SectionTitle>Propose a project</SectionTitle>
      <div className="grid gap-4 lg:grid-cols-2">
        <RegisterProjectCard state={state} />
        <QueuedProjectsCard state={state} />
      </div>
    </div>
  );
}

/** The aggregate ratio: how all members' ballots would split the pool now. */
function ResultsDistribution({ state }: { state: CoopState }) {
  const totalPoints = state.projects.reduce((a, p) => a + p.points, 0);
  const rows = state.projects
    .map((p, i) => ({
      ...p,
      color: voteColor(i),
      pct: totalPoints ? (p.points / totalPoints) * 100 : 0,
    }))
    .sort((a, b) => b.pct - a.pct);
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Heading4 className="text-text-standard">Current results</Heading4>
          <Caption className="text-surface-grey-2 mt-0.5 block">
            How this cycle&apos;s ballots would split the Funding Pool right now.
          </Caption>
        </div>
        <div className="text-right">
          <Caption className="text-surface-grey block">Funding pool</Caption>
          <Heading4 className="text-text-standard">
            {usd(state.funds.artFund)}
          </Heading4>
        </div>
      </div>
      <div className="border-paper-2 mt-4 flex h-4 overflow-hidden rounded-full border">
        {rows.map((p) => (
          <div
            key={p.addr}
            style={{ width: `${p.pct}%`, background: p.color }}
            title={`${p.title} · ${p.pct.toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {rows.map((p) => (
          <div key={p.addr} className="flex items-center gap-2.5">
            <span
              className="h-3 w-3 shrink-0 rounded-sm"
              style={{ background: p.color }}
            />
            <Caption className="text-text-standard min-w-0 flex-1 truncate font-medium">
              {p.title}
            </Caption>
            <Caption className="text-surface-grey hidden sm:block">
              {usd((p.pct / 100) * state.funds.artFund)}
            </Caption>
            <Caption className="text-text-standard w-14 text-right font-bold">
              {p.pct.toFixed(1)}%
            </Caption>
          </div>
        ))}
      </div>
    </Card>
  );
}

function VoteBallot({ state }: { state: CoopState }) {
  const [points, setPoints] = useState<number[]>(() =>
    new Array(state.projects.length).fill(0),
  );
  const vote = useCoopTx();
  const round = useCoopTx();
  const { isConnected } = useAccount();
  const total = points.reduce((a, b) => a + b, 0);

  // Project list length can change between refetches — keep the ballot aligned.
  if (points.length !== state.projects.length) {
    setPoints(new Array(state.projects.length).fill(0));
  }

  // Points are relative weights, not a fixed budget — no cap. Each project's
  // share is its weight / the total, and that ratio is applied to the voter's
  // voting power.
  const setPoint = (i: number, raw: number) => {
    setPoints((prev) => {
      const next = [...prev];
      next[i] = Math.max(0, Math.round(raw));
      return next;
    });
  };

  // Relative step — reads live state so rapid clicks accumulate correctly.
  const bump = (i: number, delta: number) => {
    setPoints((prev) => {
      const next = [...prev];
      next[i] = Math.max(0, (prev[i] ?? 0) + delta);
      return next;
    });
  };

  const disabledReason = !isConnected ? "Connect a wallet to act" : null;

  if (state.projects.length === 0)
    return <EmptyState>No projects registered.</EmptyState>;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Heading4 className="text-text-standard">Your ballot</Heading4>
          <Caption className="text-surface-grey-2 mt-0.5 block">
            Give each project as many points as you like — they set the ratio,
            and your voting power is split in the shares shown. Recasting
            replaces your previous ballot.
          </Caption>
        </div>
      </div>

      <div className="border-paper-2 mt-4 border-t">
        {state.projects.map((p, i) => {
          const pts = points[i] ?? 0;
          const share = total ? (pts / total) * 100 : 0;
          return (
            <div
              key={p.addr}
              className="border-paper-2 flex flex-wrap items-center gap-x-4 gap-y-2 border-b py-3"
            >
              <div className="min-w-48 flex-1">
                <span className="text-text-standard text-sm font-semibold">
                  {p.title}
                </span>
                <span className="text-surface-grey block text-xs">
                  full {usd(p.full)} · min {usd(p.minViable)} · now {p.points}{" "}
                  pts community-wide
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Remove a point from ${p.title}`}
                  onClick={() => bump(i, -1)}
                  className="border-paper-2 text-text-standard hover:border-core-orange grid h-8 w-8 place-items-center rounded-lg border text-lg leading-none"
                >
                  −
                </button>
                <input
                  type="number"
                  min={0}
                  value={pts}
                  onChange={(e) => setPoint(i, Number(e.target.value || 0))}
                  className="border-paper-2 bg-paper-main text-text-standard focus:border-core-orange w-16 rounded-lg border px-2 py-1.5 text-center text-sm outline-none"
                />
                <button
                  type="button"
                  aria-label={`Add a point to ${p.title}`}
                  onClick={() => bump(i, 1)}
                  className="border-paper-2 text-text-standard hover:border-core-orange grid h-8 w-8 place-items-center rounded-lg border text-lg leading-none"
                >
                  +
                </button>
              </div>
              <Caption
                className={cn(
                  "w-16 text-right font-bold",
                  pts > 0 ? "text-core-orange" : "text-surface-grey",
                )}
              >
                {share.toFixed(0)}%
              </Caption>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Body className="text-surface-grey-2 text-sm">
          {total > 0
            ? "Shares are relative — they always add up to 100%."
            : "Add points to set your split."}
        </Body>
        <div className="flex flex-wrap gap-2">
          <Button
            app="fund"
            variant="secondary"
            size="sm"
            onClick={() => setPoints(new Array(state.projects.length).fill(0))}
          >
            Reset
          </Button>
          <Button
            app="fund"
            variant="primary"
            size="sm"
            disabled={Boolean(disabledReason) || total < 1 || vote.isBusy}
            onClick={() =>
              void vote.run({
                address: COOP.voting,
                abi: coopVotingAbi,
                functionName: "castVote",
                args: [points.map((v) => BigInt(v))],
              })
            }
          >
            {vote.isBusy ? "Casting…" : "Cast ballot"}
          </Button>
          <Button
            app="fund"
            variant="secondary"
            size="sm"
            disabled={Boolean(disabledReason) || !state.ready || round.isBusy}
            onClick={() =>
              void round.run({
                address: COOP.distributionManager,
                abi: coopDmAbi,
                functionName: "claimAndDistribute",
              })
            }
          >
            {round.isBusy ? "Running…" : "Run funding round"}
          </Button>
        </div>
      </div>
      {disabledReason && (
        <Caption className="text-surface-grey mt-2 block">
          {disabledReason} — browsing stays live either way.
        </Caption>
      )}
      {!state.ready && !disabledReason && (
        <Caption className="text-surface-grey mt-2 block">
          The funding round unlocks when the cycle completes, at least one
          ballot is cast, and yield has accrued.
        </Caption>
      )}
      <TxLine
        status={vote.status}
        hash={vote.hash}
        error={vote.error}
        successLabel="Ballot recorded on-chain."
      />
      <TxLine
        status={round.status}
        hash={round.hash}
        error={round.error}
        successLabel="Funding round distributed — cycle advanced."
      />
    </Card>
  );
}

/* --------------------------------- Activity ------------------------------- */

function RecentActivity({ state }: { state: CoopState }) {
  const rows = state.log.slice(0, 6);
  if (rows.length === 0) return <EmptyState>No activity yet.</EmptyState>;
  return (
    <Card className="p-0">
      {rows.map((t, i) => (
        <div
          key={i}
          className="border-paper-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-5 py-3 last:border-0"
        >
          <span className="bg-primary-blue/10 text-primary-blue rounded-full px-2 py-0.5 text-xs font-semibold">
            {t.kind}
          </span>
          <span className="text-text-standard min-w-0 flex-1 text-sm">
            {t.text}
          </span>
          <span className="text-surface-grey text-xs">{t.actor}</span>
          <span className="text-surface-grey text-xs">{t.when}</span>
        </div>
      ))}
    </Card>
  );
}

/* ---------------------------- Project registration ------------------------ */

function RegisterProjectCard({ state }: { state: CoopState }) {
  const { address, isConnected } = useAccount();
  const isCoordinator =
    isConnected && address?.toLowerCase() === state.coordinator.toLowerCase();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [recipient, setRecipient] = useState("");
  const [full, setFull] = useState("1000");
  const [minViable, setMinViable] = useState("400");
  const tx = useCoopTx();

  const fullNum = Number(full || 0);
  const minNum = Number(minViable || 0);
  const valid =
    title.trim().length > 0 &&
    isAddress(recipient.trim()) &&
    fullNum > 0 &&
    minNum > 0 &&
    minNum <= fullNum;

  return (
    <Card>
      <Heading4 className="text-text-standard">Register a project</Heading4>
      <Body className="text-surface-grey-2 mt-1 text-sm">
        The coordinator registers proposals with a full budget and a
        minimum-viable floor. New projects queue, then activate at the cycle
        boundary.
      </Body>
      <div className="mt-4 space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project title"
          className="border-paper-2 bg-paper-main text-text-standard focus:border-core-orange w-full rounded-xl border px-3 py-2 text-sm outline-none"
        />
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          placeholder="What the project is, who it benefits"
          className="border-paper-2 bg-paper-main text-text-standard focus:border-core-orange w-full rounded-xl border px-3 py-2 text-sm outline-none"
        />
        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Payout address 0x…"
          className="border-paper-2 bg-paper-main text-text-standard focus:border-core-orange w-full rounded-xl border px-3 py-2 font-mono text-sm outline-none"
        />
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <Caption className="text-surface-grey-2 mb-1 block">
              Full budget (cUSD)
            </Caption>
            <input
              type="number"
              min={0}
              value={full}
              onChange={(e) => setFull(e.target.value)}
              className="border-paper-2 bg-paper-main text-text-standard focus:border-core-orange w-full rounded-xl border px-3 py-2 text-sm outline-none"
            />
          </label>
          <label className="block">
            <Caption className="text-surface-grey-2 mb-1 block">
              Min viable (cUSD)
            </Caption>
            <input
              type="number"
              min={0}
              value={minViable}
              onChange={(e) => setMinViable(e.target.value)}
              className="border-paper-2 bg-paper-main text-text-standard focus:border-core-orange w-full rounded-xl border px-3 py-2 text-sm outline-none"
            />
          </label>
        </div>
      </div>
      <Button
        app="fund"
        variant="primary"
        size="sm"
        className="mt-4"
        disabled={!isCoordinator || !valid || tx.isBusy}
        onClick={() =>
          void tx.run({
            address: COOP.registry,
            abi: coopRegistryAbi,
            functionName: "registerProject",
            args: [
              recipient.trim() as Address,
              toCoopWei(fullNum),
              toCoopWei(minNum),
              title.trim(),
              summary.trim(),
            ],
          })
        }
      >
        {tx.isBusy ? "Registering…" : "Register project"}
      </Button>
      {!isCoordinator && (
        <Caption className="text-surface-grey mt-2 block">
          Only the coordinator ({shortenAddress(state.coordinator)}) can
          register projects on-chain.
        </Caption>
      )}
      {minNum > fullNum && (
        <Caption className="text-system-red mt-2 block">
          The minimum-viable floor can&apos;t exceed the full budget.
        </Caption>
      )}
      <TxLine
        status={tx.status}
        hash={tx.hash}
        error={tx.error}
        successLabel="Project registered — it's in the queue."
      />
    </Card>
  );
}

function QueuedProjectsCard({ state }: { state: CoopState }) {
  const tx = useCoopTx();
  const { isConnected } = useAccount();
  return (
    <Card>
      <Heading4 className="text-text-standard">Queued projects</Heading4>
      <Body className="text-surface-grey-2 mt-1 text-sm">
        Registered proposals wait here until the queue is processed — then they
        join the ballot. Anyone can process the queue.
      </Body>
      {state.queuedProjects.length === 0 ? (
        <Caption className="text-surface-grey mt-4 block">
          Nothing queued right now.
        </Caption>
      ) : (
        <div className="border-paper-2 mt-4 border-t">
          {state.queuedProjects.map((q) => (
            <div key={q.addr} className="border-paper-2 border-b py-3">
              <span className="text-text-standard text-sm font-semibold">
                {q.title}
              </span>
              <span className="text-surface-grey block text-xs">
                {shortenAddress(q.addr)} · full {usd(q.full)} · min{" "}
                {usd(q.minViable)}
              </span>
            </div>
          ))}
        </div>
      )}
      <Button
        app="fund"
        variant="secondary"
        size="sm"
        className="mt-4"
        disabled={
          !isConnected || state.queuedProjects.length === 0 || tx.isBusy
        }
        onClick={() =>
          void tx.run({
            address: COOP.registry,
            abi: coopRegistryAbi,
            functionName: "processQueue",
          })
        }
      >
        {tx.isBusy ? "Processing…" : "Process queue"}
      </Button>
      <TxLine
        status={tx.status}
        hash={tx.hash}
        error={tx.error}
        successLabel="Queue processed — projects are live on the ballot."
      />
    </Card>
  );
}

/* --------------------------------- Members -------------------------------- */

function MembersView({ state }: { state: CoopState }) {
  const { address, isConnected } = useAccount();
  const isCoordinator =
    isConnected && address?.toLowerCase() === state.coordinator.toLowerCase();
  const [newMember, setNewMember] = useState("");
  const addTx = useCoopTx();
  const removeTx = useCoopTx();
  const nameOf = (m: Address) =>
    state.memberNames[m.toLowerCase()] ?? shortenAddress(m);
  const initials = (name: string) =>
    name
      .split(/\s+/)
      .map((w) => w[0] ?? "")
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div>
      <div className="mt-6">
        <PageHeader
          title="Members"
          subtitle="One member, one vote — voting power comes from membership, not balance. The coordinator manages the roster."
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Members" value={state.memberCount} accent />
        <StatCard
          label="Coordinator"
          value={nameOf(state.coordinator)}
          sub={shortenAddress(state.coordinator)}
        />
      </div>
      <SectionTitle>Roster</SectionTitle>
      <Card className="p-0">
        {state.members.map((m) => (
          <div
            key={m}
            className="border-paper-2 flex items-center justify-between gap-3 border-b px-5 py-3 last:border-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="bg-core-orange/15 text-core-orange grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold">
                {initials(nameOf(m))}
              </span>
              <div className="min-w-0">
                <span className="text-text-standard block truncate text-sm font-semibold">
                  {nameOf(m)}
                </span>
                <a
                  href={coopAddressUrl(m)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-surface-grey hover:text-core-orange block truncate font-mono text-xs"
                >
                  {shortenAddress(m)}
                </a>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {m.toLowerCase() === state.coordinator.toLowerCase() && (
                <Chip size="small" className="text-core-orange">
                  coordinator
                </Chip>
              )}
              {isConnected && m.toLowerCase() === address?.toLowerCase() && (
                <Chip size="small" className="text-system-green">
                  you
                </Chip>
              )}
              {isCoordinator && (
                <Button
                  app="fund"
                  variant="secondary"
                  size="sm"
                  disabled={removeTx.isBusy}
                  onClick={() =>
                    void removeTx.run({
                      address: COOP.power,
                      abi: coopPowerAbi,
                      functionName: "removeMember",
                      args: [m],
                    })
                  }
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}
      </Card>
      <TxLine
        status={removeTx.status}
        hash={removeTx.hash}
        error={removeTx.error}
        successLabel="Member removed."
      />
      <SectionTitle>Add a member</SectionTitle>
      <Card>
        <Body className="text-surface-grey-2 text-sm">
          New members get exactly one vote — the same as everyone else. Only the
          coordinator ({shortenAddress(state.coordinator)}) can add or remove
          members.
        </Body>
        <div className="mt-3 flex flex-wrap gap-3">
          <input
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="0x…"
            className="border-paper-2 bg-paper-main text-text-standard focus:border-core-orange min-w-64 flex-1 rounded-xl border px-3 py-2 font-mono text-sm outline-none"
          />
          <Button
            app="fund"
            variant="primary"
            size="sm"
            disabled={
              !isCoordinator || !isAddress(newMember.trim()) || addTx.isBusy
            }
            onClick={() =>
              void addTx.run({
                address: COOP.power,
                abi: coopPowerAbi,
                functionName: "addMember",
                args: [newMember.trim() as Address],
              })
            }
          >
            {addTx.isBusy ? "Adding…" : "Add member"}
          </Button>
        </div>
        <TxLine
          status={addTx.status}
          hash={addTx.hash}
          error={addTx.error}
          successLabel="Member added — one vote, like everyone."
        />
      </Card>
    </div>
  );
}
