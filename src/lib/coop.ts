import {
  createPublicClient,
  http,
  parseAbi,
  zeroAddress,
  type Address,
} from "viem";
import { sepolia } from "viem/chains";

/**
 * The O.U.R.COOP cooperative instance — a custom-module deployment of the
 * crowdstake stack (contracts/src/examples/cova) live on Ethereum Sepolia.
 * The /coop page reads it through this module; writes go through the
 * connected wallet on the same chain.
 */

export const COOP_CHAIN = sepolia;
export const COOP_CHAIN_ID = sepolia.id;
/**
 * Read RPC for the cooperative's chain (a public, keyless Sepolia endpoint;
 * set your own for reliability). NEXT_PUBLIC_COOP_RPC_URL overrides at build
 * time (static literal so Next inlines it). Unused in demo mode.
 */
export const COOP_RPC =
  process.env.NEXT_PUBLIC_COOP_RPC_URL ||
  "https://ethereum-sepolia-rpc.publicnode.com";
const COOP_EXPLORER = "https://sepolia.etherscan.io";
/** First block of the deployment — events are scanned from here. */
const DEPLOY_BLOCK = 10875043n;

export const COOP = {
  token: "0x4fFA26B6fBa8B36b4Dd0f7CF1bf57e0FD5d1D02a",
  /** MockUSD — the Sepolia test stablecoin cUSD wraps; open faucet mint. */
  usd: "0x3C0E80004a3699698D2037e728cf33B7D156781D",
  power: "0x73Ae31EfB48F3e0D29e7acdf309783B408D3dB4C",
  registry: "0xDa9B83Ac5c9C10154B3a632C92B13584b3CC4011",
  voting: "0xC4F9956b6Aa252d12F4478919E932e601EbF678F",
  strategy: "0x2DCBC2d7F7B4Fd0F06c52bA781748c49Adc54691",
  distributionManager: "0x6d0504B381A3A04Ff9457A9CB0E64e76EfB0c6bb",
  cycleModule: "0x30524E1A1FCcc8fF613d2f19443A10d878219Ff0",
  withdrawals: "0x74Eff5B39853b2eD4300a4abE7D544304f82d171",
} as const satisfies Record<string, Address>;

export const coopTokenAbi = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function yieldAccrued() view returns (uint256)",
  "function mint(address receiver, uint256 amount)",
  "function burn(uint256 amount, address receiver)",
]);
export const coopUsdAbi = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
]);
export const coopPowerAbi = parseAbi([
  "function isMember(address) view returns (bool)",
  "function memberCount() view returns (uint256)",
  "function owner() view returns (address)",
  "function addMember(address member)",
  "function removeMember(address member)",
  "event MemberAdded(address indexed member)",
  "event MemberRemoved(address indexed member)",
]);
export const coopRegistryAbi = parseAbi([
  "function getRecipients() view returns (address[])",
  "function getQueuedAdditions() view returns (address[])",
  "function project(address) view returns ((uint256 fullBudget, uint256 minViableBudget, string title, string summary, bool exists))",
  "function registerProject(address recipient, uint256 fullBudget, uint256 minViableBudget, string title, string summary)",
  "function processQueue()",
  "function owner() view returns (address)",
  "event ProjectRegistered(address indexed project, uint256 fullBudget, uint256 minViableBudget, string title)",
]);
export const coopVotingAbi = parseAbi([
  "function getCurrentVotingDistribution() view returns (uint256[])",
  "function castVote(uint256[] points)",
  "function hasVotedInCycle(uint256 cycle, address voter) view returns (bool)",
  "event BallotRecorded(address indexed voter, uint256 indexed cycle, uint256[] points)",
]);
export const coopCycleAbi = parseAbi([
  "function getCurrentCycle() view returns (uint256)",
  "function isCycleComplete() view returns (bool)",
  "function getBlocksUntilNextCycle() view returns (uint256)",
]);
export const coopDmAbi = parseAbi([
  "function isDistributionReady() view returns (bool)",
  "function claimAndDistribute()",
]);
export const coopStrategyAbi = parseAbi([
  "event ProjectFunded(address indexed project, uint256 amount)",
  "event RoundDistributed(uint256 indexed distributionId, uint256 pool, uint256 distributed)",
]);
export const coopWithdrawalsAbi = parseAbi([
  "function getFunds() view returns (uint256[4])",
  "function withdrawalsCount() view returns (uint256)",
  "function getWithdrawal(uint256 id) view returns ((address proposer, uint8 fund, uint256 amount, address recipient, string purpose, uint8 status, uint256 votesFor, uint256 votesAgainst))",
  "function hasVoted(uint256 id, address member) view returns (bool)",
  "function proposeWithdrawal(uint8 fund, uint256 amount, address recipient, string purpose) returns (uint256)",
  "function voteWithdrawal(uint256 id, bool support)",
  "function closeWithdrawal(uint256 id)",
  "event Movement(string from, string to, uint256 amount, string kind, string note)",
  "event WithdrawalProposed(uint256 indexed id, address indexed proposer, uint8 fund, uint256 amount, address recipient, string purpose)",
  "event WithdrawalVoted(uint256 indexed id, address indexed member, bool support)",
  "event WithdrawalClosed(uint256 indexed id, uint8 status)",
]);

