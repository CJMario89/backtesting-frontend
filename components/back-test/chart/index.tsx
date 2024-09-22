import {
  Box,
  Divider,
  Flex,
  Heading,
  Tooltip,
  useRadioGroup,
} from '@chakra-ui/react';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  CandlestickData,
  CandlestickSeriesOptions,
  CandlestickStyleOptions,
  createChart,
  CrosshairMode,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  LogicalRange,
  SeriesOptionsCommon,
  SeriesType,
  Time,
  WhitespaceData,
} from 'lightweight-charts';
import useGetCandles from ' /hooks/use-get-candles';
import { useIndicatorStore } from '../store/indicator-store';
import { RadioToggle } from ' /components/common';
import { getIndicatorData } from ' /application/indicator';
import IndicatorChart from './indicator-chart';

let candleSeries: ISeriesApi<
  'Candlestick',
  Time,
  CandlestickData<Time> | WhitespaceData<Time>,
  CandlestickSeriesOptions,
  DeepPartial<CandlestickStyleOptions & SeriesOptionsCommon>
>;
let chart: IChartApi;
let flag = false;
let init = false;

let seriesArr: ISeriesApi<SeriesType>[] = [];

type FormatOptions = Record<string, 'numeric' | '2-digits' | undefined>;

const monthTimeFormatOptions: FormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
};

const dayTimeFormatOptions: FormatOptions = {
  month: 'numeric',
  day: 'numeric',
};

const minutesTimeFormatOptions: FormatOptions = {
  hour: 'numeric',
  minute: 'numeric',
};

export const timeFormatOptions: Record<string, FormatOptions> = {
  '1m': minutesTimeFormatOptions,
  '5m': minutesTimeFormatOptions,
  '1h': dayTimeFormatOptions,
  '4h': monthTimeFormatOptions,
  '1d': monthTimeFormatOptions,
  '3d': monthTimeFormatOptions,
  '1w': monthTimeFormatOptions,
};

