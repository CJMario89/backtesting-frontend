import { BackTestSignal } from ' /components/back-test/store/back-test-store';
import getUrlQuery from ' /server/get-url-query';
import prisma from ' /server/prisma';
import { Prisma } from '@prisma/client';
import { Candle } from '../candles/route';

const barsLimit = 10000;

type Signal = {
  indicator: string;
  upperBound: string;
  lowerBound: string;
  params: Record<string, string>;
};

type BackTestInput = {
  symbol: string;
  start: string;
  end: string;
  interval: string;
  buySignals: Signal[][];
  sellSignals: Signal[][];
};

type trade = {
  buy: Candle;
  sell: Candle;
  profit: number;
  duration: number;
  maxDrawdown: number;
};

type BackTestOutput = {
  buySellCandlesPairs: trade[];
  totalProfit: number;
  totalDuration: number;
  totalMaxDrawdown: number;
  annualizedReturn: number;
};

const getTable = (symbol: string, interval: string) => {
  return `${symbol}_${interval}`;
};

export async function GET(request: Request) {
  const query = getUrlQuery(request.url);
  const symbol: string = query?.symbol?.toLocaleLowerCase();
  const interval: string = query?.interval || '1m';
  const start: string = query?.start;
  const end: string = query?.end;
  const params = query?.params;

  const data = await prisma.$queryRawUnsafe(
    `SELECT 
  "time",
  "open",
  "high",
  "low",
  "close",
  "volume"
  FROM "${getTable(symbol, interval)}"
  WHERE "time" >= '${start}' AND "time" <= '${end}';`,
  );
  return Response.json({ message: 'Success' });
}
