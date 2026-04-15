-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM (
  'NEW',
  'CONFIRMED',
  'PACKING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
);

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM (
  'PENDING',
  'REQUIRES_ACTION',
  'PAID',
  'FAILED',
  'REFUNDED',
  'PARTIALLY_REFUNDED'
);

-- AlterTable
ALTER TABLE "orders"
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
  ADD COLUMN "statusUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "statusNote" TEXT,
  ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "paymentStatusUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "paymentProvider" TEXT,
  ADD COLUMN "paymentReference" TEXT,
  ADD COLUMN "paymentUrl" TEXT,
  ADD COLUMN "paymentRequestedAt" TIMESTAMP(3),
  ADD COLUMN "paidAt" TIMESTAMP(3),
  ADD COLUMN "trackingProvider" TEXT,
  ADD COLUMN "trackingNumber" TEXT,
  ADD COLUMN "trackingUrl" TEXT;

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_paymentStatus_idx" ON "orders"("paymentStatus");
