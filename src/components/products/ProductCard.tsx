import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#F0E6E9] bg-white transition hover:shadow-lg">
      <div className="relative flex h-56 items-center justify-center bg-[#F8EDF1]">
        <span
          aria-hidden="true"
          className="text-7xl"
        >
          {product.emoji}
        </span>

        {!product.available && (
          <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#8A5869]">
            No disponible
          </span>
        )}
      </div>

      <div className="p-6">
        <p className="mb-2 text-xs font-medium text-[#B84F79]">
          {product.category}
        </p>

        <h3 className="mb-2 font-serif text-2xl text-[#342B30]">
          {product.name}
        </h3>

        <p className="mb-5 min-h-12 text-sm leading-6 text-[#82747B]">
          {product.description}
        </p>

        {product.customizable && (
          <span className="mb-4 inline-block rounded-full bg-[#F8EDF1] px-3 py-1 text-xs text-[#A44E72]">
            Personalizable
          </span>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F2E9EC] pt-5">
          <div>
            {product.price !== null ? (
              <>
                <p className="text-xs text-[#82747B]">
                  Desde
                </p>
                <p className="text-xl font-semibold text-[#342B30]">
                  L {product.price.toLocaleString("es-HN")}
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold text-[#A44E72]">
                Por cotización
              </p>
            )}
          </div>

          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              product.available
                ? "bg-[#B84F79] text-white"
                : "bg-[#EEE8EA] text-[#8D8186]"
            }`}
          >
            {product.available
              ? "Ver detalles"
              : "No disponible"}
          </span>
        </div>
      </div>
    </article>
  );
}