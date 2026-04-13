"use client";

import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      <Topbar title="Team" />
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <Card>
          <CardBody className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mx-auto">
              <Users size={28} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-[family-name:var(--font-syne)]">Team Collaboration</h2>
              <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                Invite team members, assign roles, and collaborate on scripts, thumbnails, and production tasks — all in one workspace.
              </p>
            </div>
            <div className="flex items-center justify-center gap-1 text-xs text-yellow-400">
              <Lock size={12} />
              <span className="font-semibold font-[family-name:var(--font-syne)]">Available on Pro & Elite plans</span>
            </div>
            <Link href="/dashboard/billing">
              <Button icon={<Crown size={14} />} variant="coral">
                Upgrade to Pro
                <ArrowRight size={13} />
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
