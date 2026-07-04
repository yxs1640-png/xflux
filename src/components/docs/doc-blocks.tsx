import { cn } from "@/lib/utils";

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "rounded-lg bg-zinc-900 border border-zinc-800 p-4 text-sm text-zinc-300 overflow-x-auto",
        className
      )}
    >
      <code>{children.trim()}</code>
    </pre>
  );
}

interface CalloutProps {
  variant?: "info" | "warning";
  title?: string;
  children: React.ReactNode;
}

export function Callout({ variant = "info", title, children }: CalloutProps) {
  const styles =
    variant === "warning"
      ? "border-amber-500/30 bg-amber-500/5 text-amber-100/90"
      : "border-sky-500/30 bg-sky-500/5 text-zinc-300";

  return (
    <div className={cn("rounded-lg border p-4 text-sm", styles)}>
      {title && <p className="font-medium mb-2 text-white">{title}</p>}
      {children}
    </div>
  );
}

interface DocHeadingProps {
  id: string;
  level?: 2 | 3;
  children: React.ReactNode;
}

export function DocHeading({ id, level = 2, children }: DocHeadingProps) {
  const Tag = level === 2 ? "h2" : "h3";
  const className =
    level === 2
      ? "text-2xl font-semibold text-white mt-12 mb-4 scroll-mt-24"
      : "text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24";

  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  );
}