/** Read-only client for the cooperative's chain (independent of the wallet). */
export const coopClient = createPublicClient({
  chain: COOP_CHAIN,
  transport: http(COOP_RPC),
});

export function coopTxUrl(hash: string): string {
  return `${COOP_EXPLORER}/tx/${hash}`;
}
export function coopAddressUrl(address: string): string {
  return `${COOP_EXPLORER}/address/${address}`;
}

/* ------------------------------- Fund model ------------------------------ */

export const FUND_KEYS = [
  "reserve",
  "education",
  "solidarity",
  "production",
  "artFund",
] as const;
export type FundKey = (typeof FUND_KEYS)[number];

/**
 * Display metadata per fund — bar/badge colors sit on the DTF palette.
 * The on-chain keys are kept (reserve/education/solidarity/production/artFund)
 * so nothing downstream breaks; only the human labels are the Fund's.
 * `artFund` is the yield-fed grant pool that funding rounds distribute.
 */
export const FUNDS: Record<FundKey, { label: string; color: string }> = {
  reserve: { label: "Reserve", color: "#6d8cc9" },
  education: { label: "Shared Learning", color: "#3aa85f" },
  solidarity: { label: "Solidarity", color: "#ee7e2c" },
  production: { label: "Infrastructure", color: "#d8a13a" },
  artFund: { label: "Funding Pool", color: "#cf2626" },
};

const WITHDRAWAL_STATUS = ["voting", "approved", "rejected"] as const;
export type WithdrawalStatus = (typeof WITHDRAWAL_STATUS)[number];

/* --------------------------------- State --------------------------------- */

export interface CoopProject {
  idx: number;
  addr: Address;
  title: string;
  summary: string;
  /** cUSD (1e18-scaled on-chain; plain numbers here — display only). */
  full: number;
  minViable: number;
  points: number;
  funded: number;
}

export interface CoopWithdrawal {
  id: number;
  proposer: Address;
  fund: FundKey;
  amount: number;
  recipient: Address;
  purpose: string;
  status: WithdrawalStatus;
  votesFor: number;
  votesAgainst: number;
  iVoted: boolean;
}

export interface CoopMovement {
  when: string;
  from: string;
  to: string;
  amount: number;
  kind: string;
  note: string;
}

export interface CoopLogEntry {
  when: string;
  actor: string;
  kind: string;
  text: string;
}

export interface CoopQueuedProject {
  addr: Address;
  title: string;
  summary: string;
  full: number;
  minViable: number;
}

export interface CoopState {
  funds: Record<FundKey, number>;
  projects: CoopProject[];
  queuedProjects: CoopQueuedProject[];
  withdrawals: CoopWithdrawal[];
  cycle: number;
  cycleComplete: boolean;
  blocksLeft: number;
  ready: boolean;
  memberCount: number;
  isMember: boolean;
  /** The coordinator (owner of the membership + registry contracts). */
  coordinator: Address;
  /** Current member addresses, replayed from MemberAdded/Removed events. */
  members: Address[];
  /** Optional display names per member (lowercased address → name). */
  memberNames: Record<string, string>;
  artYield: number;
  /** Connected account's balances (0 when browsing without a wallet). */
  myCusd: number;
  myUsd: number;
  usdAllowance: number;
  movements: CoopMovement[];
  log: CoopLogEntry[];
}

