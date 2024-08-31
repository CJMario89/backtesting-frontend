import { IndicatorParams } from ' /components/back-test/store/indicator.type';
import {
  CandlestickData,
  Time,
  UTCTimestamp,
  WhitespaceData,
} from 'lightweight-charts';
import {
  FasterAC,
  FasterADX,
  FasterAO,
  FasterATR,
  FasterBandsResult,
  FasterBollingerBands,
  FasterBollingerBandsWidth,
  FasterCCI,
  FasterCG,
  FasterDX,
  FasterEMA,
  FasterMACD,
  FasterMACDResult,
  FasterMAD,
  FasterMOM,
  FasterOBV,
  FasterROC,
  FasterRSI,
  FasterSMA,
  FasterStochasticOscillator,
  FasterStochasticResult,
  FasterStochasticRSI,
  FasterTR,
  FasterWMA,
  FasterWSMA,
} from 'trading-signals';

type GetIndicatorDataParams = {
  candles: (CandlestickData<Time> & { volume: number })[];
  params: IndicatorParams;
  times?: number;
  color: string;
  indicator: string;
};

export function getIndicatorData({
  candles,
  params,
  color,
  indicator,
}: GetIndicatorDataParams): Record<string, WhitespaceData<Time>[]> {
  const period = Number(params.period);
  const short = Number(params.short);
  const long = Number(params.long);
  const signal = Number(params.signal);
  const times = Number(params.times ?? 1);
  const deviation = Number(params.deviation ?? 2);
  const kperiod = Number(params.kperiod ?? 5);
  const dperiod = Number(params.dperiod ?? 3);
  const slowperiod = Number(params.slowperiod ?? 3);
  const input = params.input;

  if (input === 'candle') {
    const instance = getIndicatorInstanceWithCandle({
      indicator,
      period,
      short,
      long,
      signal,
      kperiod,
      dperiod,
      slowperiod,
    });
    if (indicator === 'DX' || indicator === 'ADX') {
      return getADXValueAndColor({
        instance: instance as FasterDX,
        candles,
      });
    }
    if (indicator === 'STOCH') {
      return getStochasticValueAndColor({
        instance: instance as FasterStochasticOscillator,
        candles,
      });
    }
    const main = candles?.map((candle: CandlestickData<Time>) => {
      const value = instance.update(candle);
      return {
        time: candle?.time as UTCTimestamp,
        color,
        ...(value ? { value } : {}),
      };
    });
    return {
      main,
    };
  } else if (input === 'candleVolume') {
    const instance = getIndicatorInstanceWithCandleVolume({
      indicator,
    });
    const main = candles?.map(
      (candle: CandlestickData<Time> & { volume: number }) => {
        if (indicator === 'volume') {
          return {
            time: candle?.time as UTCTimestamp,
            color,
            value: candle.volume,
          };
        }
        const value = instance.update(candle);
        return {
          time: candle?.time as UTCTimestamp,
          color,
          ...(value ? { value } : {}),
        };
      },
    );
    return {
      main,
    };
  } else {
    const instance = getIndicatorInstanceWithValue({
      indicator,
      period,
      short,
      long,
      signal,
      deviation,
    });

    if (indicator === 'MACD') {
      return getMACDValueAndColor({
        instance: instance as FasterMACD,
        candles,
      });
    } else if (indicator === 'BBANDS') {
      return getBBANDSValueAndColor({
        instance: instance as FasterBollingerBands,
        candles,
      });
    }

    const main = candles?.map((candle: CandlestickData<Time>) => {
      const value = instance.update(candle.close);
      return {
        time: candle?.time as UTCTimestamp,
        ...(value
          ? {
              value: Number(value) * times,
            }
          : {}),
        color,
      };
    });
    return {
      main,
    };
  }
}

function getIndicatorInstanceWithValue({
  indicator,
  period,
  short,
  long,
  signal,
  deviation,
}: {
  indicator: string;
  period: number;
  short: number;
  long: number;
  signal: number;
  deviation: number;
}) {
  switch (indicator) {
    case 'SMA':
      return new FasterSMA(period);
    case 'EMA':
      return new FasterEMA(period);
    case 'RSI':
      return new FasterRSI(period);
    case 'MACD':
      return new FasterMACD(
        new FasterEMA(short),
        new FasterEMA(long),
        new FasterEMA(signal),
      );
    case 'BBANDS':
      return new FasterBollingerBands(period, deviation);
    case 'BBANDSW':
      return new FasterBollingerBandsWidth(
        new FasterBollingerBands(period, deviation),
      );
    case 'CG':
      return new FasterCG(period, signal);
    case 'MAD':
      return new FasterMAD(period);
    case 'MOM':
      return new FasterMOM(period);
    case 'ROC':
      return new FasterROC(period);
    case 'STOCHRSI':
      return new FasterStochasticRSI(period);
    case 'WMA':
      return new FasterWMA(period);
    case 'WSMA':
      return new FasterWSMA(period);
    default:
      return new FasterSMA(period);
  }
}

