import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import ProductDetail from "@/components/products/ProductDetails";
import { products } from "@/data/products";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FFFCFB] text-[#342B30]">
      <Header />
      <ProductDetail product={product} />
    </div>
  );
}