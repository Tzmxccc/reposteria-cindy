
import { createHash } from "node:crypto";
import { Timestamp } from "firebase-admin/firestore";

import { ORDER_RATE_LIMIT } from "@/lib/rateLimitConfig";

type FirestoreDatabase = FirebaseFirestore.Firestore;

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export async function checkOrderRateLimit(
  db: FirestoreDatabase,
  clientKey: string
): Promise<RateLimitResult> {
  const now = Date.now();

  const windowStart =
    Math.floor(now / ORDER_RATE_LIMIT.windowMs) *
    ORDER_RATE_LIMIT.windowMs;

  const windowEnd =
    windowStart + ORDER_RATE_LIMIT.windowMs;

  const hashedKey = createHash("sha256")
    .update(clientKey)
    .digest("hex");

  const documentId = `${windowStart}_${hashedKey}`;

  const reference = db
    .collection("orderRateLimits")
    .doc(documentId);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);

    const currentCount = snapshot.exists
      ? Number(snapshot.get("count") ?? 0)
      : 0;

    if (currentCount >= ORDER_RATE_LIMIT.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((windowEnd - now) / 1000)
        ),
      };
    }

    const nextCount = currentCount + 1;

    transaction.set(
      reference,
      {
        count: nextCount,
        windowStart: Timestamp.fromMillis(windowStart),
        expiresAt: Timestamp.fromMillis(
          windowEnd + ORDER_RATE_LIMIT.retentionMs
        ),
      },
      { merge: true }
    );

    return {
      allowed: true,
      remaining: Math.max(
        0,
        ORDER_RATE_LIMIT.maxRequests - nextCount
      ),
      retryAfterSeconds: 0,
    };
  });
}
