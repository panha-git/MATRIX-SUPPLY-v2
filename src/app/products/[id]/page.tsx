import { PageShell } from "@/components/PageShell";
import { ProductDetailView } from "@/components/ProductDetailView";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PageShell>
      <ProductDetailView productId={id} />
    </PageShell>
  );
}
