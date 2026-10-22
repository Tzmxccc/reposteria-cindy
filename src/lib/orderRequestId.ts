
const STORAGE_KEY = "reposteria-cindy-order-request";

type StoredOrderRequest = {
  requestId: string;
  fingerprint: string;
};

export function getOrCreateOrderRequestId(
  fingerprint: string
): string {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed: unknown = JSON.parse(stored);

      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "requestId" in parsed &&
        "fingerprint" in parsed &&
        typeof parsed.requestId === "string" &&
        typeof parsed.fingerprint === "string" &&
        parsed.fingerprint === fingerprint &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          parsed.requestId
        )
      ) {
        return parsed.requestId;
      }
    }
  } catch {
    // Si el almacenamiento falla, generar otro identificador.
  }

  const requestId = crypto.randomUUID();

  try {
    const data: StoredOrderRequest = {
      requestId,
      fingerprint,
    };

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  } catch {
    // El envío puede continuar sin almacenamiento persistente.
  }

  return requestId;
}

export function clearOrderRequestId(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // No impedir la confirmación si falla el almacenamiento.
  }
}
