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
import type { CreateOrderRequest } from "@/types/orderRequest";
import {
  getOrCreateOrderRequestId,
  clearOrderRequestId,
} from "@/lib/orderRequestId";

const formatPrice = (price: number) =>
  `L ${price.toLocaleString("es-HN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function OrderPage() {
const { items, itemCount, subtotal, clearCart } = useCart();

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
  const [showReview, setShowReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderIdCopied, setOrderIdCopied] = useState(false);

const [submitError, setSubmitError] = useState("");

const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(
  null
);
  const minimumLeadTimeHours = getMinimumLeadTime(items);

  const updateCustomer = (
    field: "name" | "phone",
    value: string
  ) => {
    setValidated(false);
    setShowReview(false);
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
  setShowReview(false);
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
setShowReview(true);
};

const sendOrder = async () => {
  if (isSubmitting || !validated || !showReview || items.length === 0) {
    return;
  }

  setIsSubmitting(true);
  setSubmitError("");

  try {

const orderPayload = {
  customerName: form.customer.name.trim(),
  customerPhone: form.customer.phone.trim(),
  requestedPickupDate: form.pickup.requestedDate,
  requestedPickupTime: form.pickup.requestedTime,
  paymentMethod: form.paymentMethod,
  notes: form.notes.trim(),
  items: items.map((item) => ({
    productId: item.productId,
    sizeId: item.sizeId,
    selectedOptions: item.selectedOptions.map((option) => ({
      optionId: option.optionId,
      choice: option.choice,
    })),
    specialInstructions: item.specialInstructions,
    quantity: item.quantity,
  })),
};

const fingerprint = JSON.stringify(orderPayload);

const orderData: CreateOrderRequest = {
  requestId: getOrCreateOrderRequestId(fingerprint),
  ...orderPayload,
};


    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const result: {
      success: boolean;
      error?: string;
      orderId?: string;
      retryAfterSeconds?: number;
    } = await response.json();

 

if (response.status === 429) {
  const seconds = result.retryAfterSeconds;

  const minutes =
    typeof seconds === "number" &&
    Number.isFinite(seconds) &&
    seconds > 0
      ? Math.ceil(seconds / 60)
      : null;

  const waitMessage =
    minutes !== null
      ? `Espera aproximadamente ${minutes} ${
          minutes === 1 ? "minuto" : "minutos"
        } antes de intentarlo nuevamente.`
      : "Espera unos minutos antes de intentarlo nuevamente.";

  throw new Error(
    "Has alcanzado el límite de solicitudes de pedido. " +
      waitMessage +
      " Tu carrito se conservará."
  );
}

if (response.status === 409) {
  throw new Error(
    "Se detectó un conflicto al registrar tu solicitud. " +
      "No se ha confirmado un nuevo pedido. " +
      "Tus productos permanecen en el carrito. " +
      "Contacta con Repostería Cindy si el problema continúa."
  );
}

if (!response.ok || !result.success || !result.orderId) {
  throw new Error(
    result.error ?? "No fue posible registrar la solicitud."
  );
}


setSubmittedOrderId(result.orderId);

// El pedido fue registrado correctamente.
clearOrderRequestId();
clearCart();

setShowReview(false);
setValidated(false);

  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ocurrió un error inesperado.";

    setSubmitError(message);
  } finally {
    setIsSubmitting(false);
  }
};

  if (submittedOrderId) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-[#E9DDE2] bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FCE8EF] text-3xl">
          ✓
        </div>

        <h1 className="text-3xl font-semibold text-[#49343D]">
          ¡Recibimos tu solicitud!
        </h1>

        <p className="mt-4 text-[#75646C]">
          Tu solicitud de pedido fue registrada correctamente.
        </p>
        
<div className="mt-5 flex justify-center">
  <span className="inline-flex items-center gap-2 rounded-full border border-[#F1D6DF] bg-[#FFF5F8] px-4 py-2 text-sm font-semibold text-[#A33E60]">
    <span
      className="h-2 w-2 rounded-full bg-[#B84F79]"
      aria-hidden="true"
    />
    Estado: Pendiente de revisión
  </span>
</div>


        <div className="mt-8 rounded-2xl bg-[#FFF5F8] p-5">
          <p className="text-sm text-[#75646C]">
            Número de solicitud
          </p>


<p className="mt-2 break-all font-mono text-sm font-semibold leading-6 text-[#A33E60] sm:text-lg">
  {submittedOrderId}
</p>

          

<button
  type="button"
  onClick={async () => {
    try {
      await navigator.clipboard.writeText(submittedOrderId);
      setOrderIdCopied(true);
    } catch {
      setOrderIdCopied(false);
      alert(
        "No fue posible copiar el número automáticamente. " +
          "Puedes seleccionarlo y copiarlo manualmente."
      );
    }
  }}
  className="mt-4 inline-flex items-center justify-center rounded-full border border-[#E8B8C9] bg-white px-5 py-2 text-sm font-semibold text-[#A33E60] transition hover:bg-[#FFF5F8]"
>
  {orderIdCopied ? "✓ ¡Copiado!" : "Copiar número de solicitud"}
</button>


        </div>

        <div className="mt-8 rounded-2xl border border-[#F1D6DF] bg-[#FFFAFC] p-5 text-left">
          <h2 className="font-semibold text-[#49343D]">
            ¿Qué sucede ahora?
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#75646C]">
            Nuestro equipo revisará tu solicitud, verificará la
            disponibilidad y confirmará los detalles mediante
            WhatsApp o teléfono.
          </p>

          <p className="mt-3 text-sm font-medium text-[#A33E60]">
            Importante: tu pedido todavía no está confirmado.
            No realices ningún anticipo hasta recibir
            instrucciones de nuestro equipo.
          </p>
        </div>

        <a
          href="/catalogo"
          className="mt-8 inline-flex rounded-full bg-[#B84F79] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#963B61]"
        >
          Volver al catálogo
        </a>
      </div>
    </main>
  );
}

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
                        setShowReview(false);
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
                  setShowReview(false);
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

{validated && showReview && (
  <section className="rounded-2xl border border-[#EADCE1] bg-[#FFFCFB] p-6">
    <h2 className="mb-5 font-serif text-2xl">
      Revisión final de tu solicitud
    </h2>

    <div className="space-y-3 text-sm leading-7">
      <p>
        <strong>Nombre:</strong>{" "}
        {form.customer.name}
      </p>

      <p>
        <strong>Teléfono o WhatsApp:</strong>{" "}
        {form.customer.phone}
      </p>

      <p>
        <strong>Fecha de recogida:</strong>{" "}
        {form.pickup.requestedDate}
      </p>

      <p>
        <strong>Hora de recogida:</strong>{" "}
        {form.pickup.requestedTime}
      </p>

      <p>
        <strong>Método de pago:</strong>{" "}
        {form.paymentMethod === "cash"
          ? "Efectivo en tienda"
          : "Transferencia o depósito bancario"}
      </p>

      {form.notes.trim() && (
        <p className="break-words">
          <strong>Observaciones:</strong>{" "}
          {form.notes}
        </p>
      )}
    </div>

    <div className="mt-6 border-t border-[#EADCE1] pt-5">
      <h3 className="mb-4 font-semibold">
        Productos seleccionados
      </h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.cartItemId} className="text-sm">
            <p className="font-semibold">
              {item.productName} × {item.quantity}
            </p>

            {item.sizeName && (
              <p className="text-[#766A70]">
                Tamaño: {item.sizeName}
              </p>
            )}

            {item.selectedOptions.map((option) => (
              <p
                key={option.optionId}
                className="text-[#766A70]"
              >
                {option.optionName}: {option.choice}
              </p>
            ))}

            {item.specialInstructions && (
              <p className="break-words text-[#766A70]">
                Instrucciones: {item.specialInstructions}
              </p>
            )}

            <p className="mt-1 font-semibold">
              {formatPrice(item.unitPrice * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-between border-t border-[#EADCE1] pt-4 font-semibold">
        <span>Subtotal provisional</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
    </div>

    <p className="mt-6 text-sm leading-6 text-[#766A70]">
      La fecha, disponibilidad, precio final y anticipo
      estarán sujetos a revisión por Repostería Cindy.
    </p>

    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => {
          setShowReview(false);
          setValidated(false);
        }}
        className="rounded-full border border-[#EADCE1] px-6 py-3 text-sm font-semibold hover:bg-[#FAF1F4]"
      >
        Editar datos
      </button>

<button
  type="button"
  onClick={sendOrder}
  disabled={isSubmitting}
  className="rounded-full bg-[#B84F79] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#963B61] disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSubmitting ? "Enviando solicitud..." : "Enviar solicitud"}
</button>
    </div>

{submitError && (
  <div
    role="alert"
    className="mt-4 rounded-xl border border-[#E7B8C5] bg-[#FFF0F3] p-4 text-sm text-[#A33E60]"
  >
    {submitError}
  </div>
)}

  </section>
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