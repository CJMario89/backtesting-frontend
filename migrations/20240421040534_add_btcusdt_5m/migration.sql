/*
  Warnings:

  - You are about to drop the `BTCUSDT` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ETHUSDT` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "BTCUSDT";

-- DropTable
DROP TABLE "ETHUSDT";

-- CreateTable
CREATE TABLE "BTCUSDT1m" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "BTCUSDT1m_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BTCUSDT3m" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "BTCUSDT3m_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BTCUSDT15m" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "BTCUSDT15m_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BTCUSDT30m" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "BTCUSDT30m_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BTCUSDT1h" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "BTCUSDT1h_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BTCUSDT2h" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "BTCUSDT2h_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BTCUSDT4h" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "BTCUSDT4h_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BTCUSDT6h" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "BTCUSDT6h_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BTCUSDT8h" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "BTCUSDT8h_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BTCUSDT12h" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "BTCUSDT12h_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BTCUSDT1d" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "BTCUSDT1d_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BTCUSDT3d" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "BTCUSDT3d_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BTCUSDT1w" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "BTCUSDT1w_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BTCUSDT1mon" (
    "id" SERIAL NOT NULL,
    "openTime" TEXT NOT NULL DEFAULT '0',
    "open" TEXT NOT NULL DEFAULT '0',
    "high" TEXT NOT NULL DEFAULT '0',
    "low" TEXT NOT NULL DEFAULT '0',
    "close" TEXT NOT NULL DEFAULT '0',
    "volume" TEXT NOT NULL DEFAULT '0',
    "closeTime" TEXT NOT NULL DEFAULT '0',
    "baseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "numberOfTrades" TEXT NOT NULL DEFAULT '0',
    "takerBuyQuoteAssetVolume" TEXT NOT NULL DEFAULT '0',
    "takerBuyBaseAssetVolume" TEXT NOT NULL DEFAULT '0',
    "ignore" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "BTCUSDT1mon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BTCUSDT1m_openTime_idx" ON "BTCUSDT1m" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT1m_openTime_key" ON "BTCUSDT1m"("openTime");

-- CreateIndex
CREATE INDEX "BTCUSDT3m_openTime_idx" ON "BTCUSDT3m" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT3m_openTime_key" ON "BTCUSDT3m"("openTime");

-- CreateIndex
CREATE INDEX "BTCUSDT15m_openTime_idx" ON "BTCUSDT15m" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT15m_openTime_key" ON "BTCUSDT15m"("openTime");

-- CreateIndex
CREATE INDEX "BTCUSDT30m_openTime_idx" ON "BTCUSDT30m" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT30m_openTime_key" ON "BTCUSDT30m"("openTime");

-- CreateIndex
CREATE INDEX "BTCUSDT1h_openTime_idx" ON "BTCUSDT1h" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT1h_openTime_key" ON "BTCUSDT1h"("openTime");

-- CreateIndex
CREATE INDEX "BTCUSDT2h_openTime_idx" ON "BTCUSDT2h" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT2h_openTime_key" ON "BTCUSDT2h"("openTime");

-- CreateIndex
CREATE INDEX "BTCUSDT4h_openTime_idx" ON "BTCUSDT4h" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT4h_openTime_key" ON "BTCUSDT4h"("openTime");

-- CreateIndex
CREATE INDEX "BTCUSDT6h_openTime_idx" ON "BTCUSDT6h" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT6h_openTime_key" ON "BTCUSDT6h"("openTime");

-- CreateIndex
CREATE INDEX "BTCUSDT8h_openTime_idx" ON "BTCUSDT8h" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT8h_openTime_key" ON "BTCUSDT8h"("openTime");

-- CreateIndex
CREATE INDEX "BTCUSDT12h_openTime_idx" ON "BTCUSDT12h" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT12h_openTime_key" ON "BTCUSDT12h"("openTime");

-- CreateIndex
CREATE INDEX "BTCUSDT1d_openTime_idx" ON "BTCUSDT1d" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT1d_openTime_key" ON "BTCUSDT1d"("openTime");

-- CreateIndex
CREATE INDEX "BTCUSDT3d_openTime_idx" ON "BTCUSDT3d" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT3d_openTime_key" ON "BTCUSDT3d"("openTime");

-- CreateIndex
CREATE INDEX "BTCUSDT1w_openTime_idx" ON "BTCUSDT1w" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT1w_openTime_key" ON "BTCUSDT1w"("openTime");

-- CreateIndex
CREATE INDEX "BTCUSDT1mon_openTime_idx" ON "BTCUSDT1mon" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT1mon_openTime_key" ON "BTCUSDT1mon"("openTime");
