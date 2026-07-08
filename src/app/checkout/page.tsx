import { CheckoutView } from "@/components/CheckoutView";
import { PageShell } from "@/components/PageShell";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; productId?: string }>;
}) {
  const params = await searchParams;
  return (
    <PageShell>
      <CheckoutView
        mode={params.mode === "quote" ? "quote" : "order"}
        productId={params.productId}
      />
    </PageShell>
  );
}
