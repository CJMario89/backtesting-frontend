/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  Indicator,
  IndicatorExtended,
  IndicatorParams,
} from './indicator.type';

import { v4 as uuid } from 'uuid';
import { colorFixedArr } from './constants';

export type AddIndicator = (indicator: Indicator) => void;
export type SetIndicatorParams = (params: {
  id: string;
  baseId: string;
  params: IndicatorParams;
}) => void;
export type RemoveIndicator = (params: { id: string }) => void;
export type ToggleChart = (params: { id: string; baseId: string }) => void;

export type SetIndicatorColor = (params: {
  id: string;
  baseId: string;
  color: string;
}) => void;

interface IndicatorStore {
  allIndicator: Record<string, IndicatorExtended>;
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
        allIndicator: {} as Record<string, IndicatorExtended>,
        addIndicator: (indicator) => {
          const id = indicator.name === 'volume' ? 'volume' : uuid();
          return set((state) => {
            const allIndicator: Record<string, IndicatorExtended> = {
              ...state.allIndicator,
              [id]: {
                ...indicator,
                name: indicator.name,
                indicators: indicator.indicators.map((baseIndicator) => ({
                  displayName: `${baseIndicator.name}${
                    baseIndicator.params?.period
                      ? ` ${baseIndicator.params?.period}`
                      : ''
                  } `,
                  ...baseIndicator,
                  id,
                  baseId: indicator.name === 'volume' ? 'volume' : uuid(),
                  name: baseIndicator.name,
                  isShowInChart: true,
                  color: '#ffaa50',
                  ...(colorFixedArr.includes(indicator.name)
                    ? { isColorFixed: true }
                    : {}),
                })),
              },
            };
            return {
              ...state,
              allIndicator,
            };
          });
        },
        setIndicatorParams: ({
          id,
          baseId,
          params,
        }: {
          id: string;
          baseId: string;
          params: IndicatorParams;
        }) => {
          return set((state) => {
            const allIndicator: Record<string, IndicatorExtended> = {
              ...state.allIndicator,
              [id]: {
                ...state.allIndicator[id],
                indicators: state.allIndicator[id].indicators.map(
                  (indicator) => {
                    if (indicator.baseId === baseId) {
                      return {
                        ...indicator,
                        params,
                        displayName: `${state.allIndicator[id].name}${params?.period ? ` ${params?.period}` : ''} `,
                      };
                    } else {
                      return indicator;
                    }
                  },
                ),
              },
            };
            return {
              ...state,
              allIndicator,
            };
          });
        },
        setIndicatorColor: ({
          id,
          baseId,
          color,
        }: {
          id: string;
          baseId: string;
          color: string;
        }) => {
          return set((state) => {
            const allIndicator = {
              ...state.allIndicator,
              [id]: {
                ...state.allIndicator[id],
                indicators: state.allIndicator[id].indicators.map(
                  (indicator) => {
                    if (indicator.baseId === baseId) {
                      return {
                        ...indicator,
                        color,
                      };
                    } else {
                      return indicator;
                    }
                  },
                ),
              },
            };
            return {
              ...state,
              allIndicator,
            };
          });
        },
        removeIndicator: ({ id }: { id: string }) => {
          return set((state) => {
            const allIndicator = { ...state.allIndicator };
            delete allIndicator[id];
            return {
              ...state,
              allIndicator,
            };
          });
        },
        toggleChart: ({ id, baseId }: { id: string; baseId: string }) => {
          return set((state) => {
            const allIndicator = {
              ...state.allIndicator,
              [id]: {
                ...state.allIndicator[id],
                indicators: state.allIndicator[id].indicators.map(
                  (indicator) => {
                    if (indicator.baseId === baseId) {
                      return {
                        ...indicator,
                        isShowInChart: indicator.isShowInChart ? false : true,
                      };
                    } else {
                      return indicator;
                    }
                  },
                ),
              },
            };
            return {
              ...state,
              allIndicator,
            };
          });
        },
      }),
      { name: 'indicator' },
    ),
  ),
);
