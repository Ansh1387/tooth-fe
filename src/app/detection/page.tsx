"use client";

import { useRef, useState, useEffect } from "react";
import axios from "axios";
import ResultTable from "@/components/ResultTable";
import { addRun, type Detection as SavedDetection } from "@/lib/history";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Detection = {
  label: string;
  confidence: number;
  bbox: [number, number, number, number];
};

export default function DetectionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Detection[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [test, setTest] = useState("");

  const onTest = async () => {
    try {
      const res = await axios.get("/api/test");
      setTest(res.data?.message ?? "");
    } catch (e: any) {
      const status = e?.response?.status;
      const body = e?.response?.data;
      setTest(`Error ${status ?? ""} ${body?.message ?? ""}`.trim());
    }
  };

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    // draw boxes if preview and results
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !preview) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      const w = img!.naturalWidth;
      const h = img!.naturalHeight;
      canvas!.width = w;
      canvas!.height = h;
      ctx!.clearRect(0, 0, w, h);
      ctx!.lineWidth = 2;
      ctx!.strokeStyle = "#22c55e";
      ctx!.font = "14px sans-serif";
      ctx!.fillStyle = "#22c55e";
      results.forEach((r) => {
        const [x, y, bw, bh] = r.bbox;
        ctx!.strokeRect(x, y, bw, bh);
        const label = `${r.label} ${(r.confidence * 100).toFixed(1)}%`;
        ctx!.fillText(label, x + 4, Math.max(14, y - 4));
      });
    }

    if (img!.complete) draw();
    else img!.onload = () => draw();
  }, [results, preview]);

  async function onDetect() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const form = new FormData();
      form.append("image_file", file);
      const res = await axios.post("/api/detect", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Normalize backend response to { label, confidence, bbox: [x,y,w,h] }
      const raw = res.data?.detections ?? res.data ?? [];
      const normalized = Array.isArray(raw)
        ? raw.map((item: any) => {
            // If already in object shape, pass through
            if (
              item &&
              typeof item === "object" &&
              Array.isArray(item.bbox) &&
              typeof item.label === "string" &&
              typeof item.confidence === "number"
            ) {
              return item;
            }
            // Flask returns: [x1,y1,x2,y2,label,prob%]
            if (Array.isArray(item) && item.length >= 6) {
              const [x1, y1, x2, y2, label, probStr] = item;
              const w = Math.max(0, (Number(x2) || 0) - (Number(x1) || 0));
              const h = Math.max(0, (Number(y2) || 0) - (Number(y1) || 0));
              const probNum =
                typeof probStr === "string"
                  ? Math.min(1, Math.max(0, parseFloat(probStr) / 100))
                  : typeof probStr === "number"
                  ? Math.min(1, Math.max(0, probStr))
                  : 0;
              return {
                label: String(label ?? ""),
                confidence: probNum,
                bbox: [Number(x1) || 0, Number(y1) || 0, w, h] as [
                  number,
                  number,
                  number,
                  number
                ],
              };
            }
            // Fallback safe empty
            return { label: "", confidence: 0, bbox: [0, 0, 0, 0] };
          })
        : [];
      setResults(normalized);
      try {
        const run = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          at: new Date().toISOString(),
          fileName: file.name ?? "unknown",
          results: normalized as SavedDetection[],
        };
        addRun(run);
      } catch {
        // ignore persistence errors
      }
    } catch (e: any) {
      setError(e?.message || "Detection failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Upload X-ray</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button onClick={onDetect} disabled={!file || loading}>
              {loading ? "Detecting..." : "Detect"}
            </Button>
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
        {preview && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="relative">
                <img
                  ref={imgRef}
                  src={preview}
                  alt="preview"
                  className="block w-full h-auto"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultTable results={results} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