const toUsd = (v: bigint): number => Number(v) / 1e18;

/** cUSD display amount → 1e18-scaled bigint (µ-precision, avoids FP drift). */
export function toCoopWei(amount: number): bigint {
  return BigInt(Math.round(amount * 1e6)) * 10n ** 12n;
}

function shortAddr(a: string): string {
  return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—";
}

/**
 * Demo mode. This fork is a showcase for the Democratic Tech Fund, so by
 * default the /coop governance app renders a rich, self-contained DTF dataset
 * with no wallet and no network — set NEXT_PUBLIC_DEMO=false to read a real
 * on-chain deployment instead.
 */
export const COOP_DEMO =
  (process.env.NEXT_PUBLIC_DEMO ?? "true").toLowerCase() !== "false";

/**
 * The full read-set the /coop page renders — mirrors what the on-chain
 * system exposes (funds, projects + current ballot tallies, withdrawals,
 * cycle/readiness, membership) plus an event-derived activity feed.
 * In demo mode it returns static DTF data instead of touching the chain.
 */
export async function fetchCoopState(account?: Address): Promise<CoopState> {
  if (COOP_DEMO) return demoCoopState(account);
  const who = account ?? zeroAddress;
  const [
    funds4,
    projAddrs,
    points,
    cycle,
    cycleComplete,
    blocksLeft,
    ready,
    memberCount,
    isMember,
    artEscrow,
    artYield,
    withdrawalsCount,
    queuedAddrs,
    coordinator,
    myCusdRaw,
    myUsdRaw,
    usdAllowanceRaw,
  ] = await Promise.all([
    coopClient.readContract({
      address: COOP.withdrawals,
      abi: coopWithdrawalsAbi,
      functionName: "getFunds",
    }),
    coopClient.readContract({
      address: COOP.registry,
      abi: coopRegistryAbi,
      functionName: "getRecipients",
    }),
    coopClient.readContract({
      address: COOP.voting,
      abi: coopVotingAbi,
      functionName: "getCurrentVotingDistribution",
    }),
    coopClient.readContract({
      address: COOP.cycleModule,
      abi: coopCycleAbi,
      functionName: "getCurrentCycle",
    }),
    coopClient.readContract({
      address: COOP.cycleModule,
      abi: coopCycleAbi,
      functionName: "isCycleComplete",
    }),
    coopClient.readContract({
      address: COOP.cycleModule,
      abi: coopCycleAbi,
      functionName: "getBlocksUntilNextCycle",
    }),
    coopClient.readContract({
      address: COOP.distributionManager,
      abi: coopDmAbi,
      functionName: "isDistributionReady",
    }),
    coopClient.readContract({
      address: COOP.power,
      abi: coopPowerAbi,
      functionName: "memberCount",
    }),
    coopClient.readContract({
      address: COOP.power,
      abi: coopPowerAbi,
      functionName: "isMember",
      args: [who],
    }),
    coopClient.readContract({
      address: COOP.token,
      abi: coopTokenAbi,
      functionName: "balanceOf",
      args: [COOP.strategy],
    }),
    coopClient.readContract({
      address: COOP.token,
      abi: coopTokenAbi,
      functionName: "yieldAccrued",
    }),
    coopClient.readContract({
      address: COOP.withdrawals,
      abi: coopWithdrawalsAbi,
      functionName: "withdrawalsCount",
    }),
    coopClient.readContract({
      address: COOP.registry,
      abi: coopRegistryAbi,
      functionName: "getQueuedAdditions",
    }),
    coopClient.readContract({
      address: COOP.power,
      abi: coopPowerAbi,
      functionName: "owner",
    }),
    coopClient.readContract({
      address: COOP.token,
      abi: coopTokenAbi,
      functionName: "balanceOf",
      args: [who],
    }),
    coopClient.readContract({
      address: COOP.usd,
      abi: coopUsdAbi,
      functionName: "balanceOf",
      args: [who],
    }),
    coopClient.readContract({
      address: COOP.usd,
      abi: coopUsdAbi,
      functionName: "allowance",
      args: [who, COOP.token],
    }),
  ]);

  const funds: Record<FundKey, number> = {
    reserve: toUsd(funds4[0]),
    education: toUsd(funds4[1]),
    solidarity: toUsd(funds4[2]),
    production: toUsd(funds4[3]),
    artFund: toUsd(artEscrow) + toUsd(artYield),
  };

  const projects: CoopProject[] = await Promise.all(
    projAddrs.map(async (addr, idx) => {
      const [p, bal] = await Promise.all([
        coopClient.readContract({
          address: COOP.registry,
          abi: coopRegistryAbi,
          functionName: "project",
          args: [addr],
        }),
        coopClient.readContract({
          address: COOP.token,
          abi: coopTokenAbi,
          functionName: "balanceOf",
          args: [addr],
        }),
      ]);
      return {
        idx,
        addr,
        title: p.title,
        summary: p.summary,
        full: toUsd(p.fullBudget),
        minViable: toUsd(p.minViableBudget),
        points: idx < points.length ? Number(points[idx]) : 0,
        funded: toUsd(bal),
      };
    }),
  );

  const withdrawals: CoopWithdrawal[] = await Promise.all(
    Array.from({ length: Number(withdrawalsCount) }, async (_, id) => {
      const [w, iVoted] = await Promise.all([
        coopClient.readContract({
          address: COOP.withdrawals,
          abi: coopWithdrawalsAbi,
          functionName: "getWithdrawal",
          args: [BigInt(id)],
        }),
        coopClient.readContract({
          address: COOP.withdrawals,
          abi: coopWithdrawalsAbi,
          functionName: "hasVoted",
          args: [BigInt(id), who],
        }),
      ]);
      return {
        id,
        proposer: w.proposer,
        fund: FUND_KEYS[Number(w.fund)] ?? "reserve",
        amount: toUsd(w.amount),
        recipient: w.recipient,
        purpose: w.purpose,
        status: WITHDRAWAL_STATUS[Number(w.status)] ?? "voting",
        votesFor: Number(w.votesFor),
        votesAgainst: Number(w.votesAgainst),
        iVoted,
      };
    }),
  );

  const queuedProjects: CoopQueuedProject[] = await Promise.all(
    queuedAddrs.map(async (addr) => {
      const p = await coopClient.readContract({
        address: COOP.registry,
        abi: coopRegistryAbi,
        functionName: "project",
        args: [addr],
      });
      return {
        addr,
        title: p.title,
        summary: p.summary,
        full: toUsd(p.fullBudget),
        minViable: toUsd(p.minViableBudget),
      };
    }),
  );

  const { movements, log, members } = await fetchActivity(projects);

  return {
    funds,
    projects,
    queuedProjects,
    withdrawals,
    cycle: Number(cycle),
    cycleComplete,
    blocksLeft: Number(blocksLeft),
    ready,
    memberCount: Number(memberCount),
    isMember,
    coordinator,
    members,
    memberNames: {},
    artYield: toUsd(artYield),
    myCusd: toUsd(myCusdRaw),
    myUsd: toUsd(myUsdRaw),
    usdAllowance: toUsd(usdAllowanceRaw),
    movements,
    log,
  };
}