const Chart = ({
  symbol,
  timeframe,
  setTimeframe,
}: {
  symbol: string;
  timeframe: string;
  setTimeframe: Dispatch<SetStateAction<string>>;
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { allIndicator } = useIndicatorStore();
  const indicatorsArr = Object.values(allIndicator);
  const options = Object.keys(timeFormatOptions).map((key) => ({
    value: key,
    label: key,
  }));

  const [logicalRange, setLogicalRange] = useState<LogicalRange | null>(null);

  const [page, setPage] = useState<number>(1);

  const timeframeIndicator = useMemo(() => {
    return indicatorsArr.find((indicator) => indicator.timeframe);
  }, [indicatorsArr]);
  //
  //
  //
  // radio group
  const radioGroupProps = useRadioGroup({
    defaultValue: timeframe,
    onChange: (value: string) => {
      if (
        timeframeIndicator?.timeframe &&
        !(timeframeIndicator.timeframe === value)
      )
        return;
      setPage(1); //after onchange, reset page to 1 but setpage is too slow
      setTimeframe(value);
    },
  });

  useEffect(() => {
    if (!timeframeIndicator?.timeframe) return;
    radioGroupProps.onChange(timeframeIndicator?.timeframe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframeIndicator, radioGroupProps.value]);
  //
  //
  //
  // get candles
  const { data } = useGetCandles({
    symbol,
    interval:
      timeframeIndicator?.timeframe ?? (radioGroupProps.value as string),
    page,
  });
  //
  //
  //
  // render chart indicators
  useEffect(() => {
    if (!data?.candles) return;
    if (!chart) return;
    if (Array.isArray(seriesArr) && seriesArr.length > 0) {
      while (seriesArr.length > 0) {
        chart.removeSeries(seriesArr[0]);
        seriesArr.shift();
      }
    }
    if (!(Array.isArray(indicatorsArr) && indicatorsArr.length > 0)) return;

    indicatorsArr
      .flatMap((indicator) => indicator.indicators)
      .filter(({ isShowInChart }) => isShowInChart)
      .forEach((indicator) => {
        const { name, params, color } = indicator;
        if (!params?.isPriceRelated) return;
        //three return in macd indicator
        const indicatorData = getIndicatorData({
          candles: data?.candles,
          params,
          color: color || '#000',
          indicator: name,
        });
        Object.entries(indicatorData).forEach(([key, value]) => {
          let series: ISeriesApi<SeriesType> | undefined;
          if (key === 'histogram') {
            series = chart.addHistogramSeries({
              priceLineVisible: false,
            });
            series.setData(value);
          } else {
            series = chart.addLineSeries({
              lineWidth: 1,
              priceLineVisible: false,
            });
            series.setData(value);
          }
          seriesArr.push(series);
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allIndicator, data?.candles]);
  //
  //
  //
  // render chart candles
  useEffect(() => {
    if (!data?.candles) return;
    if (!data?.candles.length) return;
    if (!candleSeries) return;
    candleSeries.setData(data?.candles);
    if (!data.isEnd) {
      flag = true;
    }
    if (page === 1) {
      chart
        .timeScale()
        .scrollToPosition(
          Number(data.candles[data.candles.length - 1].time),
          false,
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  //
  //
  //
  // render chart
  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (!setPage) return;
    if (init) return;
    if (!document.querySelector('#chart')) return;
    chart = createChart(
      (document.querySelector('#chart') as HTMLElement) ?? '',
      {
        width: chartContainerRef.current.clientWidth - 32,
        height: chartContainerRef.current.clientHeight - 32,
        layout: {
          background: {
            color: '#17171c',
          },
          textColor: '#727274',
        },
        grid: {
          vertLines: {
            color: '#49494E',
          },
          horzLines: {
            color: '#49494E',
          },
        },
        crosshair: {
          mode: CrosshairMode.Magnet,
        },
        rightPriceScale: {
          minimumWidth: 80,
        },
      },
    );
    candleSeries = chart.addCandlestickSeries({});
    const timeScale = chart.timeScale();

    timeScale.subscribeVisibleLogicalRangeChange(() => {
      const logicalRange = timeScale.getVisibleLogicalRange();
      setLogicalRange(logicalRange);
      if (logicalRange !== null) {
        const barsInfo = candleSeries.barsInLogicalRange(logicalRange);
        if (
          typeof barsInfo?.barsBefore !== 'undefined' &&
          barsInfo?.barsBefore < 1000
        ) {
          if (flag) {
            setPage((prev) => prev + 1);
            flag = false;
          }
        }
      }
    });

    const resizeChart = () => {
      if (!chart || !chartContainerRef.current) return;
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth - 32,
        height: chartContainerRef.current.clientHeight - 32,
      });
      // chart.timeScale().fitContent();
    };
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          resizeChart();
        }
      }
    });
    init = true;

    resizeObserver.observe(chartContainerRef.current);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartContainerRef.current, data]);

  // render chart time scale
  useEffect(() => {
    console.log(chart);
    console.log(indicatorsArr);
    if (!chart) return;
    if (indicatorsArr.length === 0) {
      chart.applyOptions({
        timeScale: {
          barSpacing: 10,
          tickMarkFormatter: (time: number) => {
            return new Intl.DateTimeFormat('en-US', {
              timeZone: 'UTC',
              ...timeFormatOptions[radioGroupProps.value as string],
            }).format(time * 1000);
          },
          fixRightEdge: true,
          lockVisibleTimeRangeOnResize: true,
        },
      });
    }
    if (indicatorsArr.length > 0) {
      chart.applyOptions({
        timeScale: {
          visible: false,
        },
      });
    }
  }, [indicatorsArr, radioGroupProps.value]);
  //
  //
  //
  // // render trade markers
  // useEffect(() => {
  //   if (!chart) return;
  //   if (!backTestResult.buySellCandlesPairs) return;
  //   if (backTestResult.timeFrame !== timeframe) {
  //     removeBackTestResult();
  //     candleSeries.setMarkers([]);
  //     return;
  //   }
  //   const trades = backTestResult.buySellCandlesPairs;
  //   if (trades.length === 0) return;
  //   const tradeMarkers = trades
  //     .flatMap((trade, i) => {
  //       return [
  //         {
  //           time: Number(trade.buy.time) / 1000,
  //           position: 'belowBar',
  //           color: 'green',
  //           shape: 'arrowUp',
  //           text: 'Buy@' + i,
  //         },
  //         {
  //           time: Number(trade.sell.time) / 1000,
  //           position: 'aboveBar',
  //           color: 'red',
  //           shape: 'arrowDown',
  //           text: 'Sell@' + i,
  //         },
  //       ] as SeriesMarker<Time>[];
  //     })
  //     .sort((a, b) => (Number(a.time) - Number(b.time) > 0 ? 1 : -1));
  //   candleSeries.setMarkers(tradeMarkers);
  //   //data may not be ready
  //   chart.timeScale().scrollToPosition(Number(trades[0].buy.time) / 1000, true);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [backTestResult, timeframe]);

  return (
    <Flex flexDirection="column" gap="2" flex="1" p="2" bg="darkTheme.800">
      <Heading as="h4">Chart</Heading>
      <Divider />
      <Flex>
        <Tooltip
          isDisabled={!timeframeIndicator?.timeframe}
          shouldWrapChildren={true}
          label={`${timeframeIndicator?.name} only support on ${timeframeIndicator?.timeframe} timeframe`}
        >
          <RadioToggle
            variant="text"
            options={options}
            {...radioGroupProps}
            isDisabled={!!timeframeIndicator?.timeframe}
            cursor={!timeframeIndicator?.timeframe ? 'pointer' : 'not-allowed'}
          />
        </Tooltip>
      </Flex>
      <Flex flexDirection="column">
        <Box
          w="full"
          minW="300px"
          ref={chartContainerRef}
          position="relative"
          p="4"
          h="500px"
          // h="50vh"
          minH="400px"
        >
          <Box position="absolute" w="full" h="full" id="chart" />
        </Box>
        {indicatorsArr.length > 0 &&
          data?.candles &&
          chart &&
          logicalRange &&
          indicatorsArr.map((indicator, i) => {
            const id = indicator.indicators.reduce((acc, cur) => {
              return acc + cur.id;
            }, '');
            return (
              <IndicatorChart
                id={id}
                key={id}
                indicator={indicator}
                data={data}
                timeframe={timeframe}
                logicalRange={logicalRange}
                showTimeScale={indicatorsArr.length === i + 1}
              />
            );
          })}
      </Flex>
    </Flex>
  );
};

export default Chart;
