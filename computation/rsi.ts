import {
  CandlestickData,
  Time,
  UTCTimestamp,
  WhitespaceData,
} from 'lightweight-charts';
import { FasterRSI } from 'trading-signals';

// function getRSI(candles: CandlestickData<Time>[]) {
//   let rsi = 0;
//   let gain = 0;
//   let loss = 0;
//   for (let i = 0; i < candles.length; i++) {
//     if (candles[i].close > candles[i].open) {
//       gain += candles[i].close - candles[i].open;
//     } else {
//       loss += candles[i].open - candles[i].close;
//     }
//   }
//   rsi = 100 - 100 / (1 + gain / loss);
//   return rsi;
// }

export function getRSIData(
  candles: CandlestickData<Time>[],
  period: number,
  color: string,
): WhitespaceData<Time>[] {
  const rsi = new FasterRSI(period);
  return candles?.map((candle: CandlestickData<Time>, i: number) => {
    if (i > period - 1) {
      return {
        time: candle?.time as UTCTimestamp,
        value: rsi.update(candle.close),
        color,
      };
    } else {
      return { time: candle?.time as UTCTimestamp };
    }
  });
}

// export function addRSIData(
//   candles: CandlestickData<Time>[],
//   period: number,
// ): CandlestickData<Time>[] {
//   //server
//   const rsi = new FasterRSI(period);
//   return candles?.map((candle: CandlestickData<Time>, i: number) => {
//     if (i > period - 1) {
//       return {
//         ...candle,
//         RSI: rsi.update(candle.close),
//       };
//     } else {
//       return candle;
//     }
//   });
// }
