import { BackTestSignal } from ' /components/back-test/store/back-test-store';
import { useIndicatorStore } from ' /components/back-test/store/indicator-store';
import { IndicatorExtended } from ' /components/back-test/store/indicator.type';
import { postBackTest } from ' /service/back-test';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import getCurrentIndicatorFromSignal from './get-current-indicator-from-signal';
import { db } from ' /app/indexDB';

type UsePostBackTestProps = UseMutationOptions<
  void,
  Error,
  {
    symbol: string;
    interval: string;
    start: string;
    end: string;
    capital: number;
    takeProfit?: number;
    stopLoss?: number;
    signals: BackTestSignal[];
  }
>;

const usePostBackTest = (options?: UsePostBackTestProps) => {
  const { allIndicator } = useIndicatorStore();

  return useMutation({
    mutationFn: async ({
      symbol,
      interval,
      start,
      end,
      capital,
      takeProfit,
      stopLoss,
      signals,
    }: {
      symbol: string;
      interval: string;
      start: string;
      end: string;
      capital: number;
      takeProfit?: number;
      stopLoss?: number;
      signals: BackTestSignal[];
    }) => {
      const { buySignals, sellSignals } = convertSignals(signals, allIndicator);

      const response = await postBackTest({
        symbol,
        interval,
        start,
        end,
        capital,
        takeProfit,
        stopLoss,
        buySignals,
        sellSignals,
      });
      const result = await response.json();
      db.backtestResult.add({
        name: 'Untitled',
        annualizedReturn: result.annualizedReturn,
        totalMaxDrawdown: result.totalMaxDrawdown,
        totalDuration: result.totalDuration,
        totalProfit: result.totalProfit,
        profitRate: result.profitRate,
        initialCapital: capital,
        capital: capital + result.totalProfit,
        buySellCandlesPairs: result.buySellCandlesPairs,
        candles: result.candles,
        startTime: result.startTime,
        endTime: result.endTime,
        allIndicator,
        signals,
        timeframe: interval,
        createdAt: new Date().toLocaleString(),
      });
    },
    ...options,
  });
};

function convertSignals(
  signals: BackTestSignal[],
  allIndicator: Record<string, IndicatorExtended>,
) {
  const rawSignals = convertSetting(signals, allIndicator);
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
  allIndicator: Record<string, IndicatorExtended>,
) {
  // previous, max, min, indicatorId,
  const rawSignals = signals.map((signal) => {
    const { baseIndicator } = getCurrentIndicatorFromSignal({
      signal,
      allIndicator,
    });
    const valueMap: any = {
      previous: 'previous',
      max: baseIndicator?.params.max,
      min: baseIndicator?.params.min,
      price: 'price',
    };
    const upperBound = {
      id: uuidv4(),
      name: signal.upperBound.name,
      value:
        signal.upperBound.value ??
        valueMap[signal.upperBound.name] ??
        allIndicator[signal.upperBound?.indicatorId ?? '']?.indicators.find(
          (baseIndicator) =>
            baseIndicator.baseId === signal.upperBound?.baseIndicatorId,
        ) ?? // indicator id
        baseIndicator?.params?.max ??
        100,
    };
    const lowerBound = {
      id: uuidv4(),
      name: signal.lowerBound.name,
      value:
        signal.lowerBound.value ??
        valueMap[signal.lowerBound.name] ??
        allIndicator[signal.lowerBound?.indicatorId ?? '']?.indicators.find(
          (baseIndicator) =>
            baseIndicator.baseId === signal.lowerBound?.baseIndicatorId,
        ) ?? // indicator id
        baseIndicator?.params?.min ??
        0,
    };
    const id = uuidv4();
    return {
      // return back end structure
      id,
      indicator: { ...baseIndicator, id, baseId: id },
      action: signal.action,
      logicOperator: signal.logicOperator,
      upperBound,
      lowerBound,
    };
  });
  return rawSignals;
}

export default usePostBackTest;
