import { CronJob } from 'cron';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//data = [openTime, open, high, low, close, volume, closeTime, baseAssetVolume, numberOfTrades, takerBuyQuoteAssetVolume, takerBuyBaseAssetVolume, ignore]

interface Bar {
  openTime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: string;
  baseAssetVolume: string;
  numberOfTrades: string;
  takerBuyQuoteAssetVolume: string;
  takerBuyBaseAssetVolume: string;
  ignore: string;
}

async function insertPrice(data: string[][]) {
  await prisma.btcusdt_1m.createMany({
    data: data.map((entry: string[]) => {
      return {
        openTime: entry[0].toString(),
        open: entry[1],
        high: entry[2],
        low: entry[3],
        close: entry[4],
        volume: entry[5],
        closeTime: entry[6].toString(),
        baseAssetVolume: entry[7],
        numberOfTrades: entry[8].toString(),
        takerBuyQuoteAssetVolume: entry[9],
        takerBuyBaseAssetVolume: entry[10],
        ignore: entry[11],
      };
    }),
    skipDuplicates: true,
  });

  for (let i = 0; i < data.length; i++) {
    const deltaT = Number(data?.[i]?.[0]) - 1502942400000;
    await insertMinuteTimeFrame(deltaT, 3);
    await insertMinuteTimeFrame(deltaT, 5);
    await insertMinuteTimeFrame(deltaT, 15);
    await insertMinuteTimeFrame(deltaT, 30);
    await insertMinuteTimeFrame(deltaT, 60);
    await insertHourTimeFrame(deltaT, 2);
    await insertHourTimeFrame(deltaT, 4);
    await insertHourTimeFrame(deltaT, 6);
    await insertHourTimeFrame(deltaT, 8);
    await insertHourTimeFrame(deltaT, 12);
    await insertHourTimeFrame(deltaT, 24);
    await insertDayTimeFrame(deltaT, 3);
    await insertDayTimeFrame(deltaT, 7);
    await insertDayTimeFrame(deltaT, 30);
  }
  console.log('done');
}

const minuteInMilliseconds = 60000;

//BTCUSDT init timestamp 1502942400000
CronJob.from({
  cronTime: '*/7 * * * * *',
  onTick: async function () {
    const startTime = (await findNextTime()) ?? 1502942400000;
    console.log(startTime);
    const url = `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=${
      Number(startTime)
      // Date.now() - minuteInMilliseconds
    }&endTime=${Date.now()}&limit=1000`;
    const response = await fetch(url);
    const data = await response.json();
    insertPrice(data);
  },
  start: true,
  timeZone: 'America/Los_Angeles',
});

async function findNextTime() {
  const lastestTime: { max: string }[] =
    await prisma.$queryRaw`SELECT MAX("openTime") FROM "btcusdt_1m"`;
  return lastestTime[0]?.max
    ? Number(lastestTime[0]?.max) + minuteInMilliseconds
    : null;
}

async function insertMinuteTimeFrame(deltaT: number, minutes: number) {
  if (deltaT % (minuteInMilliseconds * minutes) !== 0) {
    //first minute of the minutes
    return;
  }

  const startTime = deltaT + 1502942400000 - minuteInMilliseconds * minutes;
  const timestamps = Array.from({ length: minutes }, (_, i) =>
    (startTime + minuteInMilliseconds * i).toString(),
  );
  const data = await prisma.btcusdt_1m.findMany({
    where: { openTime: { in: timestamps } },
    select: {
      openTime: true,
      open: true,
      high: true,
      low: true,
      close: true,
      volume: true,
      closeTime: true,
      baseAssetVolume: true,
      numberOfTrades: true,
      takerBuyQuoteAssetVolume: true,
      takerBuyBaseAssetVolume: true,
      ignore: true,
    },
  });
  if (data.length < minutes) return;
  const bar = compressDataToBar(data);

  switch (minutes) {
    case 3:
      await prisma.btcusdt_3m.create({
        data: bar,
      });
      break;
    case 5:
      await prisma.btcusdt_5m.create({
        data: bar,
      });
      break;
    case 15:
      await prisma.btcusdt_15m.create({
        data: bar,
      });
      break;
    case 30:
      await prisma.btcusdt_30m.create({
        data: bar,
      });
      break;
    case 60:
      await prisma.btcusdt_1h.create({
        data: bar,
      });
      break;
  }
}

