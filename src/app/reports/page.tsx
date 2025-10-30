"use client";

import { useEffect, useMemo, useState } from "react";
import { readRuns, summarizeLabels, type DetectionRun } from "@/lib/history";

export default function ReportsPage() {
  const [runs, setRuns] = useState<DetectionRun[]>([]);

  useEffect(() => {
    setRuns(readRuns());
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-xl font-semibold">Reports</div>
          <div className="text-sm text-black/60 dark:text-white/60">
            History of your recent analyses
          </div>
        </div>
        <a
          href="/detection"
          className="text-xs underline opacity-70 hover:opacity-100"
        >
          New Analysis
        </a>
      </div>

      {!runs.length ? (
        <div className="text-sm text-black/60 dark:text-white/60">
          No reports yet
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {runs.map((r) => {
            const counts = summarizeLabels(r.results || []);
            const total = r.results?.length || 0;
            return (
              <div
                key={r.id}
                className="p-4 rounded-lg border border-black/10 dark:border-white/10 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {r.fileName}
                    </div>
                    <div className="text-xs text-black/60 dark:text-white/60">
                      {new Date(r.at).toLocaleString()} • {total} detections
                    </div>
                  </div>
                  <div className="w-24 h-6 rounded bg-black/5 dark:bg-white/10 flex items-center justify-center text-[10px] text-black/60 dark:text-white/60">
                    X-ray
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.keys(counts).length ? (
                    Object.entries(counts).map(([label, count]) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-black/10 dark:border-white/15 text-xs"
                      >
                        <span className="font-medium">{label}</span>
                        <span className="rounded-full bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-[10px]">
                          {count}
                        </span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-black/60 dark:text-white/60">
                      No issues
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
