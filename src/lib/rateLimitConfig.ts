
export const ORDER_RATE_LIMIT = {
  // Máximo de solicitudes permitidas por ventana.
  maxRequests: 5,

  // Duración de la ventana: 15 minutos.
  windowMs: 15 * 60 * 1000,

  // Tiempo de conservación de registros: 24 horas.
  retentionMs: 24 * 60 * 60 * 1000,
} as const;
