-- CreateTable
CREATE TABLE "BTCUSDT" (
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

    CONSTRAINT "BTCUSDT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BTCUSDT5m" (
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

    CONSTRAINT "BTCUSDT5m_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ETHUSDT" (
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

    CONSTRAINT "ETHUSDT_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BTCUSDT_openTime_idx" ON "BTCUSDT" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT_openTime_key" ON "BTCUSDT"("openTime");

-- CreateIndex
CREATE INDEX "BTCUSDT5m_openTime_idx" ON "BTCUSDT5m" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "BTCUSDT5m_openTime_key" ON "BTCUSDT5m"("openTime");

-- CreateIndex
CREATE INDEX "ETHUSDT_openTime_idx" ON "ETHUSDT" USING HASH ("openTime");

-- CreateIndex
CREATE UNIQUE INDEX "ETHUSDT_openTime_key" ON "ETHUSDT"("openTime");
