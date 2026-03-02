import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function getAECBCategory(score: number | null | undefined): string {
  if (!score) return "—";
  if (score >= 750) return "VHS";
  if (score >= 700) return "HS";
  if (score >= 620) return "MS";
  if (score >= 560) return "LS";
  return "VLS";
}

export function getAECBColor(score: number | null | undefined): string {
  if (!score) return "text-slate-400";
  if (score >= 750) return "text-green-600";
  if (score >= 700) return "text-emerald-500";
  if (score >= 620) return "text-amber-500";
  if (score >= 560) return "text-orange-500";
  return "text-red-600";
}

export function getDBRStatus(ratio: number | string | null | undefined): { eligible: boolean; label: string } {
  const r = Number(ratio ?? 0);
  return { eligible: r <= 50, label: `${r.toFixed(1)}%` };
}

export function getLeadQualityBadge(quality: string | null | undefined) {
  const map: Record<string, { label: string; class: string }> = {
    hot: { label: "Hot 🔥", class: "bg-red-100 text-red-700" },
    warm: { label: "Warm 🌤️", class: "bg-amber-100 text-amber-700" },
    cold: { label: "Cold ❄️", class: "bg-blue-100 text-blue-700" },
  };
  return map[quality ?? "cold"] ?? map.cold;
}
