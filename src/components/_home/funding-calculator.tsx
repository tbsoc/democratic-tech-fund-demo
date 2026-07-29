"use client";

import { useState } from "react";
import { Caption } from "@breadcoop/ui";
import { PiggyBank, UsersThree } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Compact funding estimator for the homepage: two sliders (members, average
 * contribution) and a rate assumption → the monthly funding the pooled
 * interest could sustain, in euros. Plain-language only — no tokens, no
 * lending jargon, no projection maths. Contributions stay withdrawable.
 */

const MEMBER_STOPS = [10, 20, 30, 50, 75, 100, 150, 200, 300, 500];
const CONTRIB_STOPS = [50, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000];
const RATES = [
  { label: "Cautious", note: "~4%", apy: 4 },
  { label: "Typical", note: "~7%", apy: 7 },
  { label: "Strong", note: "~10%", apy: 10 },
] as const;

const eur = (n: number) => `€${Math.round(n).toLocaleString("en-US")}`;

export function FundingCalculator() {
  const [mIdx, setMIdx] = useState(3); // 50 members
  const [cIdx, setCIdx] = useState(3); // €200 each
  const [rIdx, setRIdx] = useState(1); // typical

  const members = MEMBER_STOPS[mIdx];
  const contribution = CONTRIB_STOPS[cIdx];
  const pool = members * contribution;
  const monthly = (pool * RATES[rIdx].apy) / 100 / 12;
  const perMember = members > 0 ? monthly / members : 0;

  return (
    <div className="border-primary-jade bg-paper-0 w-full max-w-md rounded-2xl border-2 p-6 shadow-xl">
      <div className="space-y-5">
        <Slider
          label="Members"
          value={`${members}`}
          idx={mIdx}
          max={MEMBER_STOPS.length - 1}
          onChange={setMIdx}
        />
        <Slider
          label="Average contribution each"
          hint="Always theirs — withdrawable anytime"
          value={eur(contribution)}
          idx={cIdx}
          max={CONTRIB_STOPS.length - 1}
          onChange={setCIdx}
        />
        <div>
          <Caption className="text-surface-grey-2">Expected return</Caption>
          <div className="mt-2 flex gap-2">
            {RATES.map((r, i) => (
              <button
                key={r.label}
                type="button"
                aria-pressed={rIdx === i}
                onClick={() => setRIdx(i)}
                className={cn(
                  "flex-1 rounded-lg border px-2 py-1.5 text-sm font-semibold transition-colors",
                  rIdx === i
                    ? "border-core-orange bg-core-orange/10 text-core-orange"
                    : "border-paper-2 text-surface-grey-2 hover:text-text-standard",
                )}
              >
                {r.label}
                <span className="text-surface-grey ml-1 text-xs font-normal">
                  {r.note}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-paper-2 mt-5 border-t pt-5 text-center">
        <Caption className="text-surface-grey-2">
          Funding this could sustain
        </Caption>
        <p className="font-breadDisplay text-core-orange mt-1 text-4xl font-extrabold tracking-tight">
          ≈ {eur(monthly)}
          <span className="text-surface-grey text-lg font-normal"> /mo</span>
        </p>
      </div>

      <div className="bg-paper-1 mt-4 grid grid-cols-2 gap-3 rounded-xl p-4 text-center">
        <div>
          <div className="text-primary-jade flex items-center justify-center">
            <PiggyBank size={16} weight="bold" />
          </div>
          <p className="font-breadDisplay text-text-standard mt-1 font-bold">
            {eur(pool)}
          </p>
          <Caption className="text-surface-grey-2">Pooled — stays yours</Caption>
        </div>
        <div>
          <div className="text-primary-jade flex items-center justify-center">
            <UsersThree size={16} weight="bold" />
          </div>
          <p className="font-breadDisplay text-text-standard mt-1 font-bold">
            ≈ {eur(perMember)}
          </p>
          <Caption className="text-surface-grey-2">Per member /mo</Caption>
        </div>
      </div>

      <Caption className="text-surface-grey mt-4 block text-center">
        An illustration, not a promise. Contributions stay withdrawable in full.
      </Caption>
    </div>
  );
}

function Slider({
  label,
  hint,
  value,
  idx,
  max,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  idx: number;
  max: number;
  onChange: (idx: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <Caption className="text-surface-grey-2">{label}</Caption>
        <span className="font-breadDisplay text-text-standard text-xl font-bold">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={idx}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="bg-paper-2 accent-core-orange mt-2 h-2 w-full cursor-pointer appearance-none rounded-full"
      />
      {hint && (
        <Caption className="text-surface-grey mt-1 block">{hint}</Caption>
      )}
    </div>
  );
}
