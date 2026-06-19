export type Plan = "free" | "pro" | "team";

export const PLAN_ORDER: Plan[] = ["free", "pro", "team"];

export const PLAN_LIMITS: Record<
  Plan,
  {
    label: string;
    presentationsPerMonth: number | null;
    storageBytes: number;
    price: string;
    features: string[];
  }
> = {
  free: {
    label: "Free",
    presentationsPerMonth: 5,
    storageBytes: 250 * 1024 * 1024,
    price: "$0 / month",
    features: [
      "5 presentations / month",
      "250 MB storage",
      "Standard templates",
      "Community support",
    ],
  },
  pro: {
    label: "Pro",
    presentationsPerMonth: null,
    storageBytes: 5 * 1024 * 1024 * 1024,
    price: "$12 / month",
    features: [
      "Unlimited presentations",
      "5 GB storage",
      "All templates + custom branding",
      "AI-generated speaker notes",
      "Priority email support",
    ],
  },
  team: {
    label: "Team",
    presentationsPerMonth: null,
    storageBytes: 20 * 1024 * 1024 * 1024,
    price: "$39 / month",
    features: [
      "Everything in Pro",
      "20 GB storage",
      "Shared team workspace",
      "Centralized billing",
      "Dedicated support",
    ],
  },
};
