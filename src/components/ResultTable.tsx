type Detection = {
  label: string;
  confidence: number;
  bbox: [number, number, number, number];
};

export default function ResultTable({ results }: { results: Detection[] }) {
  if (!results?.length) return null;

  return (
    <div className="overflow-x-auto border border-black/10 dark:border-white/10 rounded-md">
      <table className="min-w-full text-sm">
        <thead className="bg-black/5 dark:bg-white/10">
          <tr>
            <th className="text-left px-3 py-2">Object</th>
            <th className="text-left px-3 py-2">Confidence</th>
            <th className="text-left px-3 py-2">Coordinates [x, y, w, h]</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr key={idx} className="border-t border-black/5 dark:border-white/10">
              <td className="px-3 py-2">{r.label}</td>
              <td className="px-3 py-2">{(r.confidence * 100).toFixed(1)}%</td>
              <td className="px-3 py-2">[{r.bbox.join(", ")}]</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


