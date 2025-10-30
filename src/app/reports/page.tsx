export default function ReportsPage() {
  const items = [
    {
      id: 1,
      thumb: "https://via.placeholder.com/80x60?text=Xray",
      summary: "Cavity detected (2)",
      date: "2025-10-30",
    },
    {
      id: 2,
      thumb: "https://via.placeholder.com/80x60?text=Xray",
      summary: "No issues",
      date: "2025-10-29",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="font-medium">Recent Analyses</div>
      <div className="grid grid-cols-1 gap-3">
        {items.map((i) => (
          <div
            key={i.id}
            className="flex items-center gap-3 p-3 border border-black/10 dark:border-white/10 rounded-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.thumb} alt="thumb" className="w-20 h-14 object-cover rounded" />
            <div className="flex-1">
              <div className="text-sm font-medium">{i.summary}</div>
              <div className="text-xs text-black/60 dark:text-white/60">{i.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


