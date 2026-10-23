
import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/firebase/admin";
import { validateOrderItems } from "@/lib/validateOrderItems";
import { validateOrderRequest } from "@/lib/validateOrderRequest";

import type { CreateOrderRequest } from "@/types/orderRequest";

import { createOrderFingerprint } from "@/lib/orderFingerprint";
import { checkOrderRateLimit } from "@/lib/orderRateLimit";
import { getRequestClientIdentity } from "@/lib/requestClientIdentity";

export async function POST(request: NextRequest) {
  try {
    // Limitar el tamaño de las solicitudes recibidas.
    const contentLength = request.headers.get("content-length");

    if (contentLength && Number(contentLength) > 50_000) {
      return NextResponse.json(
        { success: false, error: "La solicitud es demasiado grande." },
        { status: 413 }
      );
    }

    const rawBody = await request.text();

    if (rawBody.length > 50_000) {
      return NextResponse.json(
        { success: false, error: "La solicitud es demasiado grande." },
        { status: 413 }
      );
    }

    let body: CreateOrderRequest;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "El formato de la solicitud no es válido.",
        },
        { status: 400 }
      );
    }

    // 1. Validar productos, cantidades, opciones y precios.
    const itemsResult = validateOrderItems(body?.items);

    if (!itemsResult.success) {
      return NextResponse.json(
        { success: false, error: itemsResult.error },
        { status: 400 }
      );
    }

    // 2. Validar datos del cliente y fecha de recogida.
    const customerResult = validateOrderRequest(
      body,
      itemsResult.items
    );

    if (!customerResult.success) {
      return NextResponse.json(
        { success: false, error: customerResult.error },
        { status: 400 }
      );
    }

    // 3. Preparar el documento con datos validados.
    const fingerprint = createOrderFingerprint({
  ...customerResult.data,
  items: itemsResult.items,
});

    const orderData = {
      ...customerResult.data,
      items: itemsResult.items,
      subtotal: itemsResult.subtotal,
        fingerprint,
      status: "pending_review" as const,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    // 4. Usar requestId como identificador del documento.
    const db = getAdminDb();

    const orderId = customerResult.data.requestId;

    const documentReference = db.collection("orders").doc(orderId);

    try {
      // create() falla si el documento ya existe.
      await documentReference.create(orderData);
    } catch (error: unknown) {
      const errorCode =
        typeof error === "object" &&
        error !== null &&
        "code" in error
          ? error.code
          : undefined;

      // Firestore: ALREADY_EXISTS (código 6).

if (
  errorCode === 6 ||
  errorCode === "6" ||
  errorCode === "already-exists"
) {
  const existingDocument = await documentReference.get();

  if (!existingDocument.exists) {
    throw new Error(
      "No fue posible verificar el pedido existente."
    );
  }

  const existingFingerprint = existingDocument.get(
    "fingerprint"
  );

  // Rechazar el identificador si los datos no coinciden.
  if (
    typeof existingFingerprint !== "string" ||
    existingFingerprint !== fingerprint
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Este identificador ya pertenece a una solicitud diferente.",
      },
      { status: 409 }
    );
  }

  // Los datos coinciden: es un reintento legítimo.
  return NextResponse.json(
    {
      success: true,
      message: "Esta solicitud ya había sido registrada.",
      orderId,
      alreadyExists: true,
    },
    { status: 200 }
  );
}


      throw error;
    }

    // 5. Responder cuando se crea un pedido nuevo.
    return NextResponse.json(
      {
        success: true,
        message: "Solicitud de pedido registrada correctamente.",
        orderId,
        alreadyExists: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar la solicitud de pedido:", error);

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible registrar el pedido. Intenta nuevamente.",
      },
      { status: 500 }
    );
  }
}
