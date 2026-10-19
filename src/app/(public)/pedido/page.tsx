"use client";

import {
  getMinimumLeadTime,
  validatePickupDate,
} from "@/lib/orderValidation";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { useCart } from "@/components/cart/CartProvider";
import type {
  OrderRequest,
  PaymentMethod,
} from "@/types/order";

const formatPrice = (price: number) =>
  `L ${price.toLocaleString("es-HN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function OrderPage() {
  const { items, itemCount, subtotal } = useCart();

  const [form, setForm] = useState<OrderRequest>({
    customer: {
      name: "",
      phone: "",
    },
    pickup: {
      requestedDate: "",
      requestedTime: "",
    },
    paymentMethod: "cash",
    notes: "",
  });

  const [validated, setValidated] = useState(false);
  const [pickupError, setPickupError] = useState("");
  const minimumLeadTimeHours = getMinimumLeadTime(items);

  const updateCustomer = (
    field: "name" | "phone",
    value: string
  ) => {
    setValidated(false);
    setForm((previous) => ({
      ...previous,
      customer: {
        ...previous.customer,
        [field]: value,
      },
    }));
  };

const updatePickup = (
  field: "requestedDate" | "requestedTime",
  value: string
) => {
  setValidated(false);
  setPickupError("");

  setForm((previous) => ({
    ...previous,
    pickup: {
      ...previous.pickup,
      [field]: value,
    },
  }));
};

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (items.length === 0) {
    return;
  }

  const result = validatePickupDate(
    form.pickup.requestedDate,
    form.pickup.requestedTime,
    items
  );

  if (!result.valid) {
    setValidated(false);
    setPickupError(result.message);
    return;
  }

  setPickupError("");
  setValidated(true);
};

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFCFB]">
        <Header />

        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="mb-5 font-serif text-4xl text-[#342B30]">
            Tu carrito está vacío
          </h1>

          <p className="mb-8 text-[#766A70]">
            Primero selecciona los productos que deseas solicitar.
          </p>

          <Link
            href="/catalogo"
            className="inline-block rounded-full bg-[#B84F79] px-7 py-4 text-sm font-semibold text-white"
          >
            Explorar catálogo
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCFB] text-[#342B30]">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-8">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B84F79]">
            Finalizar selección
          </p>

          <h1 className="font-serif text-4xl md:text-5xl">
            Solicitud de pedido
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#766A70]">
            Completa tus datos y dinos cuándo te gustaría
            recoger tus productos. La fecha, disponibilidad
            y precio final estarán sujetos a confirmación.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-2xl border border-[#F0E6E9] bg-white p-6 md:p-8"
          >
            {/* DATOS DEL CLIENTE */}
            <section>
              <h2 className="mb-6 font-serif text-2xl">
                Tus datos
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="customer-name"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Nombre completo *
                  </label>

                  <input
                    id="customer-name"
                    type="text"
                    required
                    maxLength={120}
                    autoComplete="name"
                    value={form.customer.name}
                    onChange={(event) =>
                      updateCustomer("name", event.target.value)
                    }
                    placeholder="Tu nombre"
                    className="w-full rounded-xl border border-[#EADCE1] px-4 py-3 outline-none focus:border-[#B84F79]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="customer-phone"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Teléfono o WhatsApp *
                  </label>

                  <input
                    id="customer-phone"
                    type="tel"
                    required
                    maxLength={25}
                    autoComplete="tel"
                    value={form.customer.phone}
                    onChange={(event) =>
                      updateCustomer("phone", event.target.value)
                    }
                    placeholder="Tu número de contacto"
                    className="w-full rounded-xl border border-[#EADCE1] px-4 py-3 outline-none focus:border-[#B84F79]"
                  />
                </div>
              </div>
            </section>

            {/* RECOGIDA */}
                    
            <section>
              <h2 className="mb-6 font-serif text-2xl">
                Fecha y hora de recogida
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="pickup-date"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Fecha deseada *
                  </label>

                  <input
                    id="pickup-date"
                    type="date"
                    required
                    value={form.pickup.requestedDate}
                    onChange={(event) =>
                      updatePickup(
                        "requestedDate",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-[#EADCE1] px-4 py-3 outline-none focus:border-[#B84F79]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pickup-time"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Hora deseada *
                  </label>

                  <input
                    id="pickup-time"
                    type="time"
                    required
                    value={form.pickup.requestedTime}
                    onChange={(event) =>
                      updatePickup(
                        "requestedTime",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-[#EADCE1] px-4 py-3 outline-none focus:border-[#B84F79]"
                  />
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#82747B]">
                Los pedidos se recogen en la tienda.
                La fecha y hora solicitadas deberán ser
                revisadas y confirmadas por nuestro equipo.
              </p>
              <div className="mt-5 rounded-xl bg-[#FAF1F4] p-4">
  <p className="text-sm font-semibold text-[#342B30]">
    Anticipación mínima de tu pedido
  </p>

  <p className="mt-2 text-sm text-[#766A70]">
    {minimumLeadTimeHours === 0
      ? "No hay una anticipación mínima adicional configurada."
      : `${minimumLeadTimeHours} horas antes de la recogida.`}
  </p>
</div>

{pickupError && (
  <div
    role="alert"
    className="mt-4 rounded-xl border border-[#E7B8C5] bg-[#FFF0F3] p-4 text-sm text-[#A33E60]"
  >
    {pickupError}
  </div>
)}
            </section>

            {/* PAGO */}
            <section>
              <h2 className="mb-6 font-serif text-2xl">
                Método de pago previsto
              </h2>

              <div className="space-y-3">
                {(
                  [
                    { value: "cash", label: "Efectivo en tienda" },
                    {
                      value: "bank_transfer",
                      label: "Transferencia o depósito bancario",
                    },
                  ] as {
                    value: PaymentMethod;
                    label: string;
                  }[]
                ).map((method) => (
                  <label
                    key={method.value}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#EADCE1] p-4 text-sm"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={
                        form.paymentMethod === method.value
                      }
                      onChange={() => {
                        setValidated(false);
                        setForm((previous) => ({
                          ...previous,
                          paymentMethod: method.value,
                        }));
                      }}
                      className="accent-[#B84F79]"
                    />

                    {method.label}
                  </label>
                ))}
              </div>

              <p className="mt-4 text-sm leading-6 text-[#82747B]">
                El anticipo, si corresponde, se comunicará
                después de revisar tu solicitud. No se
                realizará ningún cobro en esta página.
              </p>
              <div className="mt-5 rounded-xl bg-[#FAF1F4] p-4">
  <p className="text-sm font-semibold text-[#342B30]">
    Anticipación mínima de tu pedido
  </p>

  <p className="mt-2 text-sm text-[#766A70]">
    {minimumLeadTimeHours === 0
      ? "No hay una anticipación mínima adicional configurada."
      : `${minimumLeadTimeHours} horas antes de la recogida.`}
  </p>
</div>

{pickupError && (
  <div
    role="alert"
    className="mt-4 rounded-xl border border-[#E7B8C5] bg-[#FFF0F3] p-4 text-sm text-[#A33E60]"
  >
    {pickupError}
  </div>
)}
            </section>

            {/* OBSERVACIONES */}
            <section>
              <label
                htmlFor="order-notes"
                className="mb-3 block font-serif text-2xl"
              >
                Observaciones adicionales
              </label>

              <textarea
                id="order-notes"
                rows={4}
                maxLength={1000}
                value={form.notes}
                onChange={(event) => {
                  setValidated(false);
                  setForm((previous) => ({
                    ...previous,
                    notes: event.target.value,
                  }));
                }}
                placeholder="¿Hay algún detalle adicional que debamos conocer?"
                className="w-full resize-y rounded-xl border border-[#EADCE1] px-4 py-3 outline-none focus:border-[#B84F79]"
              />
            </section>

            <button
              type="submit"
              className="w-full rounded-full bg-[#B84F79] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#963B61]"
            >
              Revisar datos de la solicitud
            </button>

            {validated && (
              <div
                role="status"
                className="rounded-xl border border-[#CDE6D3] bg-[#EDF7F0] p-5 text-sm leading-7 text-[#35734A]"
              >
                <strong>Formulario validado correctamente.</strong>
                <p>
                  Esta es una prueba. Tu solicitud todavía
                  no ha sido enviada ni registrada.
                </p>
              </div>
            )}
          </form>

          {/* RESUMEN */}
          <aside className="rounded-2xl border border-[#F0E6E9] bg-white p-6">
            <h2 className="mb-6 font-serif text-2xl">
              Resumen de tu pedido
            </h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="border-b border-[#F0E6E9] pb-4"
                >
                  <p className="font-semibold">
                    {item.productName}
                  </p>

                  <p className="mt-1 text-sm text-[#82747B]">
                    Cantidad: {item.quantity}
                  </p>

                  {item.sizeName && (
                    <p className="text-sm text-[#82747B]">
                      Tamaño: {item.sizeName}
                    </p>
                  )}

                  <p className="mt-2 text-sm font-semibold">
                    {formatPrice(
                      item.unitPrice * item.quantity
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between text-sm">
              <span>Unidades</span>
              <span>{itemCount}</span>
            </div>

            <div className="mt-4 flex justify-between border-t border-[#F0E6E9] pt-5">
              <span className="font-semibold">
                Subtotal provisional
              </span>

              <span className="font-semibold">
                {formatPrice(subtotal)}
              </span>
            </div>

            <Link
              href="/carrito"
              className="mt-6 inline-block text-sm font-semibold text-[#B84F79] hover:underline"
            >
              ← Modificar carrito
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}