/** Event-derived movements + governance log (newest first). */
async function fetchActivity(projects: CoopProject[]): Promise<{
  movements: CoopMovement[];
  log: CoopLogEntry[];
  members: Address[];
}> {
  const [evW, evS, evV, evR, evP] = await Promise.all([
    coopClient
      .getLogs({
        address: COOP.withdrawals,
        events: coopWithdrawalsAbi.filter((f) => f.type === "event"),
        fromBlock: DEPLOY_BLOCK,
        toBlock: "latest",
      })
      .catch(() => []),
    coopClient
      .getLogs({
        address: COOP.strategy,
        events: coopStrategyAbi.filter((f) => f.type === "event"),
        fromBlock: DEPLOY_BLOCK,
        toBlock: "latest",
      })
      .catch(() => []),
    coopClient
      .getLogs({
        address: COOP.voting,
        events: coopVotingAbi.filter((f) => f.type === "event"),
        fromBlock: DEPLOY_BLOCK,
        toBlock: "latest",
      })
      .catch(() => []),
    coopClient
      .getLogs({
        address: COOP.registry,
        events: coopRegistryAbi.filter((f) => f.type === "event"),
        fromBlock: DEPLOY_BLOCK,
        toBlock: "latest",
      })
      .catch(() => []),
    coopClient
      .getLogs({
        address: COOP.power,
        events: coopPowerAbi.filter((f) => f.type === "event"),
        fromBlock: DEPLOY_BLOCK,
        toBlock: "latest",
      })
      .catch(() => []),
  ]);

  const all = [...evW, ...evS, ...evV, ...evR, ...evP];

  // Timestamp lookup, one getBlock per distinct block.
  const blockNumbers = [...new Set(all.map((l) => l.blockNumber))];
  const stamps = new Map<bigint, number>();
  await Promise.all(
    blockNumbers.map(async (bn) => {
      try {
        const b = await coopClient.getBlock({ blockNumber: bn });
        stamps.set(bn, Number(b.timestamp));
      } catch {
        stamps.set(bn, 0);
      }
    }),
  );
  const when = (bn: bigint) => {
    const t = stamps.get(bn);
    return t
      ? new Date(t * 1000).toISOString().slice(0, 16).replace("T", " ")
      : `#${bn}`;
  };
  const projectTitle = (a: string) =>
    projects.find((p) => p.addr.toLowerCase() === a.toLowerCase())?.title ??
    shortAddr(a);
  const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

  all.sort((a, b) =>
    a.blockNumber === b.blockNumber
      ? a.logIndex - b.logIndex
      : Number(a.blockNumber - b.blockNumber),
  );

  const movements: CoopMovement[] = [];
  const log: CoopLogEntry[] = [];
  const memberSet = new Set<Address>();
  for (const l of all) {
    const ev = l as unknown as {
      eventName: string;
      args: Record<string, unknown>;
    };
    const args = ev.args;
    const w = when(l.blockNumber);
    switch (ev.eventName) {
      case "Movement":
        movements.push({
          when: w,
          from: String(args.from),
          to: String(args.to),
          amount: toUsd(args.amount as bigint),
          kind: String(args.kind),
          note: String(args.note ?? ""),
        });
        break;
      case "ProjectFunded": {
        const title = projectTitle(String(args.project));
        const amount = toUsd(args.amount as bigint);
        movements.push({
          when: w,
          from: "artFund",
          to: "recipient",
          amount,
          kind: "project_funding",
          note: title,
        });
        log.push({
          when: w,
          actor: "strategy",
          kind: "funded",
          text: `Funded ${title} with ${usd(amount)}`,
        });
        break;
      }
      case "RoundDistributed":
        log.push({
          when: w,
          actor: "manager",
          kind: "round",
          text: `Round #${args.distributionId} distributed ${usd(toUsd(args.distributed as bigint))} of ${usd(toUsd(args.pool as bigint))} pool`,
        });
        break;
      case "ProjectRegistered":
        log.push({
          when: w,
          actor: "coordinator",
          kind: "proposal",
          text: `Registered "${args.title}" (full ${usd(toUsd(args.fullBudget as bigint))}, min ${usd(toUsd(args.minViableBudget as bigint))})`,
        });
        break;
      case "BallotRecorded":
        log.push({
          when: w,
          actor: shortAddr(String(args.voter)),
          kind: "vote",
          text: `Cast 100-point ballot in cycle ${args.cycle}`,
        });
        break;
      case "WithdrawalProposed":
        log.push({
          when: w,
          actor: shortAddr(String(args.proposer)),
          kind: "withdrawal_proposed",
          text: `Proposed ${usd(toUsd(args.amount as bigint))} from ${FUNDS[FUND_KEYS[Number(args.fund)] ?? "reserve"].label} — ${args.purpose}`,
        });
        break;
      case "WithdrawalVoted":
        log.push({
          when: w,
          actor: shortAddr(String(args.member)),
          kind: "withdrawal_vote",
          text: `Voted ${args.support ? "for" : "against"} withdrawal #${args.id}`,
        });
        break;
      case "WithdrawalClosed":
        log.push({
          when: w,
          actor: "system",
          kind: "withdrawal_closed",
          text: `Withdrawal #${args.id} ${WITHDRAWAL_STATUS[Number(args.status)] ?? "closed"}`,
        });
        break;
      case "MemberAdded":
        memberSet.add(String(args.member).toLowerCase() as Address);
        log.push({
          when: w,
          actor: "coordinator",
          kind: "member_added",
          text: `Added member ${shortAddr(String(args.member))}`,
        });
        break;
      case "MemberRemoved":
        memberSet.delete(String(args.member).toLowerCase() as Address);
        log.push({
          when: w,
          actor: "coordinator",
          kind: "member_removed",
          text: `Removed member ${shortAddr(String(args.member))}`,
        });
        break;
    }
  }
  movements.reverse();
  log.reverse();
  return { movements, log, members: [...memberSet] };
}

