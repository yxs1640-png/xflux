export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 rounded bg-zinc-800" />
        <div className="h-4 w-72 rounded bg-zinc-800" />
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
            <div className="h-4 w-24 rounded bg-zinc-800" />
            <div className="h-9 w-20 rounded bg-zinc-800" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
        <div className="h-5 w-32 rounded bg-zinc-800" />
        <div className="h-48 rounded bg-zinc-800" />
      </div>
    </div>
  );
}
