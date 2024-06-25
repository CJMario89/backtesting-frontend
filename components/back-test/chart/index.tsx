import { Box, Flex, Heading, useRadioGroup } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

import {
  CandlestickData,
  CandlestickSeriesOptions,
  CandlestickStyleOptions,
  createChart,
  CrosshairMode,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  SeriesOptionsCommon,
  SeriesType,
  Time,
  WhitespaceData,
} from 'lightweight-charts';
import useGetCandles from ' /hooks/use-get-candles';
import { useIndicatorStore } from '../store/indicator-store';
import { RadioToggle } from ' /components/common';
import { getIndicatorData, SupportedIndicators } from ' /service/indicator';

// eslint-disable-next-line no-undef
let timer: NodeJS.Timeout | null = null;
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
let interval = '1m';

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

const timeFormatOptions: Record<string, FormatOptions> = {
  '1m': minutesTimeFormatOptions,
  '5m': minutesTimeFormatOptions,
  '1h': dayTimeFormatOptions,
  '4h': monthTimeFormatOptions,
  '1w': monthTimeFormatOptions,
};

const Chart = ({ symbol }: { symbol: string }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { indicators } = useIndicatorStore();

  const options = Object.keys(timeFormatOptions).map((key) => ({
    value: key,
    label: key,
  }));

  const [page, setPage] = useState<number>(1);

  const radioGroupProps = useRadioGroup({
    defaultValue: options[0].value,
    onChange: () => {
      setPage(1); //after onchange, reset page to 1 but setpage is too slow
    },
  });
  interval = radioGroupProps.value as string;
  const { data } = useGetCandles({
    symbol,
    interval,
    page,
  });

  useEffect(() => {
    const indicatorsArr = Object.values(indicators);
    if (!data?.candles) return;
    if (!chart) return;
    if (Array.isArray(seriesArr) && seriesArr.length > 0) {
      while (seriesArr.length > 0) {
        chart.removeSeries(seriesArr[0]);
        seriesArr.shift();
      }
    }
    if (!(Array.isArray(indicatorsArr) && indicatorsArr.length > 0)) return;
    let positionOffset = 0;
    let positioned: string[] = [];
    indicatorsArr
      .filter(({ isShowInChart }) => isShowInChart)
      .forEach((indicator) => {
        console.log(indicator);
        const { name, params, color } = indicator;
        let series: ISeriesApi<SeriesType> | undefined;
        series = chart.addLineSeries({
          color: 'rgba(255, 144, 0, 1)',
          priceScaleId: name,
          lineWidth: 1,
          priceLineVisible: false,
        });
        series.setData(
          getIndicatorData({
            candles: data?.candles,
            period: Number(params?.period),
            color: color || '#000',
            indicator: name as SupportedIndicators,
          }),
        );
        seriesArr.push(series);
        if (name === 'sma' || name === 'ema') {
          chart.priceScale(name).applyOptions({
            scaleMargins: {
              top: 0.1,
              bottom: 0.5,
            },
          });
        } else if (!positioned.includes(name)) {
          chart.priceScale(name).applyOptions({
            scaleMargins: {
              top: 0.9 - 0.1 * positionOffset,
              bottom: 0.1 * positionOffset,
            },
          });
          positioned.push(name);
          positionOffset++;
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicators, data?.candles]);

  useEffect(() => {
    if (!data?.candles) return;
    if (!candleSeries) return;
    candleSeries.setData(data?.candles);
    flag = true;
    if (page === 1) {
      // chart.timeScale().fitContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
            color: '#000000',
          },
          textColor: 'rgba(255, 255, 255, 0.9)',
        },
        grid: {
          vertLines: {
            color: 'rgba(197, 203, 206, 0.5)',
          },
          horzLines: {
            color: 'rgba(197, 203, 206, 0.5)',
          },
        },
        crosshair: {
          mode: CrosshairMode.Magnet,
        },
        rightPriceScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
          mode: 1,
          scaleMargins: {
            top: 0.1,
            bottom: 0.5,
          },
        },
        timeScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
        },
      },
    );
    chart.applyOptions({
      timeScale: {
        tickMarkFormatter: (time: number) => {
          return new Intl.DateTimeFormat('en-US', {
            timeZone: 'UTC',
            ...timeFormatOptions[interval],
          }).format(time * 1000);
        },
      },
    });

    candleSeries = chart.addCandlestickSeries({
      // upColor: 'rgba(255, 144, 0, 1)',
      // downColor: '#000',
      // borderDownColor: 'rgba(255, 144, 0, 1)',
      // borderUpColor: 'rgba(255, 144, 0, 1)',
      // wickDownColor: 'rgba(255, 144, 0, 1)',
      // wickUpColor: 'rgba(255, 144, 0, 1)',
    });

    const timeScale = chart.timeScale();
    // timeScale.fitContent();
    timeScale.subscribeVisibleLogicalRangeChange(() => {
      if (timer !== null) {
        return;
      }
      timer = setTimeout(() => {
        const logicalRange = timeScale.getVisibleLogicalRange();
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
        timer = null;
      }, 50);
    });

    const resizeChart = () => {
      if (!chart || !chartContainerRef.current) return;
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth - 32,
        height: chartContainerRef.current.clientHeight - 32,
      });
      chart.timeScale().fitContent();
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
  }, [chartContainerRef.current]);

  return (
    <Flex flexDirection="column" gap="4" flex="1">
      <Heading as="h2">Chart</Heading>
      <Flex>
        <RadioToggle variant="text" options={options} {...radioGroupProps} />
      </Flex>
      <Box
        w="full"
        minW="300px"
        ref={chartContainerRef}
        position="relative"
        borderRadius="md"
        border="1px solid"
        borderColor="neutral.50"
        p="4"
        h="500px"
        // h="50vh"
        minH="400px"
      >
        <Box position="absolute" w="full" h="full" id="chart" />
      </Box>
    </Flex>
  );
};

export default Chart;