async function insertHourTimeFrame(deltaT: number, hours: number) {
  if (deltaT % (minuteInMilliseconds * 60 * hours) !== 0) {
    return;
  }
  const startTime = deltaT + 1502942400000 - minuteInMilliseconds * 60 * hours;
  const timestamps = Array.from({ length: hours }, (_, i) =>
    (startTime + minuteInMilliseconds * 60 * i).toString(),
  );
  const data = await prisma.btcusdt_1h.findMany({
    where: { openTime: { in: timestamps } },
    select: {
      openTime: true,
      open: true,
      high: true,
      low: true,
      close: true,
      volume: true,
      closeTime: true,
      baseAssetVolume: true,
      numberOfTrades: true,
      takerBuyQuoteAssetVolume: true,
      takerBuyBaseAssetVolume: true,
      ignore: true,
    },
  });
  if (data.length < hours) return;

  const bar = compressDataToBar(data);

  switch (hours) {
    case 2:
      await prisma.btcusdt_2h.create({
        data: bar,
      });
      break;
    case 4:
      await prisma.btcusdt_4h.create({
        data: bar,
      });
      break;
    case 6:
      await prisma.btcusdt_6h.create({
        data: bar,
      });
      break;
    case 8:
      await prisma.btcusdt_8h.create({
        data: bar,
      });
      break;
    case 12:
      await prisma.btcusdt_12h.create({
        data: bar,
      });
      break;
    case 24:
      await prisma.btcusdt_1d.create({
        data: bar,
      });
      break;
  }
}

async function insertDayTimeFrame(deltaT: number, days: number) {
  if (deltaT % (minuteInMilliseconds * 60 * 24 * days) !== 0) {
    return;
  }
  const startTime =
    deltaT + 1502942400000 - minuteInMilliseconds * 60 * 24 * days;
  const timestamps = Array.from({ length: days }, (_, i) =>
    (startTime + minuteInMilliseconds * 60 * 24 * i).toString(),
  );
  const data = await prisma.btcusdt_1d.findMany({
    where: { openTime: { in: timestamps } },
    select: {
      openTime: true,
      open: true,
      high: true,
      low: true,
      close: true,
      volume: true,
      closeTime: true,
      baseAssetVolume: true,
      numberOfTrades: true,
      takerBuyQuoteAssetVolume: true,
      takerBuyBaseAssetVolume: true,
      ignore: true,
    },
  });
  if (data.length < days) return;

  const bar = compressDataToBar(data);

  switch (days) {
    case 3:
      await prisma.btcusdt_3d.create({
        data: bar,
      });
      break;
    case 7:
      await prisma.btcusdt_1w.create({
        data: bar,
      });
      break;
    case 30:
      await prisma.btcusdt_1mon.create({
        data: bar,
      });
      break;
  }
}

function compressDataToBar(data: Bar[]): Bar {
  const openTime = data[0].openTime;
  const open = data[0].open;
  const high = Math.max(...data.map((bar) => Number(bar.high)));
  const low = Math.min(...data.map((bar) => Number(bar.low)));
  const close = data[data.length - 1].close;
  const volume = data
    .reduce((acc, bar) => acc + Number(bar.volume), 0)
    .toString();
  const closeTime = data[data.length - 1].closeTime;
  const baseAssetVolume = data
    .reduce((acc, bar) => acc + Number(bar.baseAssetVolume), 0)
    .toString();
  const numberOfTrades = data
    .reduce((acc, bar) => acc + Number(bar.numberOfTrades), 0)
    .toString();
  const takerBuyQuoteAssetVolume = data
    .reduce((acc, bar) => acc + Number(bar.takerBuyQuoteAssetVolume), 0)
    .toString();
  const takerBuyBaseAssetVolume = data
    .reduce((acc, bar) => acc + Number(bar.takerBuyBaseAssetVolume), 0)
    .toString();
  const ignore = data
    .reduce((acc, bar) => acc + Number(bar.ignore), 0)
    .toString();
  return {
    openTime,
    open,
    high: high.toString(),
    low: low.toString(),
    close,
    volume,
    closeTime,
    baseAssetVolume,
    numberOfTrades,
    takerBuyQuoteAssetVolume,
    takerBuyBaseAssetVolume,
    ignore,
  };
}
