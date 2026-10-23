
import type { NextRequest } from "next/server";

export type ClientIdentityResult =
  | {
      available: true;
      key: string;
    }
  | {
      available: false;
      reason: string;
    };

export function getRequestClientIdentity(
  request: NextRequest
): ClientIdentityResult {
  // Durante el desarrollo local utilizamos una identidad
  // compartida exclusivamente para realizar pruebas.
  if (process.env.NODE_ENV === "development") {
    return {
      available: true,
      key: "development-local",
    };
  }

  // En producción necesitaremos identificar al cliente
  // mediante información validada por el alojamiento.
  // No confiamos directamente en X-Forwarded-For.
  void request;

  return {
    available: false,
    reason:
      "La identificación confiable del cliente aún no está configurada.",
  };
}
