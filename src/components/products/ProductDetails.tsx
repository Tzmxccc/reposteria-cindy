"use client";

import { useCart } from "@/components/cart/CartProvider";
import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
};

export default function ProductDetail({ product }: Props) {
  const { addItem } = useCart();

const [quantity, setQuantity] = useState(1);
const [addedMessage, setAddedMessage] = useState("");
  const [selectedSizeId, setSelectedSizeId] = useState(
    product.sizes[0]?.id ?? ""
  );

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const [instructions, setInstructions] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const selectedSize = product.sizes.find(
    (size) => size.id === selectedSizeId
  );

  const currentPrice = selectedSize?.price ?? product.price;

  const hasImages = product.images.length > 0;
  const handleAddToCart = () => {
  if (
    !product.available ||
    currentPrice === null ||
    !Number.isFinite(currentPrice) ||
    currentPrice < 0 ||
    !Number.isSafeInteger(quantity) ||
    quantity < 1
  ) {
    return;
  }

  const selectedOptionDetails = product.options
    .filter((option) => selectedOptions[option.id])
    .map((option) => ({
      optionId: option.id,
      optionName: option.name,
      choice: selectedOptions[option.id],
    }));

  // Identifica la configuración del producto.
  const configurationKey = JSON.stringify({
    productId: product.id,
    sizeId: selectedSizeId || null,
    selectedOptions: [...selectedOptionDetails].sort(
      (a, b) => a.optionId.localeCompare(b.optionId)
    ),
    specialInstructions: instructions.trim(),
  });

  addItem({
    cartItemId: configurationKey,
    productId: product.id,
    productName: product.name,
    productImage: product.images[0] ?? null,
    sizeId: selectedSizeId || null,
    sizeName: selectedSize?.name ?? null,
    selectedOptions: selectedOptionDetails,
    specialInstructions: instructions.trim(),
    quantity,
    unitPrice: currentPrice,
  });

  setAddedMessage("¡Producto añadido al carrito!");
};

  const formatPrice = (price: number) =>
    `L ${price.toLocaleString("es-HN")}`;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:px-8">
      <nav className="mb-10 text-sm text-[#82747B]">
        <Link href="/" className="hover:text-[#B84F79]">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link href="/catalogo" className="hover:text-[#B84F79]">
          Catálogo
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#342B30]">{product.name}</span>
      </nav>

      <div className="grid gap-12 md:grid-cols-2">
        {/* GALERÍA */}
        <section>
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-[#F8EDF1]">
            {hasImages ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span aria-hidden="true" className="text-9xl">
                {product.emoji}
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {product.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                  aria-pressed={selectedImage === index}
                  className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${
                    selectedImage === index
                      ? "border-[#B84F79]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name}, vista ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* INFORMACIÓN */}
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B84F79]">
            {product.category}
          </p>

          <h1 className="mb-5 font-serif text-4xl text-[#342B30] md:text-5xl">
            {product.name}
          </h1>

          <p className="mb-6 leading-8 text-[#766A70]">
            {product.description}
          </p>

          <div className="mb-8">
            {product.available ? (
              <span className="rounded-full bg-[#EDF7F0] px-4 py-2 text-xs font-semibold text-[#35734A]">
                Disponible para solicitar
              </span>
            ) : (
              <span className="rounded-full bg-[#F2E9EC] px-4 py-2 text-xs font-semibold text-[#8D5368]">
                No disponible
              </span>
            )}
          </div>

          <div className="mb-8 border-y border-[#F0E6E9] py-6">
            {currentPrice !== null ? (
              <>
                <p className="mb-1 text-sm text-[#82747B]">
                  Precio
                </p>
                <p className="text-3xl font-semibold text-[#342B30]">
                  {formatPrice(currentPrice)}
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-semibold text-[#B84F79]">
                  Precio por cotización
                </p>
                <p className="mt-2 text-sm text-[#82747B]">
                  El precio se determina según los detalles
                  de tu solicitud.
                </p>
              </>
            )}
          </div>

          {/* TAMAÑOS */}
          {product.sizes.length > 0 && (
            <div className="mb-8">
              <label
                htmlFor="product-size"
                className="mb-3 block text-sm font-semibold"
              >
                Selecciona un tamaño
              </label>

              <select
                id="product-size"
                value={selectedSizeId}
onChange={(event) => {
  setSelectedSizeId(event.target.value);
  setAddedMessage("");
}}
                className="w-full rounded-xl border border-[#EADCE1] bg-white px-4 py-3 outline-none focus:border-[#B84F79]"
              >
                {product.sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.name} — {formatPrice(size.price)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* PERSONALIZACIÓN */}
          {product.customizable && (
            <div className="mb-8 space-y-6">
              <h2 className="font-serif text-2xl">
                Personaliza tu pedido
              </h2>

              {product.options.map((option) => (
                <div key={option.id}>
                  <label
                    htmlFor={`option-${option.id}`}
                    className="mb-2 block text-sm font-semibold"
                  >
                    {option.name}
                  </label>

                  <select
                    id={`option-${option.id}`}
                    value={selectedOptions[option.id] ?? ""}
onChange={(event) => {
  setSelectedOptions((previous) => ({
    ...previous,
    [option.id]: event.target.value,
  }));
  setAddedMessage("");
}}  
                    className="w-full rounded-xl border border-[#EADCE1] bg-white px-4 py-3 outline-none focus:border-[#B84F79]"
                  >
                    <option value="">Seleccionar opción</option>

                    {option.choices.map((choice) => (
                      <option key={choice} value={choice}>
                        {choice}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <div>
                <label
                  htmlFor="special-instructions"
                  className="mb-2 block text-sm font-semibold"
                >
                  Instrucciones especiales
                </label>

                <textarea
                  id="special-instructions"
                  value={instructions}
onChange={(event) => {
  setInstructions(event.target.value);
  setAddedMessage("");
}}
                  rows={4}
                  maxLength={1000}
                  placeholder="Describe los detalles que te gustaría agregar..."
                  className="w-full resize-y rounded-xl border border-[#EADCE1] bg-white px-4 py-3 outline-none focus:border-[#B84F79]"
                />
              </div>
            </div>
          )}

          {/* ANTICIPACIÓN */}
          <div className="mb-8 rounded-2xl bg-[#FAF1F4] p-5">
            <h3 className="mb-2 text-sm font-semibold text-[#342B30]">
              Tiempo de anticipación
            </h3>

            <p className="text-sm leading-6 text-[#766A70]">
              {product.minimumLeadTimeHours === 0
                ? "Consulta la disponibilidad al realizar tu solicitud."
                : `Solicita este producto con al menos ${product.minimumLeadTimeHours} horas de anticipación.`}
            </p>

            <p className="mt-2 text-xs text-[#82747B]">
              La fecha y hora de recogida estarán sujetas
              a confirmación.
            </p>
          </div>

{product.available && currentPrice !== null && (
  <div className="mb-8">
    <label
      htmlFor="product-quantity"
      className="mb-3 block text-sm font-semibold"
    >
      Cantidad
    </label>

    <select
      id="product-quantity"
      value={quantity}
      onChange={(event) => {
        setQuantity(Number(event.target.value));
        setAddedMessage("");
      }}
      className="w-full rounded-xl border border-[#EADCE1] bg-white px-4 py-3 outline-none focus:border-[#B84F79]"
    >
      {Array.from({ length: 10 }, (_, index) => index + 1).map(
        (value) => (
          <option key={value} value={value}>
            {value}
          </option>
        )
      )}
    </select>
  </div>
)}
{/* ACCIÓN */}
{!product.available ? (
  <div className="rounded-xl bg-[#F2E9EC] p-5 text-center text-sm text-[#8D5368]">
    Este producto no está disponible actualmente.
  </div>
) : currentPrice === null ? (
  <div className="rounded-2xl border border-[#F0E6E9] p-5">
    <p className="mb-4 text-sm leading-6 text-[#766A70]">
      Este producto requiere una cotización personalizada.
      Próximamente podrás enviar tu solicitud desde aquí.
    </p>

    <button
      type="button"
      disabled
      className="w-full cursor-not-allowed rounded-full bg-[#B84F79] px-8 py-4 text-sm font-semibold text-white opacity-60"
    >
      Solicitar cotización
    </button>
  </div>
) : (
  <div>
    <button
      type="button"
      onClick={handleAddToCart}
      className="w-full rounded-full bg-[#B84F79] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#963B61]"
    >
      Añadir al carrito
    </button>

    {addedMessage && (
      <div
        role="status"
        aria-live="polite"
        className="mt-4 rounded-xl bg-[#EDF7F0] px-5 py-4 text-sm font-medium text-[#35734A]"
      >
        {addedMessage}
      </div>
    )}

    <p className="mt-3 text-center text-xs text-[#82747B]">
      El precio es provisional. La disponibilidad y el importe
      final se confirmarán al revisar tu solicitud.
    </p>
  </div>
)}
        </section>
      </div>
    </main>
  );
}