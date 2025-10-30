"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { readRuns, summarizeLabels, type DetectionRun } from "@/lib/history";

export default function Home() {
  const [apiOk, setApiOk] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    images: 0,
    detections: 0,
    top: [] as Array<[string, number]>,
  });
  const [recent, setRecent] = useState<DetectionRun[]>([]);

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

  useEffect(() => {
    // hydrate stats from local history
    const runs = readRuns();
    const images = runs.length;
    const detections = runs.reduce(
      (sum, r) => sum + (r.results?.length || 0),
      0
    );
    const labelCounts = runs.reduce((acc, r) => {
      const labels = summarizeLabels(r.results || []);
      for (const k of Object.keys(labels)) acc[k] = (acc[k] || 0) + labels[k];
      return acc;
    }, {} as Record<string, number>);
    const top = Object.entries(labelCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    setStats({ images, detections, top });
    setRecent(runs.slice(0, 5));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-black/10 dark:border-white/10 shadow-sm bg-gradient-to-br from-black/5 to-transparent dark:from-white/5">
          <div className="text-xs uppercase tracking-wide text-black/60 dark:text-white/60">
            API Status
          </div>
          <div className="mt-2 text-xl font-semibold">
            {apiOk === null
              ? "Checking..."
              : apiOk
              ? "Connected"
              : "Disconnected"}
          </div>
          <div
            className={`mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs ${
              apiOk
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
            }`}
          >
            {apiOk ? "Healthy" : "Unavailable"}
          </div>
        </div>
        <div className="p-4 rounded-lg border border-black/10 dark:border-white/10 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-black/60 dark:text-white/60">
            Images Scanned
          </div>
          <div className="mt-2 text-3xl font-semibold">{stats.images}</div>
          <div className="mt-3 h-1.5 bg-black/10 dark:bg-white/10 rounded">
            <div
              className="h-1.5 rounded bg-black/40 dark:bg-white/40"
              style={{ width: `${Math.min(100, stats.images * 10)}%` }}
            />
          </div>
        </div>
        <div className="p-4 rounded-lg border border-black/10 dark:border-white/10 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-black/60 dark:text-white/60">
            Detections
          </div>
          <div className="mt-2 text-3xl font-semibold">{stats.detections}</div>
          <div className="mt-3 h-1.5 bg-black/10 dark:bg-white/10 rounded">
            <div
              className="h-1.5 rounded bg-black/40 dark:bg-white/40"
              style={{ width: `${Math.min(100, stats.detections * 5)}%` }}
            />
          </div>
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
          <div className="font-medium mb-2">Top Labels</div>
          {stats.top.length ? (
            <div className="flex flex-wrap gap-2">
              {stats.top.map(([label, count]) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-black/10 dark:border-white/15 text-xs"
                >
                  <span className="font-medium">{label}</span>
                  <span className="rounded-full bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-[10px]">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <div className="text-sm text-black/60 dark:text-white/60">
              No data yet
            </div>
          )}
        </div>
      </div>

      <div className="p-4 rounded-lg border border-black/10 dark:border-white/10">
        <div className="font-medium mb-3">Recent Activity</div>
        {!recent.length ? (
          <div className="text-sm text-black/60 dark:text-white/60">
            No recent runs
          </div>
        ) : (
          <div className="divide-y divide-black/5 dark:divide-white/10">
            {recent.map((r) => (
              <div
                key={r.id}
                className="py-2 flex items-center justify-between"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">
                    {r.fileName}
                  </div>
                  <div className="text-xs text-black/60 dark:text-white/60">
                    {new Date(r.at).toLocaleString()} • {r.results.length}{" "}
                    detections
                  </div>
                </div>
                <a
                  href="/reports"
                  className="text-xs underline opacity-70 hover:opacity-100"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
