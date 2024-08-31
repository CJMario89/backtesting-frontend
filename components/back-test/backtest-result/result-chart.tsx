import { useEffect, useRef } from 'react';
import { useBackTestStore } from '../store/back-test-store';
import {
  CandlestickData,
  CandlestickSeriesOptions,
  CandlestickStyleOptions,
  createChart,
  CrosshairMode,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  SeriesMarker,
  SeriesOptionsCommon,
  SeriesType,
  Time,
  WhitespaceData,
} from 'lightweight-charts';
import { useIndicatorStore } from '../store/indicator-store';
import { getIndicatorData } from ' /application/indicator';
import { timeFormatOptions } from '../chart';
import { Box, Divider, Flex, Heading } from '@chakra-ui/react';

let candleSeries: ISeriesApi<
  'Candlestick',
  Time,
  CandlestickData<Time> | WhitespaceData<Time>,
  CandlestickSeriesOptions,
  DeepPartial<CandlestickStyleOptions & SeriesOptionsCommon>
>;
let chart: IChartApi;
let init = false;

let seriesArr: ISeriesApi<SeriesType>[] = [];

const ResultChart = () => {
  const { backTestResult } = useBackTestStore();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { allIndicator } = useIndicatorStore();
  const indicatorsArr = Object.values(allIndicator);
  //
  //
  //
  // render chart indicators
  useEffect(() => {
    if (!backTestResult?.candles) return;
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
      .flatMap((indicator) => indicator.indicators)
      .filter(({ isShowInChart }) => isShowInChart)
      .forEach((indicator) => {
        const { name, params, color } = indicator;

        //three return in macd indicator
        const indicatorData = getIndicatorData({
          candles: backTestResult?.candles,
          params,
          color: color || '#000',
          indicator: name,
        });
        Object.entries(indicatorData).forEach(([key, value]) => {
          let series: ISeriesApi<SeriesType> | undefined;
          if (key === 'histogram') {
            series = chart.addHistogramSeries({
              priceScaleId: name,
              priceLineVisible: false,
            });
            series.setData(value);
          } else {
            series = chart.addLineSeries({
              priceScaleId: params.isPriceRelated ? 'right' : name,
              lineWidth: 1,
              priceLineVisible: false,
            });
            series.setData(value);
          }
          seriesArr.push(series);
        });

        if (!positioned.includes(name) && !params.isPriceRelated) {
          chart.priceScale(name).applyOptions({
            scaleMargins: {
              top: 0.78 - 0.1 * positionOffset,
              bottom: 0.12 * positionOffset + 0.1,
            },
          });
          positioned.push(name);
          positionOffset++;
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allIndicator, backTestResult?.candles]);
  //
  //
  //
  // render chart candles
  useEffect(() => {
    if (!backTestResult?.candles) return;
    if (!candleSeries) return;
    candleSeries.setData(backTestResult?.candles);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backTestResult]);
  //
  //
  //
  // render chart
  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (init) return;
    if (!document.querySelector('#result-chart')) return;
    chart = createChart(
      (document.querySelector('#result-chart') as HTMLElement) ?? '',
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
          scaleMargins: {
            top: 0.05,
            bottom: 0.4,
          },
        },
        timeScale: {
          // borderColor: 'rgba(197, 203, 206, 0.8)',
          // barSpacing: 10,
        },
      },
    );
    chart.applyOptions({
      timeScale: {
        tickMarkFormatter: (time: number) => {
          return new Intl.DateTimeFormat('en-US', {
            timeZone: 'UTC',
            ...timeFormatOptions[backTestResult.timeFrame],
          }).format(time * 1000);
        },
        fixRightEdge: true,
        lockVisibleTimeRangeOnResize: true,
      },
    });
    candleSeries = chart.addCandlestickSeries({});
    // const timeScale = chart.timeScale();

    // timeScale.subscribeVisibleLogicalRangeChange(() => {
    //   if (timer !== null) {
    //     return;
    //   }
    //   timer = setTimeout(() => {
    //     const logicalRange = timeScale.getVisibleLogicalRange();
    //     if (logicalRange !== null) {
    //       const barsInfo = candleSeries.barsInLogicalRange(logicalRange);
    //       if (
    //         typeof barsInfo?.barsBefore !== 'undefined' &&
    //         barsInfo?.barsBefore < 1000
    //       ) {
    //         if (flag) {
    //           setPage((prev) => prev + 1);
    //           flag = false;
    //         }
    //       }
    //     }
    //     timer = null;
    //   }, 50);
    // });

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
  }, [chartContainerRef.current, backTestResult]);
  //
  //
  //
  // render trade markers
  useEffect(() => {
    if (!chart) return;
    if (!backTestResult.buySellCandlesPairs) return;

    const trades = backTestResult.buySellCandlesPairs;
    if (trades.length === 0) return;
    const tradeMarkers = trades
      .flatMap((trade, i) => {
        return [
          {
            time: Number(trade.buy.time) / 1000,
            position: 'belowBar',
            color: 'green',
            shape: 'arrowUp',
            text: 'Buy@' + i,
          },
          {
            time: Number(trade.sell.time) / 1000,
            position: 'aboveBar',
            color: 'red',
            shape: 'arrowDown',
            text: 'Sell@' + i,
          },
        ] as SeriesMarker<Time>[];
      })
      .sort((a, b) => (Number(a.time) - Number(b.time) > 0 ? 1 : -1));
    candleSeries.setMarkers(tradeMarkers);
    chart.timeScale().scrollToPosition(Number(trades[0].buy.time) / 1000, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backTestResult]);

  return (
    <Flex flexDirection="column" gap="2" flex="1" p="2" bg="darkTheme.800">
      <Heading as="h4">Chart</Heading>
      <Divider />
      <Box
        w="full"
        minW="300px"
        ref={chartContainerRef}
        position="relative"
        p="4"
        h="600px"
        // h="50vh"
        minH="400px"
      >
        <Box position="absolute" w="full" h="full" id="result-chart" />
      </Box>
    </Flex>
  );
};

export default ResultChart;