function getIndicatorInstanceWithCandle({
  indicator,
  period,
  short,
  long,
  signal,
  kperiod,
  dperiod,
  slowperiod,
}: {
  indicator: string;
  period: number;
  short: number;
  long: number;
  signal: number;
  kperiod: number;
  dperiod: number;
  slowperiod: number;
}) {
  switch (indicator) {
    case 'AC':
      return new FasterAC(short, long, signal);
    case 'AO':
      return new FasterAO(short, long);
    case 'ATR':
      return new FasterATR(period);
    case 'CCI':
      return new FasterCCI(period);
    case 'DX':
      return new FasterDX(period);
    case 'ADX':
      return new FasterADX(period);
    case 'STOCH':
      return new FasterStochasticOscillator(kperiod, dperiod, slowperiod);
    case 'TR':
      return new FasterTR();
    default:
      return new FasterDX(period);
  }
}

function getIndicatorInstanceWithCandleVolume({
  indicator,
}: {
  indicator: string;
}) {
  switch (indicator) {
    case 'OBV':
      return new FasterOBV();
    default:
      return new FasterOBV();
  }
}

function getMACDValueAndColor({
  instance,
  candles,
}: {
  instance: FasterMACD;
  candles: CandlestickData<Time>[];
}) {
  const macdData = candles?.map((candle: CandlestickData<Time>) => {
    return {
      time: candle?.time as UTCTimestamp,
      value: instance.update(candle.close),
    };
  });
  const macd = macdData.map((data) => ({
    ...data,
    value: (data.value as FasterMACDResult)?.macd,
    color: 'rgba(255, 190, 120, 1)',
  }));
  const signal = macdData.map((data) => ({
    ...data,
    value: (data.value as FasterMACDResult)?.signal,
    color: 'rgba(200, 100, 200, 1)',
  }));
  const histogram = macdData.map((data) => ({
    ...data,
    value: (data.value as FasterMACDResult)?.histogram,
    color:
      (Number((data.value as FasterMACDResult)?.histogram) as number) > 0
        ? 'rgba(0, 150, 130, 1)'
        : 'rgba(200, 50, 50, 1)',
  }));

  return {
    macd,
    signal,
    histogram,
  };
}

function getBBANDSValueAndColor({
  instance,
  candles,
}: {
  instance: FasterBollingerBands;
  candles: CandlestickData<Time>[];
}) {
  const bbandsData = candles?.map((candle: CandlestickData<Time>) => {
    return {
      time: candle?.time as UTCTimestamp,
      value: (instance as FasterBollingerBands).update(candle.close),
    };
  });
  const top = bbandsData.map((data) => ({
    ...data,
    value: (data.value as FasterBandsResult)?.upper,
    color: 'rgba(0, 150, 130, 1)',
  }));
  const middle = bbandsData.map((data) => ({
    ...data,
    value: (data.value as FasterBandsResult)?.middle,
    color: 'rgba(255, 170, 80, 1)',
  }));
  const bottom = bbandsData.map((data) => ({
    ...data,
    value: (data.value as FasterBandsResult)?.lower,
    color: 'rgba(200, 50, 0, 1)',
  }));

  return {
    top,
    middle,
    bottom,
  };
}

function getADXValueAndColor({
  instance,
  candles,
}: {
  instance: FasterDX;
  candles: CandlestickData<Time>[];
}) {
  const pdi = [] as {
    time: UTCTimestamp;
    value: number | void;
    color?: string;
  }[];
  const mdi = [] as {
    time: UTCTimestamp;
    value: number | void;
    color?: string;
  }[];
  const adx = candles?.map((candle: CandlestickData<Time>) => {
    const value = instance.update(candle);
    pdi.push({
      time: candle?.time as UTCTimestamp,
      value: (instance.pdi ?? 0) * 100,
      color: 'rgba(0, 150, 130, 1)',
    });
    mdi.push({
      time: candle?.time as UTCTimestamp,
      value: (instance.mdi ?? 0) * 100,
      color: 'rgba(200, 50, 0, 1)',
    });
    return {
      time: candle?.time as UTCTimestamp,
      value,
      color: 'rgba(255, 170, 80, 1)',
    };
  });
  return {
    adx,
    pdi,
    mdi,
  };
}

function getStochasticValueAndColor({
  instance,
  candles,
}: {
  instance: FasterStochasticOscillator;
  candles: CandlestickData<Time>[];
}) {
  const stochData = candles?.map((candle: CandlestickData<Time>) => {
    return {
      time: candle?.time as UTCTimestamp,
      value: instance.update(candle) as FasterStochasticResult,
    };
  });
  return {
    stochK: stochData.map((data) => ({
      time: data.time,
      value: data.value?.stochK,
      color: 'rgba(0, 150, 130, 1)',
    })),
    stochD: stochData.map((data) => ({
      time: data.time,
      value: data.value?.stochD,
      color: 'rgba(200, 50, 0, 1)',
    })),
  };
}
