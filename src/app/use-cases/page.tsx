import { getServerSession } from "next-auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { UseCases } from "@/components/landing/use-cases";
import { authOptions } from "@/lib/auth";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Use Cases",
  description:
    "How teams use XFlux for KOL alerts, RAG pipelines, competitive intel, webhooks, and indie projects — API plus monitors in one place.",
  path: "/use-cases",
});

export default async function UseCasesPage() {
  const session = await getServerSession(authOptions);
  const registerHref = session ? "/dashboard" : "/register?src=use_cases";

  return (
    <>
      <Header />
      <main className="pt-24 pb-8">
        <UseCases registerHref={registerHref} />
      </main>
      <Footer />
    </>
  );
}
