import {
  FasterAC,
  FasterAccelerationBands,
  FasterAO,
  FasterATR,
  FasterBollingerBands,
  FasterBollingerBandsWidth,
  FasterCCI,
  FasterCG,
  FasterDX,
  FasterMAD,
  FasterMOM,
  FasterOBV,
  FasterROC,
  FasterStochasticOscillator,
  FasterStochasticRSI,
  FasterTR,
  FasterWMA,
  FasterWSMA,
} from 'trading-signals';

const fasterAccelerationBands = new FasterAccelerationBands(10, 4); // period, deviation

// Accelerator Oscillator
const fasterAC = new FasterAC(5, 34, 5); //short, long

// Awesome Oscillator
const fasterAO = new FasterAO(5, 34); // short, long

// Average True Range
const fasterATR = new FasterATR(14); // period

// Bollinger Band Width
const fasterBollingerBandsWidth = new FasterBollingerBandsWidth(
  new FasterBollingerBands(20, 4),
); // period, deviation

//Center of Gravity
const fasterCG = new FasterCG(10, 3); //period, signal

// Commodity Channel Index
const fasterCCI = new FasterCCI(14); //period

//Directional Movement Index
const fasterDX = new FasterDX(14); // period

//Mean Absolute Deviation
const fasterMAD = new FasterMAD(14); // period

//Momentum (MOM / MTM)
const fasterMOM = new FasterMOM(14); // period

// //On-Balance Volume
const fasterOBV = new FasterOBV();

//Rate-of-Change
const fasterROC = new FasterROC(14); // period

//Stochastic Oscillator
const fasterStochasticOscillator = new FasterStochasticOscillator(14, 3, 3); //K, D, slow

//FasterStochasticRSI
const fasterStochasticRSI = new FasterStochasticRSI(14); // period

//True Range
const fasterTR = new FasterTR();

//Weighted Moving Average
const fasterWMA = new FasterWMA(14); //period

//Wilder's Smoothed Moving Average
const fasterWSMA = new FasterWSMA(14); //period

const candles = [
  {
    open: 3,
    close: 5,
    low: 1,
    high: 6,
    volume: 4,
  },
  {
    open: 5,
    close: 6,
    low: 4,
    high: 7,
    volume: 5,
  },
  {
    open: 6,
    close: 7,
    low: 5,
    high: 8,
    volume: 6,
  },
  {
    open: 7,
    close: 8,
    low: 6,
    high: 9,
    volume: 7,
  },
  {
    open: 8,
    close: 9,
    low: 7,
    high: 10,
    volume: 8,
  },
  {
    open: 9,
    close: 10,
    low: 8,
    high: 11,
    volume: 9,
  },
  {
    open: 10,
    close: 11,
    low: 9,
    high: 12,
    volume: 10,
  },
  {
    open: 11,
    close: 12,
    low: 10,
    high: 13,
    volume: 11,
  },
  {
    open: 12,
    close: 13,
    low: 11,
    high: 14,
    volume: 12,
  },
  {
    open: 13,
    close: 14,
    low: 12,
    high: 15,
    volume: 13,
  },
  {
    open: 14,
    close: 15,
    low: 13,
    high: 16,
    volume: 14,
  },
  {
    open: 15,
    close: 16,
    low: 14,
    high: 17,
    volume: 15,
  },
  {
    open: 16,
    close: 17,
    low: 15,
    high: 18,
    volume: 16,
  },
  {
    open: 17,
    close: 18,
    low: 16,
    high: 19,
    volume: 17,
  },
  {
    open: 18,
    close: 19,
    low: 17,
    high: 20,
    volume: 18,
  },
  {
    open: 19,
    close: 20,
    low: 18,
    high: 21,
    volume: 19,
  },
];

candles.forEach((candle) => {
  console.log('Acceleration Bands: ', fasterAccelerationBands.update(candle));
  console.log('AC: ', fasterAC.update(candle));
  console.log('AO: ', fasterAO.update(candle));
  console.log('ATR: ', fasterATR.update(candle));
  console.log(
    'Bollinger Bands Width: ',
    fasterBollingerBandsWidth.update(candle.close),
  );
  console.log('CG: ', fasterCG.update(candle.close));
  console.log('CCI: ', fasterCCI.update(candle));
  console.log('DX: ', fasterDX.update(candle));
  console.log('MAD: ', fasterMAD.update(candle.close));
  console.log('MOM: ', fasterMOM.update(candle.close));
  console.log('OBV: ', fasterOBV.update(candle));
  console.log('ROC: ', fasterROC.update(candle.close));
  console.log(
    'Stochastic Oscillator: ',
    fasterStochasticOscillator.update(candle),
  );
  console.log('Stochastic RSI: ', fasterStochasticRSI.update(candle.close));
  console.log('TR: ', fasterTR.update(candle));
  console.log('WMA: ', fasterWMA.update(candle.close));
  console.log('WSMA: ', fasterWSMA.update(candle.close));
});
