// Friend.ts

import { Entity } from 'dexie';
import { Candle, Trade } from ' /type';
import AppDB from './appDB';
import { IndicatorExtended } from ' /components/back-test/store/indicator.type';
import { BackTestSignal } from ' /components/back-test/store/back-test-store';

export default class BackTestResult extends Entity<AppDB> {
  id!: number;
  name!: string;
  allIndicator!: Record<string, IndicatorExtended>;
  signals!: BackTestSignal[];
  candles!: Candle[];
  startTime!: number;
  endTime!: number;
  initialCapital!: number;
  capital!: number;
  buySellCandlesPairs!: Trade[];
  totalProfit!: number;
  totalDuration!: number;
  totalMaxDrawdown!: number;
  profitRate!: number;
  annualizedReturn!: number;
  timeframe!: string;
  createdAt!: string;
}

// candles: candles.map((candle) => ({
//   time: Number(candle.time) / 1000,
//   open: Number(candle.open),
//   high: Number(candle.high),
//   low: Number(candle.low),
//   close: Number(candle.close),
//   volume: Number(candle.volume),
// })),
// startTime: start,
// endTime: end,
// initailCaptial: capital,
// capital: capital + totalProfit,
// buySellCandlesPairs: trades,
// totalProfit,
// totalDuration,
// totalMaxDrawdown: maxDrawdown,
// profitRate,
// annualizedReturn,
// timeFrame: interval,
