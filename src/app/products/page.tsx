import { PageShell } from "@/components/PageShell";
import { ProductsExplorer } from "@/components/ProductsExplorer";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ search?: string; category?: string }> }) {
  const params = await searchParams;
  return <PageShell><ProductsExplorer initialSearch={params.search ?? ""} initialCategory={params.category ?? "All Products"} /></PageShell>;
}
