import {
  CandlestickData,
  Time,
  UTCTimestamp,
  WhitespaceData,
} from 'lightweight-charts';
import {
  FasterBollingerBands,
  FasterEMA,
  FasterRSI,
  FasterSMA,
} from 'trading-signals';

export type SupportedIndicators = 'sma' | 'ema' | 'rsi' | 'bbands';

type GetIndicatorDataParams = {
  candles: CandlestickData<Time>[];
  period: number;
  color: string;
  indicator: SupportedIndicators;
};

export function getIndicatorData({
  candles,
  period,
  color,
  indicator,
}: GetIndicatorDataParams): WhitespaceData<Time>[] {
  const instance = getIndicatorInstance(indicator, period);
  return candles?.map((candle: CandlestickData<Time>, i: number) => {
    if (i > period - 1) {
      return {
        time: candle?.time as UTCTimestamp,
        value: instance.update(candle.close),
        color,
      };
    } else {
      return { time: candle?.time as UTCTimestamp };
    }
  });
}

function getIndicatorInstance(indicator: SupportedIndicators, period: number) {
  switch (indicator) {
    case 'sma':
      return new FasterSMA(period);
    case 'ema':
      return new FasterEMA(period);
    case 'rsi':
      return new FasterRSI(period);
    case 'bbands':
      return new FasterBollingerBands(period);
    default:
      return new FasterSMA(period);
  }
}
