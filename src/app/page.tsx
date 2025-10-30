"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function ping() {
      try {
        // Quick check: attempt OPTIONS to /detect or GET /
        await axios.get("http://localhost:8080/", { timeout: 1500 });
        if (!cancelled) setApiOk(true);
      } catch {
        if (!cancelled) setApiOk(false);
      }
    }
    ping();
    const t = setInterval(ping, 5000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-black/10 dark:border-white/10">
          <div className="text-sm text-black/60 dark:text-white/60">API Status</div>
          <div className="mt-2 text-lg font-semibold">
            {apiOk === null ? "Checking..." : apiOk ? "Connected" : "Disconnected"}
          </div>
        </div>
        <div className="p-4 rounded-lg border border-black/10 dark:border-white/10">
          <div className="text-sm text-black/60 dark:text-white/60">Images Scanned</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
        </div>
        <div className="p-4 rounded-lg border border-black/10 dark:border-white/10">
          <div className="text-sm text-black/60 dark:text-white/60">Diseases Detected</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 rounded-lg border border-black/10 dark:border-white/10">
          <div className="font-medium mb-2">Overview</div>
          <p className="text-sm text-black/70 dark:text-white/70">
            Welcome to DentalXrayAI. Use the Detection page to upload a dental
            X-ray and view predicted bounding boxes with confidence scores.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-black/10 dark:border-white/10">
          <div className="font-medium mb-2">Quick Tips</div>
          <ul className="list-disc pl-4 text-sm space-y-1">
            <li>Use clear X-ray images for best results.</li>
            <li>Results appear in a table; overlay can be enabled on Detection.</li>
            <li>Reports page keeps a simple history (dummy data).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
