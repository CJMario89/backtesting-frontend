import { getCandles } from ' /service/chart';
import { useQuery } from '@tanstack/react-query';
import { CandlestickData, Time } from 'lightweight-charts';
import { useRef } from 'react';

type Candles = Record<
  string,
  {
    page: number;
    candles: (CandlestickData<Time> & { volume: number })[];
    isEnd: boolean;
  }
>;

const useGetCandles = ({
  symbol,
  interval,
  page,
  ...options
}: {
  symbol: string;
  interval: string;
  page: number;
  options?: Record<string, string>;
}) => {
  const candles = useRef<Candles>({});
  const query = useQuery({
    queryKey: ['candles', symbol, interval, page],
    queryFn: async () => {
      const response = await getCandles({
        symbol,
        interval,
        page: page.toString(),
      });
      const result = await response.json();
      const newCandles = [
        ...(result ?? []),
        ...(candles.current?.[interval]?.candles ?? []),
      ];

      const isEnd = result?.length === 0;

      candles.current[interval] = {
        candles: newCandles,
        page: isEnd ? page - 1 : page,
        isEnd,
      };
      return candles.current[interval];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(symbol) && Boolean(interval) && Boolean(page),
    staleTime: Infinity,
    ...options,
  });
  return {
    ...query,
    candles,
  };
};

export default useGetCandles;
