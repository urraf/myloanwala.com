"use client";

import Link from "next/link";
import { useState } from "react";
import { formatINR } from "@/lib/site";

type Props = {
  amount?: number;
  rate?: number;
  years?: number;
  maxAmount?: number;
  maxYears?: number;
  applyHref?: string;
};

export function calcEmi(p: number, annualRate: number, months: number) {
  const r = annualRate / 12 / 100;
  if (!r) return p / months;
  return (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function Field({
  label, value, display, min, max, step, onChange,
}: {
  label: string; value: number; display: string; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-body">{label}</span>
        <span className="rounded-lg bg-soft px-3 py-1 text-sm font-semibold text-brand">{display}</span>
      </div>
      <input
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, var(--color-brand) ${((value - min) / (max - min)) * 100}%, var(--color-soft-2) 0)` }}
      />
      <div className="mt-1 flex justify-between text-[11px] text-muted">
        <span>{min.toLocaleString("en-IN")}</span>
        <span>{max.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}

export default function EmiCalculator({
  amount = 500000, rate = 11, years = 3, maxAmount = 5000000, maxYears = 30, applyHref = "/apply",
}: Props) {
  const [p, setP] = useState(amount);
  const [r, setR] = useState(rate);
  const [y, setY] = useState(years);

  const months = y * 12;
  const emi = calcEmi(p, r, months);
  const total = emi * months;
  const interest = total - p;
  const principalPct = (p / total) * 100;

  return (
    <div className="card grid gap-8 p-5 shadow-sm sm:p-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-7">
        <Field label="Loan Amount" value={p} display={formatINR(p)} min={50000} max={maxAmount} step={10000} onChange={setP} />
        <Field label="Interest Rate (p.a.)" value={r} display={`${r}%`} min={5} max={30} step={0.05} onChange={(v) => setR(Number(v.toFixed(2)))} />
        <Field label="Loan Tenure" value={y} display={`${y} ${y > 1 ? "Years" : "Year"}`} min={1} max={maxYears} step={1} onChange={setY} />
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl bg-soft p-6 text-center">
        <p className="text-sm text-body">Your Monthly EMI</p>
        <p className="mt-1 text-3xl font-bold text-navy">{formatINR(emi)}</p>
        <div
          className="relative mt-6 h-36 w-36 rounded-full"
          style={{ background: `conic-gradient(var(--color-brand) 0 ${principalPct}%, var(--color-accent) ${principalPct}% 100%)` }}
        >
          <div className="absolute inset-5 rounded-full bg-soft" />
        </div>
        <div className="mt-6 w-full space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-brand" /> Principal</span>
            <b>{formatINR(p)}</b>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-accent" /> Total Interest</span>
            <b>{formatINR(interest)}</b>
          </div>
          <div className="flex justify-between border-t border-soft-2 pt-2">
            <span>Total Payable</span>
            <b>{formatINR(total)}</b>
          </div>
        </div>
        <Link href={applyHref} className="btn-primary mt-6 w-full">Apply Now</Link>
      </div>
    </div>
  );
}
