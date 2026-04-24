"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { type Plan, PLAN_LIMITS, ADMIN_EMAILS, UNLIMITED_LIMITS } from "@/lib/plan-config";

export interface PlanData {
  plan: Plan;
  isPro: boolean;
  isElite: boolean;
  isAdmin: boolean;
  scriptsUsed: number;
  scriptsLimit: number;
  thumbnailsLimit: number;
  teamMembersLimit: number;
  status: string;
  currentPeriodEnd: string | null;
  loading: boolean;
}

const DEFAULT: PlanData = {
  plan: "starter",
  isPro: false,
  isElite: false,
  isAdmin: false,
  scriptsUsed: 0,
  scriptsLimit: 4,
  thumbnailsLimit: 120,
  teamMembersLimit: 1,
  status: "active",
  currentPeriodEnd: null,
  loading: true,
};

const ADMIN_DATA: PlanData = {
  plan: "elite",
  isPro: true,
  isElite: true,
  isAdmin: true,
  scriptsUsed: 0,
  scriptsLimit: UNLIMITED_LIMITS.scripts,
  thumbnailsLimit: UNLIMITED_LIMITS.thumbnails,
  teamMembersLimit: UNLIMITED_LIMITS.teamMembers,
  status: "active",
  currentPeriodEnd: null,
  loading: false,
};

export function usePlan(): PlanData {
  const [data, setData] = useState<PlanData>(DEFAULT);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setData({ ...DEFAULT, loading: false }); return; }

      // Admin accounts get unlimited access immediately — no DB query needed
      if (user.email && ADMIN_EMAILS.has(user.email)) {
        setData(ADMIN_DATA);
        return;
      }

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [subResult, scriptsResult] = await Promise.all([
        supabase
          .from("user_subscriptions")
          .select("plan, status, current_period_end")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("scripts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", startOfMonth.toISOString()),
      ]);

      const plan: Plan = (subResult.data?.plan as Plan) ?? "starter";
      const limits = PLAN_LIMITS[plan];

      setData({
        plan,
        isPro: limits.isPro,
        isElite: limits.isElite,
        isAdmin: false,
        scriptsUsed: scriptsResult.count ?? 0,
        scriptsLimit: limits.scripts,
        thumbnailsLimit: limits.thumbnails,
        teamMembersLimit: limits.teamMembers,
        status: subResult.data?.status ?? "active",
        currentPeriodEnd: subResult.data?.current_period_end ?? null,
        loading: false,
      });
    }

    load();
  }, []);

  return data;
}
