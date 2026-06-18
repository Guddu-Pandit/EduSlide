export type Plan = "free" | "pro" | "team";

export const PLAN_LIMITS: Record<
  Plan,
  { label: string; presentationsPerMonth: number | null; storageBytes: number; price: string }
> = {
  free: {
    label: "Free",
    presentationsPerMonth: 5,
    storageBytes: 250 * 1024 * 1024,
    price: "$0 / month",
  },
  pro: {
    label: "Pro",
    presentationsPerMonth: null,
    storageBytes: 5 * 1024 * 1024 * 1024,
    price: "$12 / month",
  },
  team: {
    label: "Team",
    presentationsPerMonth: null,
    storageBytes: 20 * 1024 * 1024 * 1024,
    price: "$39 / month",
  },
};
