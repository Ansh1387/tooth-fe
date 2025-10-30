"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    setDark((d) => !d);
    const root = document.documentElement;
    root.classList.toggle("dark");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Switch id="theme" checked={dark} onCheckedChange={toggleTheme} />
            <Label htmlFor="theme">Enable dark mode</Label>
          </div>
          <div className="text-xs text-black/60 dark:text-white/60 mt-2">
            For full theming with persistence, integrate next-themes.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model Version</CardTitle>
        </CardHeader>
        <CardContent>
          <select className="border border-input rounded-md px-3 py-2 bg-transparent">
            <option className="bg-white text-black">v1.0 (current)</option>
            <option className="bg-white text-black">v0.9</option>
          </select>
        </CardContent>
      </Card>
    </div>
  );
}


