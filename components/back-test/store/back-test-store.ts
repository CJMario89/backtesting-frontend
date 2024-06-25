/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Indicator } from './indicator.type';
import { BackTestOutput } from ' /type';

export type BackTestSignal = {
  id: string;
  action: 'buy' | 'sell';
  upperBound: {
    id?: string;
    name: string;
    value?: number | Indicator;
  };
  lowerBound: {
    id?: string;
    name: string;
    value?: number | Indicator;
  };
  indicatorId: string; // indicator id
  indicator?: Indicator; // indicator id
  logicOperator: 'and' | 'or';
};

export type BackTestSignalStore = {
  backTestSignals: BackTestSignal[];
  backTestResult: BackTestOutput;
  addBackTestSignal: (signal: BackTestSignal) => void;
  addBackTestResult: (result: BackTestOutput) => void;
  changeBackTestSignal: (signal: BackTestSignal) => void;
  removeBackTestSignal: (id: string) => void;
};

export const useBackTestStore = create<BackTestSignalStore>()(
  devtools(
    persist(
      (set) => ({
        backTestSignals: [],
        backTestResult: {} as BackTestOutput,
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
        addBackTestResult: (result: BackTestOutput) => {
          return set((state) => {
            return {
              ...state,
              backTestResult: result,
            };
          });
        },
      }),
      { name: 'backTest' },
    ),
  ),
);
