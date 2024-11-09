import { Time } from 'lightweight-charts';
import { BackTestSignal } from './components/back-test/store/back-test-store';
import { IndicatorExtended } from './components/back-test/store/indicator.type';

export type Interval =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1mon';

export type Candle = {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type getCandleDto = {
  interval: Interval;
  symbol: string;
  page: string;
};

export type Indicator = {
  id: string;
  name: string;
  params: Record<string, number | boolean | string | undefined>;
};

export type Signal = {
  id: string;
  indicator: BaseIndicatorExtended;
  upperBound: {
    id?: string;
    name: string;
    value?: number | Indicator | string;
  };
  lowerBound: {
    id?: string;
    name: string;
    value?: number | Indicator | string;
  };
  logicOperator: 'and' | 'or';
  params: Record<string, string>;
};
export type BackTestInputDto = {
  symbol: string;
  start: string;
  end: string;
  interval: string;
  buySignals: Signal[][];
  sellSignals: Signal[][];
};

export type Trade = {
  buy: Candle;
  sell: Candle;
  profit: number;
  percentProfit: number;
  capital: number;
  duration: number;
  maxDrawdown: number;
  buySignals?: Signal[];
  sellSignals?: Signal[];
};

export type BackTestOutput = {
  allIndicator: Record<string, Indicator>;
  signals: Signal[];
  candles: Candle[];
  buySellCandlesPairs: Trade[];
  initialCaptial: number;
  capital: number;
  totalProfit: number;
  profitRate: number;
  totalDuration: number;
  totalMaxDrawdown: number;
  annualizedReturn: number;
  startTime: string;
  endTime: string;
  timeframe: string;
};
