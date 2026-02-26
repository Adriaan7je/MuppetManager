"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Check } from "lucide-react";
import { updateGameSettings } from "@/actions/settings";
import { changePassword } from "@/actions/settings";
import type { GameSettings } from "@/types";

export function SettingsForm({ settings }: { settings: GameSettings }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [pwPending, startPwTransition] = useTransition();
  const [pwMessage, setPwMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function handleBudgetSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateGameSettings({
        firstXIBudget: Number(fd.get("firstXIBudget")),
        benchBudget: Number(fd.get("benchBudget")),
        reservesBudget: Number(fd.get("reservesBudget")),
        costBase: Number(fd.get("costBase")),
        costExponent: Number(fd.get("costExponent")),
        costBaseRating: Number(fd.get("costBaseRating")),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startPwTransition(async () => {
      const result = await changePassword({
        currentPassword: fd.get("currentPassword") as string,
        newPassword: fd.get("newPassword") as string,
      });
      if (result.error) {
        setPwMessage({ type: "error", text: result.error });
      } else {
        setPwMessage({ type: "success", text: "Password changed successfully" });
        (e.target as HTMLFormElement).reset();
      }
      setTimeout(() => setPwMessage(null), 3000);
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Budget Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBudgetSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstXIBudget">First XI Budget</Label>
              <Input
                id="firstXIBudget"
                name="firstXIBudget"
                type="number"
                defaultValue={settings.firstXIBudget}
                step="1000000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="benchBudget">Bench Budget</Label>
              <Input
                id="benchBudget"
                name="benchBudget"
                type="number"
                defaultValue={settings.benchBudget}
                step="1000000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reservesBudget">Reserves Budget</Label>
              <Input
                id="reservesBudget"
                name="reservesBudget"
                type="number"
                defaultValue={settings.reservesBudget}
                step="1000000"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="costBase">Cost Base</Label>
              <Input
                id="costBase"
                name="costBase"
                type="number"
                defaultValue={settings.costBase}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costExponent">Cost Exponent</Label>
              <Input
                id="costExponent"
                name="costExponent"
                type="number"
                step="0.01"
                defaultValue={settings.costExponent}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costBaseRating">Cost Base Rating</Label>
              <Input
                id="costBaseRating"
                name="costBaseRating"
                type="number"
                defaultValue={settings.costBaseRating}
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : saved ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {saved ? "Saved!" : "Save Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                minLength={6}
                required
              />
            </div>

            {pwMessage && (
              <div
                className={`rounded-lg px-3 py-2 text-sm ${
                  pwMessage.type === "error"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-emerald-500/10 text-emerald-500"
                }`}
              >
                {pwMessage.text}
              </div>
            )}

            <Button type="submit" disabled={pwPending}>
              {pwPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
