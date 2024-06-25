import { postRequest } from '../common';

export const postBackTest = (body: any) => postRequest('/backtest', body);