/* --------------------------------- Demo ---------------------------------- */

/** Plausible member addresses for the demo roster (coordinator is first). */
const DEMO_MEMBERS = [
  "0x71C2f4a9B0E3a6D5c8149Bb7A0e6F2135e8Bd0a4",
  "0x9fA3c21D7e58B44016cC9e2d3aF71b0c2E4d6c2a",
  "0x4c88E1b52aD9F3600C7bE1a9d84C2f0913Ae9eF2",
  "0x2Db6Ac5C9c10154B3A632c92b13584B3cC4011Dd",
  "0xC4F9956b6Aa252d12F4478919e932E601EbF678F",
  "0x6d0504B381A3a04Ff9457a9CB0E64E76efb0C6bB",
  "0x30524E1a1fCcc8Ff613D2F19443a10D878219fF0",
  "0x74Eff5B39853B2Ed4300A4abE7d544304F82D171",
  "0x8bA1F109551bD432803012645Ac136ddD64DBA72",
  "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
  "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
  "0xFe9e8709d3215310075d67E3ed32A380CcF451C8",
] as const;

/** Display names for the demo roster (index-aligned with DEMO_MEMBERS). */
const DEMO_MEMBER_NAMES = [
  "Marta Ruiz",
  "Kwame Mensah",
  "Sofia Nowak",
  "Diego Fernández",
  "Aisha Okonkwo",
  "Lukas Meyer",
  "Priya Nair",
  "Elena Petrova",
  "Tomás Silva",
  "Fatima Zahra",
  "Jonas Berg",
  "Yuki Tanaka",
] as const;

