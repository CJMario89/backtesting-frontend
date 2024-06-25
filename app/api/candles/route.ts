import getUrlQuery from ' /server/get-url-query';
import prisma from ' /server/prisma';

// 1 week => 1 year
// 1 day => 3 months
// 4 hour => 2 week
// 1 hour => 4 days
// 15 minute => 1 day
// 5 minute => 12 hours
// 1 minute => 90 minutes
// 5 minute => 450 minutes
// 15 minute => 1350 minutes = 22.5 hours
// 1 hour => 22.5 * 4 = 90 hours = 3.75 days
// 4 hour => 3.75 * 4 = 15 days
// 1 day => 15 * 6 = 90 days
// 1 week => 90 * 4 = 360 days

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

const candleNumber = 3000;
export async function GET(request: Request) {
  const query = getUrlQuery(request.url);
  const interval: string = query?.interval || '1m';
  const symbol: string = query?.symbol;
  const page: string = query?.page || '1';
  if (typeof interval === undefined) {
    return Response.json({ message: 'No interval provided' });
  }

  if (typeof symbol === undefined) {
    return Response.json({ message: 'No symbol provided' });
  }

  let data;
  switch (symbol) {
    case 'BTCUSDT':
      data = await getBTCUSDTCandles(interval, page);
  }

  // const total = data.length;
  return Response.json({
    data: data?.reverse(),
  });
}

async function getBTCUSDTCandles(interval: string, page: string) {
  const query = {
    take: candleNumber,
    skip: (Number(page) - 1) * candleNumber,
    select: {
      openTime: true,
      open: true,
      high: true,
      low: true,
      close: true,
      volume: true,
    },
  };
  let data: any[] = [];
  switch (interval) {
    case '1m':
      data = await prisma.btcusdt_1m.findMany({
        ...query,
        orderBy: { openTime: 'desc' },
      });
      break;
    case '3m':
      data = await prisma.btcusdt_3m.findMany({
        ...query,
        orderBy: { openTime: 'desc' },
      });
      break;
    case '5m':
      data = await prisma.btcusdt_5m.findMany({
        ...query,
        orderBy: { openTime: 'desc' },
      });
      break;
    case '15m':
      data = await prisma.btcusdt_15m.findMany({
        ...query,
        orderBy: { openTime: 'desc' },
      });
      break;
    case '30m':
      data = await prisma.btcusdt_30m.findMany({
        ...query,
        orderBy: { openTime: 'desc' },
      });
      break;
    case '1h':
      data = await prisma.btcusdt_1h.findMany({
        ...query,
        orderBy: { openTime: 'desc' },
      });
      break;
    case '2h':
      data = await prisma.btcusdt_2h.findMany({
        ...query,
        orderBy: { openTime: 'desc' },
      });
      break;
    case '4h':
      data = await prisma.btcusdt_4h.findMany({
        ...query,
        orderBy: { openTime: 'desc' },
      });
      break;
    case '6h':
      data = await prisma.btcusdt_6h.findMany({
        ...query,
        orderBy: { openTime: 'desc' },
      });
      break;
    case '8h':
      data = await prisma.btcusdt_8h.findMany({
        ...query,
        orderBy: { openTime: 'desc' },
      });
      break;
    case '12h':
      data = await prisma.btcusdt_12h.findMany({
        ...query,
        orderBy: { openTime: 'desc' },
      });
      break;
    case '1d':
      data = await prisma.btcusdt_1d.findMany({
        ...query,
        orderBy: { openTime: 'desc' },
      });
      break;
    case '3d':
      data = await prisma.btcusdt_3d.findMany({
        ...query,
        orderBy: { openTime: 'desc' },
      });
      break;
    case '1w':
      data = await prisma.btcusdt_1w.findMany({
        ...query,
        orderBy: { openTime: 'desc' },
      });
      break;
    case '1M':
      data = await prisma.btcusdt_1mon.findMany({
        ...query,
        orderBy: { openTime: 'desc' },
      });
      break;
  }
  return data.map((candle) => {
    return {
      time: Number(candle.openTime) / 1000,
      open: Number(candle.open),
      high: Number(candle.high),
      low: Number(candle.low),
      close: Number(candle.close),
      volume: Number(candle.volume),
    };
  });
}
