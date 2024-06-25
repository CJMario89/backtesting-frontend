import { getRequest } from '../common';

export const getCandles = (query: Record<string, string>) =>
  getRequest('/candles', query);
