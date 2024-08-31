import { Indicator, IndicatorExtended } from './indicator.type';
export const colorFixedArr = ['MACD', 'BBANDS'];

export const paramsSetting = [
  'period',
  'times',
  'short',
  'long',
  'signal',
  'deviation',
  'kperiod',
  'dperiod',
  'slowperiod',
];
export const paramsMaxMap: Record<string, number> = {
  period: 500,
  times: 10,
  short: 100,
  long: 100,
  signal: 100,
  deviation: 3,
  kperiod: 100,
  dperiod: 100,
  slowperiod: 100,
};

export const signalIndicators: Record<string, IndicatorExtended> = {
  price: {
    name: 'price',
    indicators: [
      {
        name: 'price',
        params: {
          period: '1',
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          isPriceRelated: true,
          input: 'value',
        },
        id: 'price',
        baseId: 'price',
        isShowInChart: false,
        displayName: 'Current Price',
        color: '#BB6611',
      },
    ],
  },
};

export const indicators: Indicator[] = [
  {
    name: 'RSI',
    isBase: true,
    indicators: [
      {
        displayName: 'Relative Strength Index',
        name: 'RSI',
        params: {
          period: '14',
          max: 100,
          min: 0,
          isPriceRelated: false,
          input: 'value',
        },
      },
    ],
  },
  {
    name: 'SMA',
    isBase: true,
    indicators: [
      {
        displayName: 'Simple Moving Average',
        name: 'SMA',
        params: {
          period: '14',
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          isPriceRelated: true,
          input: 'value',
        },
      },
    ],
  },
  {
    name: 'EMA',
    isBase: true,
    indicators: [
      {
        displayName: 'Exponential Moving Average',
        name: 'EMA',
        params: {
          period: '14',
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          isPriceRelated: true,
          input: 'value',
        },
      },
    ],
  },
  {
    name: 'PI',
    isBase: false,
    timeframe: '1d',
    indicators: [
      {
        displayName: 'Simple Moving Average',
        name: 'SMA',
        params: {
          period: '111',
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          isValueFixed: true,
          isPriceRelated: true,
          input: 'value',
        },
      },
      {
        displayName: 'Exponential Moving Average',
        name: 'EMA',
        params: {
          period: '350',
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          times: 2,
          isValueFixed: true,
          isPriceRelated: true,
          input: 'value',
        },
      },
    ],
  },
  {
    name: 'MACD',
    isBase: true,
    multiResult: {
      histogram: true,
      macd: true,
      signal: true,
    },
    indicators: [
      {
        displayName: 'MACD',
        name: 'MACD',
        params: {
          short: '12',
          long: '26',
          signal: '9',
          max: Number.MAX_SAFE_INTEGER,
          min: -Number.MAX_SAFE_INTEGER,
          isValueFixed: true,
          isPriceRelated: false,
          input: 'value',
        },
      },
    ],
  },
  {
    name: 'BBANDS',
    isBase: true,
    multiResult: {
      upper: true,
      middle: true,
      lower: true,
    },
    indicators: [
      {
        displayName: 'Bollinger Bands',
        name: 'BBANDS',
        params: {
          period: '20',
          deviation: 2,
          max: Number.MAX_SAFE_INTEGER,
          min: -Number.MAX_SAFE_INTEGER,
          isValueFixed: false,
          isPriceRelated: true,
          input: 'value',
        },
      },
    ],
  },
  {
    name: 'AC',
    isBase: true,
    indicators: [
      {
        displayName: 'Acceleration Oscillator',
        name: 'AC',
        params: {
          short: '5',
          long: '34',
          signal: '5',
          max: Number.MAX_SAFE_INTEGER,
          min: -Number.MAX_SAFE_INTEGER,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'candle',
        },
      },
    ],
  },
  {
    name: 'AO',
    isBase: true,
    indicators: [
      {
        displayName: 'Awesome Oscillator',
        name: 'AO',
        params: {
          short: '5',
          long: '34',
          max: Number.MAX_SAFE_INTEGER,
          min: -Number.MAX_SAFE_INTEGER,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'candle',
        },
      },
    ],
  },
  {
    name: 'ATR',
    isBase: true,
    indicators: [
      {
        displayName: 'Average True Range',
        name: 'ATR',
        params: {
          period: '14',
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'candle',
        },
      },
    ],
  },
  {
    name: 'BBANDSW',
    isBase: true,
    indicators: [
      {
        displayName: 'Bollinger Bands Width',
        name: 'BBANDSW',
        params: {
          period: '20',
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'value',
        },
      },
    ],
  },
  {
    name: 'CG',
    isBase: true,
    indicators: [
      {
        displayName: 'Center of Gravity',
        name: 'CG',
        params: {
          period: '10',
          signal: '3',
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'value',
        },
      },
    ],
  },
  {
    name: 'CCI',
    isBase: true,
    indicators: [
      {
        displayName: 'Commodity Channel Index',
        name: 'CCI',
        params: {
          period: '20',
          max: Number.MAX_SAFE_INTEGER,
          min: -Number.MAX_SAFE_INTEGER,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'candle',
        },
      },
    ],
  },
  {
    name: 'DX',
    isBase: true,
    multiResult: {
      mdi: true,
      pdi: true,
      adx: true,
    },
    indicators: [
      {
        displayName: 'Directional Movement Index',
        name: 'DX',
        params: {
          period: '14',
          max: Number.MAX_SAFE_INTEGER,
          min: -Number.MAX_SAFE_INTEGER,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'candle',
        },
      },
    ],
  },
  {
    name: 'ADX',
    isBase: true,
    multiResult: {
      mdi: true,
      pdi: true,
      adx: true,
    },
    indicators: [
      {
        displayName: 'Average Directional Movement Index',
        name: 'ADX',
        params: {
          period: '14',
          max: Number.MAX_SAFE_INTEGER,
          min: -Number.MAX_SAFE_INTEGER,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'candle',
        },
      },
    ],
  },
  {
    name: 'MAD',
    isBase: true,
    indicators: [
      {
        displayName: 'Mean Absolute Deviation',
        name: 'MAD',
        params: {
          period: '10',
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'value',
        },
      },
    ],
  },
  {
    name: 'MOM',
    isBase: true,
    indicators: [
      {
        displayName: 'Momentum',
        name: 'MOM',
        params: {
          period: '10',
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'value',
        },
      },
    ],
  },
  {
    name: 'volume',
    isBase: true,
    indicators: [
      {
        displayName: 'Volume',
        name: 'volume',
        params: {
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'candleVolume',
        },
      },
    ],
  },
  {
    name: 'OBV',
    isBase: true,
    indicators: [
      {
        displayName: 'On-Balance Volume',
        name: 'OBV',
        params: {
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'candleVolume',
        },
      },
    ],
  },
  {
    name: 'ROC',
    isBase: true,
    indicators: [
      {
        displayName: 'Rate of Change',
        name: 'ROC',
        params: {
          period: '10',
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'value',
        },
      },
    ],
  },
  {
    name: 'STOCH',
    isBase: true,
    multiResult: {
      stochK: true,
      stochD: true,
    },
    indicators: [
      {
        displayName: 'Stochastic Oscillator',
        name: 'STOCH',
        params: {
          kperiod: '5',
          dperiod: '3',
          slowperiod: '3',
          max: 100,
          min: -100,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'candle',
        },
      },
    ],
  },
  {
    name: 'STOCHRSI',
    isBase: true,
    indicators: [
      {
        displayName: 'Stochastic RSI',
        name: 'STOCHRSI',
        params: {
          period: '14',
          max: 1,
          min: 0,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'value',
        },
      },
    ],
  },
  {
    name: 'TR',
    isBase: true,
    indicators: [
      {
        displayName: 'True Range',
        name: 'TR',
        params: {
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          isValueFixed: false,
          isPriceRelated: false,
          input: 'candle',
        },
      },
    ],
  },
  {
    name: 'WMA',
    isBase: true,
    indicators: [
      {
        displayName: 'Weighted Moving Average',
        name: 'WMA',
        params: {
          period: '14',
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          isValueFixed: false,
          isPriceRelated: true,
          input: 'value',
        },
      },
    ],
  },
  {
    name: 'WSMA',
    isBase: true,
    indicators: [
      {
        displayName: "Wilder's Smoothed Moving Average",
        name: 'WSMA',
        params: {
          period: '14',
          max: Number.MAX_SAFE_INTEGER,
          min: 0,
          isValueFixed: false,
          isPriceRelated: true,
          input: 'value',
        },
      },
    ],
  },
];
