import { getTranslations } from "next-intl/server";

export async function StatsBar() {
  const t = await getTranslations("stats");
  const items = [
    { label: t("freeQuota"), value: "1,000" },
    { label: t("paidFrom"), value: "$19/mo" },
    { label: t("signupApproval"), value: t("signupValue") },
    { label: t("monitorsWebhooks"), value: t("includedValue") },
  ];

  return (
    <section className="border-y border-zinc-800 bg-zinc-900/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {items.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
