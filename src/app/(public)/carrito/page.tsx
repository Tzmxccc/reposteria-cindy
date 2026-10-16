"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import { useCart } from "@/components/cart/CartProvider";

const formatPrice = (price: number) =>
  `L ${price.toLocaleString("es-HN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  return (
    <div className="min-h-screen bg-[#FFFCFB] text-[#342B30]">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-8">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B84F79]">
            Tu selección
          </p>

          <h1 className="font-serif text-4xl md:text-5xl">
            Carrito de compras
          </h1>

          <p className="mt-4 text-[#766A70]">
            Revisa los productos que deseas solicitar.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-[#F0E6E9] bg-white px-6 py-20 text-center">
            <div className="mb-5 text-6xl">🛒</div>

            <h2 className="mb-3 font-serif text-3xl">
              Tu carrito está vacío
            </h2>

            <p className="mb-8 text-[#82747B]">
              Explora nuestro catálogo y encuentra algo especial.
            </p>

            <Link
              href="/catalogo"
              className="inline-block rounded-full bg-[#B84F79] px-7 py-4 text-sm font-semibold text-white hover:bg-[#963B61]"
            >
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
            {/* ARTÍCULOS */}
            <section className="space-y-5">
              {items.map((item) => (
                <article
                  key={item.cartItemId}
                  className="rounded-2xl border border-[#F0E6E9] bg-white p-5 md:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F8EDF1] sm:w-32">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-5xl">🎂</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/catalogo/${item.productId}`}
                        className="font-serif text-2xl hover:text-[#B84F79]"
                      >
                        {item.productName}
                      </Link>

                      {item.sizeName && (
                        <p className="mt-2 text-sm text-[#766A70]">
                          Tamaño: {item.sizeName}
                        </p>
                      )}

                      {item.selectedOptions.map((option) => (
                        <p
                          key={option.optionId}
                          className="mt-1 text-sm text-[#766A70]"
                        >
                          {option.optionName}: {option.choice}
                        </p>
                      ))}

                      {item.specialInstructions && (
                        <p className="mt-2 break-words text-sm text-[#766A70]">
                          Instrucciones: {item.specialInstructions}
                        </p>
                      )}

                      <p className="mt-4 text-sm text-[#82747B]">
                        Precio unitario: {formatPrice(item.unitPrice)}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <label
                            htmlFor={`quantity-${item.cartItemId}`}
                            className="text-sm font-medium"
                          >
                            Cantidad
                          </label>

                          <select
                            id={`quantity-${item.cartItemId}`}
                            value={Math.min(item.quantity, 10)}
                            onChange={(event) =>
                              updateQuantity(
                                item.cartItemId,
                                Number(event.target.value)
                              )
                            }
                            className="rounded-lg border border-[#EADCE1] bg-white px-3 py-2 text-sm"
                          >
                            {Array.from(
                              { length: Math.max(10, item.quantity) },
                              (_, index) => index + 1
                            ).map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-sm font-medium text-[#B84F79] hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>

                      <p className="mt-5 text-right text-lg font-semibold">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}

              <div className="flex flex-wrap justify-between gap-4">
                <Link
                  href="/catalogo"
                  className="text-sm font-semibold text-[#B84F79] hover:underline"
                >
                  ← Seguir comprando
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("¿Deseas vaciar el carrito?")) {
                      clearCart();
                    }
                  }}
                  className="text-sm font-medium text-[#82747B] hover:text-[#B84F79]"
                >
                  Vaciar carrito
                </button>
              </div>
            </section>

            {/* RESUMEN */}
            <aside className="rounded-2xl border border-[#F0E6E9] bg-white p-6">
              <h2 className="mb-6 font-serif text-2xl">
                Resumen del pedido
              </h2>

              <div className="flex justify-between text-sm text-[#766A70]">
                <span>Unidades</span>
                <span>{itemCount}</span>
              </div>

              <div className="mt-4 flex justify-between border-t border-[#F0E6E9] pt-5">
                <span className="font-semibold">Subtotal</span>
                <span className="text-xl font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <p className="mt-5 text-xs leading-6 text-[#82747B]">
                Los precios son provisionales. El importe,
                la disponibilidad y la fecha de recogida
                deberán confirmarse al revisar tu solicitud.
              </p>

              <button
                type="button"
                disabled
                className="mt-7 w-full cursor-not-allowed rounded-full bg-[#B84F79] px-6 py-4 text-sm font-semibold text-white opacity-60"
              >
                Continuar con el pedido
              </button>

              <p className="mt-3 text-center text-xs text-[#82747B]">
                Próximamente habilitaremos el formulario de pedido.
              </p>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}