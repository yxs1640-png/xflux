import { Key, Rocket, Terminal } from "lucide-react";
import { getTranslations } from "next-intl/server";

const STEP_ICONS = [Rocket, Key, Terminal] as const;

export async function HowItWorks() {
  const t = await getTranslations("howItWorks");
  const steps = [
    { title: t("step1Title"), description: t("step1Desc") },
    { title: t("step2Title"), description: t("step2Desc") },
    { title: t("step3Title"), description: t("step3Desc") },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-sky-400">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {t("stepLabel", { n: index + 1 })}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
