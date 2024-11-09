/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { BaseIndicatorExtended, Indicator } from './indicator.type';
import { BackTestOutput } from ' /type';

export type BackTestSignal = {
  id: string;
  action: 'buy' | 'sell';
  upperBound: {
    id?: string;
    indicatorId?: string;
    baseIndicatorId?: string;
    name: string;
    value?: number | Indicator;
  };
  lowerBound: {
    id?: string;
    indicatorId?: string;
    baseIndicatorId?: string;
    name: string;
    value?: number | Indicator;
  };
  indicatorId: string; // 0 for current price
  baseIndicatorId: string; // 0 for current price
  baseIndicator?: BaseIndicatorExtended; // undefined for current price
  logicOperator: 'and' | 'or';
};

export type BackTestSignalStore = {
  tempSignal?: BackTestSignal;
  backTestSignals: BackTestSignal[];
  // backTestResult: BackTestOutput;
  // backtestResults: BackTestOutput[];
  changeTempSignal: (signal: BackTestSignal) => void;
  addBackTestSignal: (signal: BackTestSignal) => void;
  // addBackTestResult: (result: BackTestOutput) => void;
  // removeBackTestResult: () => void;
  changeBackTestSignal: (signal: BackTestSignal) => void;
  removeBackTestSignal: (id: string) => void;
};

export const useBackTestStore = create<BackTestSignalStore>()(
  devtools(
    persist(
      (set) => ({
        backTestSignals: [],
        // backTestResult: {} as BackTestOutput,
        // backtestResults: [],
        changeTempSignal: (signal: BackTestSignal) => {
          return set((state) => {
            return {
              ...state,
              tempSignal: signal,
            };
          });
        },
        addBackTestSignal: (signal: BackTestSignal) => {
          return set((state) => {
            const backTestSignals = [...state.backTestSignals, signal];
            return {
              ...state,
              backTestSignals,
            };
          });
        },
        changeBackTestSignal: (signal: BackTestSignal) => {
          return set((state) => {
            const backTestSignals = state.backTestSignals.map((s) => {
              if (s.id === signal.id) {
                return signal;
              }
              return s;
            });
            return {
              ...state,
              backTestSignals,
            };
          });
        },
        removeBackTestSignal: (id: string) => {
          return set((state) => {
            const backTestSignals = state.backTestSignals.filter(
              (signal) => signal.id !== id,
            );
            return {
              ...state,
              backTestSignals,
            };
          });
        },
        // addBackTestResult: (result: BackTestOutput) => {
        //   return set((state) => {
        //     return {
        //       ...state,
        //       backTestResult: result,
        //     };
        //   });
        // },
        // removeBackTestResult: () => {
        //   return set((state) => {
        //     return {
        //       ...state,
        //       backTestResult: {} as BackTestOutput,
        //     };
        //   });
        // },
      }),
      { name: 'backTest' },
    ),
  ),
);
