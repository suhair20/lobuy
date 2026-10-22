import ProductView from "@/components/product/ProductView";

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductView productId={params.id} />;
}
