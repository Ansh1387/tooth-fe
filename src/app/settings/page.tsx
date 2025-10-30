"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-white/70">
            Dark mode is always enabled.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model Version</CardTitle>
        </CardHeader>
        <CardContent>
          <select className="border border-input rounded-md px-3 py-2 bg-transparent">
            <option className="bg-black text-white">v1.0 (current)</option>
            <option className="bg-black text-white">v0.9</option>
          </select>
        </CardContent>
      </Card>
    </div>
  );
}
