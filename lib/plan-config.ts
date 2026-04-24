export type Plan = "starter" | "pro" | "elite";

export interface PlanLimits {
  scripts: number;
  thumbnails: number;
  teamMembers: number;
  isPro: boolean;
  isElite: boolean;
  label: string;
  priceMonthly: number;
  priceAnnual: number;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  starter: { scripts: 4,  thumbnails: 120, teamMembers: 1,  isPro: false, isElite: false, label: "Starter",  priceMonthly: 9.99,  priceAnnual: 7.99  },
  pro:     { scripts: 15, thumbnails: 300, teamMembers: 5,  isPro: true,  isElite: false, label: "Pro",      priceMonthly: 29.99, priceAnnual: 23.99 },
  elite:   { scripts: 30, thumbnails: 600, teamMembers: 10, isPro: true,  isElite: true,  label: "Elite AI", priceMonthly: 99.99, priceAnnual: 79.99 },
};

// These accounts have unlimited access to every feature regardless of DB plan.
export const ADMIN_EMAILS: ReadonlySet<string> = new Set([
  "ukamakaene@gmail.com",
  "townshub1@gmail.com",
  "eneonyeka32@gmail.com",
  "childrenfromlight@gmail.com",
]);

export const UNLIMITED_LIMITS: PlanLimits = {
  scripts: 999999,
  thumbnails: 999999,
  teamMembers: 999999,
  isPro: true,
  isElite: true,
  label: "Unlimited",
  priceMonthly: 0,
  priceAnnual: 0,
};

/** Returns the Stripe Price ID for the given plan + billing cycle from env vars. */
export function getStripePriceId(plan: Plan, billing: "monthly" | "annual"): string {
  const key = `STRIPE_PRICE_${plan.toUpperCase()}_${billing.toUpperCase()}`;
  return process.env[key] ?? "";
}
