/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Indicator } from './indicator.type';

export type AddIndicator = (indicator: Indicator) => void;
export type SetIndicatorParams = (params: {
  id: string;
  params: Record<string, string>;
}) => void;
export type RemoveIndicator = (params: { id: string }) => void;
export type ToggleChart = (params: { id: string }) => void;

export type SetIndicatorColor = (params: { id: string; color: string }) => void;

interface IndicatorStore {
  indicators: Record<string, Indicator>;
  addIndicator: AddIndicator;
  setIndicatorParams: SetIndicatorParams;
  removeIndicator: RemoveIndicator;
  toggleChart: ToggleChart;
  setIndicatorColor: SetIndicatorColor;
}

export const useIndicatorStore = create<IndicatorStore>()(
  devtools(
    persist(
      (set) => ({
        indicators: {} as Record<string, Indicator>,
        addIndicator: (indicator) => {
          const id = new Date().getTime().toString();
          return set((state: IndicatorStore) => {
            const indicators: Record<string, Indicator> = {
              ...state.indicators,
              [id]: {
                ...indicator,
                isShowInChart: true,
                color: '#BB6611',
                id,
              },
            };
            return {
              ...state,
              indicators,
            };
          });
        },
        setIndicatorParams: ({
          id,
          params,
        }: {
          id: string;
          params: Record<string, string>;
        }) => {
          return set((state) => {
            const indicators = {
              ...state.indicators,
              [id]: {
                ...state.indicators[id],
                params: {
                  ...params,
                },
                displayName: `${state.indicators[id].name}${params?.period ? ` ${params?.period}` : ''} `,
              },
            };
            return {
              ...state,
              indicators,
            };
          });
        },
        setIndicatorColor: ({ id, color }: { id: string; color: string }) => {
          return set((state) => {
            const indicators = {
              ...state.indicators,
              [id]: {
                ...state.indicators[id],
                color,
              },
            };
            return {
              ...state,
              indicators,
            };
          });
        },
        removeIndicator: ({ id }: { id: string }) => {
          return set((state) => {
            const indicators = { ...state.indicators };
            delete indicators[id];
            return {
              ...state,
              indicators,
            };
          });
        },
        toggleChart: ({ id }: { id: string }) => {
          return set((state) => {
            const indicators = {
              ...state.indicators,
              [id]: {
                ...state.indicators[id],
                isShowInChart: state.indicators[id].isShowInChart
                  ? false
                  : true,
              },
            };
            return {
              ...state,
              indicators,
            };
          });
        },
      }),
      { name: 'indicator' },
    ),
  ),
);
