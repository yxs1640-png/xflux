import { Key, Rocket, Terminal } from "lucide-react";

const STEPS = [
  {
    icon: Rocket,
    title: "Create a free account",
    description: "Sign up in under a minute. No credit card, no approval wait.",
  },
  {
    icon: Key,
    title: "Copy your API key",
    description: "Your key is ready instantly in the dashboard. Use it in the Authorization header.",
  },
  {
    icon: Terminal,
    title: "Make your first call",
    description: "Fetch a profile, search tweets, or add an account monitor — follow the quickstart.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Up and running in 3 steps
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            From signup to your first API call in minutes.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="relative text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-sky-400">
                <step.icon className="h-6 w-6" />
              </div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Step {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
