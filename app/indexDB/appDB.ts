// AppDB.ts
import Dexie, { type EntityTable } from 'dexie';
import BackTestResult from './backtest-result';
// import Friend from './Friend';

export default class AppDB extends Dexie {
  backtestResult!: EntityTable<BackTestResult, 'id'>;

  constructor() {
    super('BackTest');
    this.version(1).stores({
      backtestResult: `++id, name, candles, startTime, endTime, signals, allIndicator,
         initialCapital, capital, buySellCandlesPairs, 
         totalProfit, totalDuration, totalMaxDrawdown, 
         profitRate, annualizedReturn, timeFrame, createdAt`,
    });
    this.backtestResult.mapToClass(BackTestResult);
  }
}
