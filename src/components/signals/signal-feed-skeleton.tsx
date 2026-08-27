import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SignalTopicConfig } from "@/lib/signals/topics";

type SignalFeedSkeletonProps = {
  topic?: SignalTopicConfig;
};

export function SignalFeedSkeleton({ topic }: SignalFeedSkeletonProps) {
  return (
    <div className="animate-pulse">
      <Card className="mb-8 border-zinc-800">
        <CardHeader className="space-y-3">
          <div className="h-6 w-24 rounded bg-zinc-800" />
          <div className="h-5 w-full max-w-lg rounded bg-zinc-800" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-6 w-28 rounded-full bg-zinc-800" />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-zinc-800" />
            <div className="h-4 w-5/6 rounded bg-zinc-800" />
            <div className="h-4 w-4/6 rounded bg-zinc-800" />
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-28 rounded bg-zinc-800" />
        <div className="h-4 w-16 rounded bg-zinc-800" />
      </div>

      <div className="space-y-4 mb-12">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="py-5 space-y-3">
              <div className="h-4 w-40 rounded bg-zinc-800" />
              <div className="h-4 w-full rounded bg-zinc-800" />
              <div className="h-4 w-11/12 rounded bg-zinc-800" />
            </CardContent>
          </Card>
        ))}
      </div>

      {topic && (
        <p className="text-center text-sm text-zinc-500 mb-8">
          Loading live {topic.pulseLabel.toLowerCase()} signals…
        </p>
      )}
    </div>
  );
}
