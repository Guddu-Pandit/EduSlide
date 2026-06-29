export type Plan = "free" | "pro" | "team";

export const PLAN_ORDER: Plan[] = ["free", "pro", "team"];

export type PresentationLimit = { count: number } | null;

export const PLAN_LIMITS: Record<
  Plan,
  {
    label: string;
    tagline: string;
    presentationLimit: PresentationLimit;
    storageBytes: number | null;
    maxSlides: number;
    price: string;
    amountInPaise: number;
    features: string[];
  }
> = {
  free: {
    label: "Free",
    tagline: "Try it out",
    presentationLimit: { count: 2 },
    storageBytes: 50 * 1024 * 1024,
    maxSlides: 3,
    price: "₹0 / month",
    amountInPaise: 0,
    features: [
      "2 presentations / week",
      "Up to 3 slides per deck",
      "50 MB storage",
      "Standard templates",
      "Community support",
    ],
  },
  pro: {
    label: "Pro",
    tagline: "For regular use",
    presentationLimit: { count: 5 },
    storageBytes: 150 * 1024 * 1024,
    maxSlides: 8,
    price: "₹499 / month",
    amountInPaise: 49900,
    features: [
      "5 presentations / week",
      "Up to 8 slides per deck",
      "150 MB storage",
      "All templates + custom branding",
      "AI-generated speaker notes",
      "Priority email support",
    ],
  },
  team: {
    label: "Team",
    tagline: "For schools & orgs",
    presentationLimit: null,
    storageBytes: null,
    maxSlides: 15,
    price: "₹2,499 / month",
    amountInPaise: 249900,
    features: [
      "Unlimited presentations",
      "Up to 15 slides per deck",
      "Unlimited storage",
      "Shared team workspace",
      "Centralized billing",
      "Dedicated support",
    ],
  },
};

export function presentationUsage(
  limit: PresentationLimit,
  stats: { presentationsCount: number; presentationsThisWeek: number },
): { used: number; cap: number | null; label: string; pct: number } {
  if (!limit) {
    return { used: stats.presentationsCount, cap: null, label: `${stats.presentationsCount} / unlimited`, pct: 0 };
  }
  return {
    used: stats.presentationsThisWeek,
    cap: limit.count,
    label: `${stats.presentationsThisWeek} / ${limit.count} this week`,
    pct: Math.min(100, Math.round((stats.presentationsThisWeek / limit.count) * 100)),
  };
}

export function storageUsage(
  storageBytes: number | null,
  usedBytes: number,
): { cap: number | null; pct: number } {
  if (storageBytes === null) return { cap: null, pct: 0 };
  return { cap: storageBytes, pct: Math.min(100, Math.round((usedBytes / storageBytes) * 100)) };
}
