import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/firebase/admin";
import { validateOrderItems } from "@/lib/validateOrderItems";
import { validateOrderRequest } from "@/lib/validateOrderRequest";

import type { CreateOrderRequest } from "@/types/orderRequest";

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
        { success: false, error: "El formato de la solicitud no es válido." },
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
    const orderData = {
      ...customerResult.data,
      items: itemsResult.items,
      subtotal: itemsResult.subtotal,
      status: "pending_review" as const,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    // 4. Guardar la solicitud en Firestore.
    const db = getAdminDb();

    const documentReference = await db
      .collection("orders")
      .add(orderData);

    // 5. Devolver únicamente el identificador del pedido.
    return NextResponse.json(
      {
        success: true,
        message: "Solicitud de pedido registrada correctamente.",
        orderId: documentReference.id,
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