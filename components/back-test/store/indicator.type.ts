export type IndicatorParams = {
  max: number;
  min: number;
  isPriceRelated?: boolean;
  isValueFixed?: boolean;
  period?: string;
  short?: string;
  long?: string;
  signal?: string;
  deviation?: number;
  times?: number;
  kperiod?: string;
  dperiod?: string;
  slowperiod?: string;
  resultOption?: string;
  input?: IndicatorInput;
};

export type BaseIndicator = {
  name: string;
  params: IndicatorParams;
  displayName?: string;
};

export type Indicator = {
  name: string;
  isBase?: boolean;
  timeframe?: string;
  indicators: BaseIndicator[];
  multiResult?: Record<string, boolean>;
  resultOption?: string;
};

export interface BaseIndicatorExtended extends BaseIndicator {
  id?: string; //uuid
  baseId: string; //uuid
  isShowInChart?: boolean;
  displayName: string;
  color?: string;
  isColorFixed?: boolean;
}

export interface IndicatorExtended extends Indicator {
  name: string;
  indicators: BaseIndicatorExtended[];
}

export type IndicatorInput = 'value' | 'candle' | 'candleVolume';
