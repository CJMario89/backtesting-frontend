export interface BaseIndicator {
  id?: string; //timestamp
  isShowInChart?: boolean;
  name: string;
  params: Record<string, number | string | undefined>;
  displayName: string;
  color?: string;
}

export interface RsiIndicator extends BaseIndicator {
  name: 'rsi';
  params: Record<string, number | string | undefined>;
  // params: {
  //   period: string | undefined;
  //   max: number;
  //   min: number;
  // };
}

export type Indicator = RsiIndicator | BaseIndicator;
