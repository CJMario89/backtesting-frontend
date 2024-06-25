import {
  BackTestSignal,
  useBackTestStore,
} from ' /components/back-test/store/back-test-store';
import { useIndicatorStore } from ' /components/back-test/store/indicator-store';
import { Indicator } from ' /components/back-test/store/indicator.type';
import { postBackTest } from ' /service/back-test';
import { useMutation } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

const usePostBackTest = ({
  symbol,
  interval,
  start,
  end,
  signals,
  ...options
}: {
  symbol: string;
  interval: string;
  start: string;
  end: string;
  signals: BackTestSignal[];
  options?: Record<string, string>;
}) => {
  const { indicators } = useIndicatorStore();
  const { addBackTestResult } = useBackTestStore();
  const { buySignals, sellSignals } = convertSignals(signals, indicators);
  console.log(buySignals);
  console.log(sellSignals);
  return useMutation({
    mutationFn: async () => {
      const response = await postBackTest({
        symbol,
        interval,
        start,
        end,
        buySignals,
        sellSignals,
      });
      const result = await response.json();
      console.log('result');
      console.log(result);
      addBackTestResult(result);
    },
    ...options,
  });
};

function convertSignals(
  signals: BackTestSignal[],
  indicators: Record<string, Indicator>,
) {
  const rawSignals = convertSetting(signals, indicators);
  const rawBuySignals =
    rawSignals.filter((signal) => signal.action === 'buy') ?? [];
  const buySignals = [];
  while (rawBuySignals.length > 0) {
    const buySignal: any[] = [];
    while (rawBuySignals.length > 0) {
      const rawBuySignal = rawBuySignals.shift();
      if (rawBuySignal?.indicator) {
        buySignal.push(rawBuySignal);
      }
      if (rawBuySignal?.logicOperator === 'or') {
        break;
      }
    }
    buySignals.push(buySignal);
  }
  const rawSellSignals =
    rawSignals.filter((signal) => signal.action === 'sell') ?? [];
  const sellSignals = [];
  while (rawSellSignals.length > 0) {
    const sellSignal: any[] = [];
    while (rawSellSignals.length > 0) {
      const rawSellSignal = rawSellSignals.shift();
      if (rawSellSignal?.indicator) {
        sellSignal.push(rawSellSignal);
      }
      if (rawSellSignal?.logicOperator === 'or') {
        break;
      }
    }
    sellSignals.push(sellSignal);
  }
  return {
    buySignals: buySignals.filter((signal) => signal),
    sellSignals,
  };
}

function convertSetting(
  signals: BackTestSignal[],
  indicators: Record<string, Indicator>,
) {
  // previous, max, min, indicatorId,
  const rawSignals = signals.map((signal) => {
    const valueMap: any = {
      previous: 'previous',
      max: indicators[signal.indicatorId]?.params?.max,
      min: indicators[signal.indicatorId]?.params?.min,
    };
    const upperBound = {
      id: uuidv4(),
      name: signal.upperBound.name,
      value:
        signal.upperBound.value ??
        valueMap[signal.upperBound.name] ??
        indicators[signal.upperBound.name] ??
        indicators[signal.indicatorId]?.params?.max ??
        100,
    };
    const lowerBound = {
      id: uuidv4(),
      name: signal.lowerBound.name,
      value:
        signal.lowerBound.value ??
        valueMap[signal.lowerBound.name] ??
        indicators[signal.lowerBound.name] ??
        indicators[signal.indicatorId]?.params?.min ??
        0,
    };
    return {
      ...signal,
      upperBound,
      lowerBound,
      id: uuidv4(),
    };
  });
  return rawSignals;
}

export default usePostBackTest;