const DEMO_PROJECTS: CoopProject[] = [
  {
    idx: 0,
    addr: "0x1A2b3C4d5E6f708192A3b4C5d6E7f80912345678",
    title: "Kolektiv Cloud",
    summary: "Member-run Nextcloud + collaboration suite for 40 local orgs.",
    full: 8000,
    minViable: 3500,
    points: 30,
    funded: 0,
  },
  {
    idx: 1,
    addr: "0x2B3c4D5e6F708192a3B4c5D6e7F8091234567890",
    title: "Foodsoft Rotterdam",
    summary:
      "Self-hosted food-coop ordering for 120 households, kept alive on a server in a closet.",
    full: 5000,
    minViable: 2000,
    points: 22,
    funded: 1500,
  },
  {
    idx: 2,
    addr: "0x3C4d5E6f708192A3b4C5d6E7f8091234567890Ab",
    title: "Leave-Big-Tech Clinics",
    summary: "Peer-training clinics to move communities off Big Tech platforms.",
    full: 4000,
    minViable: 1500,
    points: 20,
    funded: 0,
  },
  {
    idx: 3,
    addr: "0x4D5e6F708192a3B4c5D6e7F8091234567890aBcD",
    title: "Community Mesh Kits",
    summary: "Neighbourhood mesh-networking hardware kits with plain-language docs.",
    full: 6000,
    minViable: 2500,
    points: 16,
    funded: 0,
  },
  {
    idx: 4,
    addr: "0x5E6f708192A3b4C5d6E7f8091234567890AbCdEf",
    title: "Co-op Cloud Onboarding",
    summary: "Federated hosting infrastructure + docs so new co-ops can self-host.",
    full: 3000,
    minViable: 1200,
    points: 12,
    funded: 900,
  },
];

/**
 * A self-contained snapshot of a Democratic Tech Fund funding circle mid-cycle:
 * five community-tech proposals on the ballot, treasuries, live withdrawal
 * votes, a member roster, and an activity feed. Deterministic — no chain, no
 * wallet, no clock.
 */
