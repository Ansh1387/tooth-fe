export type Detection = {
  label: string;
  confidence: number; // 0..1
  bbox: [number, number, number, number]; // x,y,w,h
};

export type DetectionRun = {
  id: string;
  at: string; // ISO timestamp
  fileName: string;
  results: Detection[];
};

const STORAGE_KEY = "tooth_fe_detection_runs";

export function readRuns(): DetectionRun[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addRun(run: DetectionRun) {
  if (typeof window === "undefined") return;
  const current = readRuns();
  // keep last 50
  const next = [run, ...current].slice(0, 50);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
}

export function summarizeLabels(results: Detection[]): Record<string, number> {
  return results.reduce<Record<string, number>>((acc, r) => {
    acc[r.label] = (acc[r.label] || 0) + 1;
    return acc;
  }, {});
}
