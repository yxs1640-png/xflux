import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DocsSidebar } from "@/components/docs/docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            <DocsSidebar />
            <article className="flex-1 min-w-0 max-w-3xl">{children}</article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