function demoCoopState(account?: Address): CoopState {
  const members = DEMO_MEMBERS.map((m) => m.toLowerCase() as Address);
  const coordinator = members[0];
  const memberNames: Record<string, string> = Object.fromEntries(
    members.map((m, i) => [m, DEMO_MEMBER_NAMES[i]]),
  );
  const nameOf = (m: Address) => memberNames[m] ?? shortAddr(m);

  const funds: Record<FundKey, number> = {
    reserve: 12500,
    education: 4200,
    solidarity: 3100,
    production: 6800,
    artFund: 5400,
  };

  const withdrawals: CoopWithdrawal[] = [
    {
      id: 0,
      proposer: members[3],
      fund: "production",
      amount: 2400,
      recipient: DEMO_PROJECTS[0].addr,
      purpose:
        "Annual Gnosis RPC + off-site backups for the community clouds.",
      status: "voting",
      votesFor: 7,
      votesAgainst: 1,
      iVoted: false,
    },
    {
      id: 1,
      proposer: members[1],
      fund: "education",
      amount: 1500,
      recipient: DEMO_PROJECTS[2].addr,
      purpose: "Translate the self-hosting handbook into five languages.",
      status: "approved",
      votesFor: 10,
      votesAgainst: 2,
      iVoted: false,
    },
    {
      id: 2,
      proposer: members[5],
      fund: "solidarity",
      amount: 900,
      recipient: DEMO_PROJECTS[1].addr,
      purpose: "Emergency hosting for a deplatformed mutual-aid group.",
      status: "voting",
      votesFor: 5,
      votesAgainst: 0,
      iVoted: false,
    },
  ];

  const queuedProjects: CoopQueuedProject[] = [
    {
      addr: "0x6F708192a3B4c5D6e7F8091234567890AbCdEf01",
      title: "Encrypted Backups Circle",
      summary: "Off-site encrypted backups pooled across member organisations.",
      full: 3500,
      minViable: 1500,
    },
  ];

  const movements: CoopMovement[] = [
    {
      when: "2026-07-21 09:12",
      from: "artFund",
      to: "recipient",
      amount: 1500,
      kind: "project_funding",
      note: "Foodsoft Rotterdam",
    },
    {
      when: "2026-07-21 09:12",
      from: "artFund",
      to: "recipient",
      amount: 900,
      kind: "project_funding",
      note: "Co-op Cloud Onboarding",
    },
    {
      when: "2026-07-14 18:03",
      from: "education",
      to: "recipient",
      amount: 1500,
      kind: "withdrawal",
      note: "Handbook translations",
    },
    {
      when: "2026-07-01 12:00",
      from: "members",
      to: "reserve",
      amount: 5000,
      kind: "contribution",
      note: "New backer contributions (batch)",
    },
  ];

  const log: CoopLogEntry[] = [
    {
      when: "2026-07-21 09:12",
      actor: "strategy",
      kind: "funded",
      text: "Funded Foodsoft Rotterdam with $1,500",
    },
    {
      when: "2026-07-21 09:12",
      actor: "manager",
      kind: "round",
      text: "Round #6 distributed $2,400 of $5,400 pool",
    },
    {
      when: "2026-07-18 20:41",
      actor: nameOf(members[2]),
      kind: "vote",
      text: "Cast 100-point ballot in cycle 7",
    },
    {
      when: "2026-07-16 11:05",
      actor: nameOf(members[3]),
      kind: "withdrawal_proposed",
      text: "Proposed $2,400 from Infrastructure — Annual Gnosis RPC + backups",
    },
    {
      when: "2026-07-14 18:03",
      actor: "system",
      kind: "withdrawal_closed",
      text: "Withdrawal #1 approved",
    },
    {
      when: "2026-07-10 08:30",
      actor: nameOf(coordinator),
      kind: "member_added",
      text: `Added member ${nameOf(members[11])}`,
    },
  ];

  const isMember = account
    ? members.includes(account.toLowerCase() as Address)
    : false;

  return {
    funds,
    projects: DEMO_PROJECTS,
    queuedProjects,
    withdrawals,
    cycle: 7,
    cycleComplete: false,
    blocksLeft: 8640,
    ready: false,
    memberCount: members.length,
    isMember,
    coordinator,
    members,
    memberNames,
    artYield: 1850,
    myCusd: 0,
    myUsd: 0,
    usdAllowance: 0,
    movements,
    log,
  };
}
