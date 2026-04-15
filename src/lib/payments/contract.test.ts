import { PaymentStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  EXTERNAL_PAYMENT_STATUS,
  mapExternalToPaymentStatus,
} from "./contract";

describe("mapExternalToPaymentStatus", () => {
  it("maps external strings to Prisma PaymentStatus", () => {
    expect(mapExternalToPaymentStatus(EXTERNAL_PAYMENT_STATUS.PENDING)).toBe(
      PaymentStatus.PENDING,
    );
    expect(
      mapExternalToPaymentStatus(EXTERNAL_PAYMENT_STATUS.REQUIRES_ACTION),
    ).toBe(PaymentStatus.REQUIRES_ACTION);
    expect(mapExternalToPaymentStatus(EXTERNAL_PAYMENT_STATUS.SUCCEEDED)).toBe(
      PaymentStatus.PAID,
    );
    expect(mapExternalToPaymentStatus(EXTERNAL_PAYMENT_STATUS.FAILED)).toBe(
      PaymentStatus.FAILED,
    );
    expect(mapExternalToPaymentStatus(EXTERNAL_PAYMENT_STATUS.REFUNDED)).toBe(
      PaymentStatus.REFUNDED,
    );
    expect(
      mapExternalToPaymentStatus(EXTERNAL_PAYMENT_STATUS.PARTIALLY_REFUNDED),
    ).toBe(PaymentStatus.PARTIALLY_REFUNDED);
  });
});
