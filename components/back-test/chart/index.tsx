import {
  forwardRef,
  useEffect,
  useImperativeHandle,
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
  MouseEventParams,
  SeriesOptionsCommon,
  SeriesType,
  Time,
  WhitespaceData,
} from 'lightweight-charts';
import useGetCandles from ' /hooks/use-get-candles';
import { useIndicatorStore } from '../store/indicator-store';
import { getIndicatorData } from ' /application/indicator';
import IndicatorChart from './indicator-chart';
import { Flex, Title, Tooltip, Divider, Text, Segmented } from ' /styled-antd';
import { paramsSetting } from '../store/constants';

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

const Chart = forwardRef(function Chart(
  {
    symbol,
  }: {
    symbol: string;
  },
  ref,
) {
  const timeframeTourRef = useRef<HTMLElement>(null);
  useImperativeHandle(ref, () => ({
    getTimeframeTourRef: () => {
      return timeframeTourRef.current;
    },
  }));

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { allIndicator, timeframe, changeTimeframe } = useIndicatorStore();
  const indicatorsArr = Object.values(allIndicator);
  const nonPriceRelatedIndicators = indicatorsArr.filter((indicator) => {
    return indicator.indicators.every(
      (indicator) =>
        !indicator.params?.isPriceRelated && indicator.isShowInChart,
    );
  });
  const priceRelatedIndicators = indicatorsArr.filter((indicator) => {
    return indicator.indicators.some(
      (indicator) => indicator.params?.isPriceRelated,
    );
  });

  const options = Object.keys(timeFormatOptions).map((key) => ({
    value: key,
    label: key,
  }));

  const [logicalRange, setLogicalRange] = useState<LogicalRange | null>(null);
  const [dataPoint, setDataPoint] = useState<{
    time: Time;
    value: number;
  }>();

  const [page, setPage] = useState<number>(1);
  const timeframeIndicator = useMemo(() => {
    return indicatorsArr.find((indicator) => indicator.timeframe);
  }, [indicatorsArr]);

  // const radioGroupProps = useRadioGroup({
  //   defaultValue: timeframe,
  //   onChange: (value: string) => {
  //     if (
  //       timeframeIndicator?.timeframe &&
  //       !(timeframeIndicator.timeframe === value)
  //     )
  //       return;
  //     setPage(1); //after onchange, reset page to 1 but setpage is too slow
  //     setTimeframe(value);
  //   },
  // });

  useEffect(() => {
    if (!timeframeIndicator?.timeframe) return;
    changeTimeframe(timeframeIndicator?.timeframe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframeIndicator]);
  //
  //
  //
  // get candles
  const { data } = useGetCandles({
    symbol,
    interval: timeframeIndicator?.timeframe ?? timeframe,
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
        height: chartContainerRef.current.clientHeight - 8,
        layout: {
          background: {
            color: '#17171c',
          },
          textColor: '#727274',
          attributionLogo: false,
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

    // To make crosshair always visible, set the position manually
    chart.subscribeCrosshairMove((param: MouseEventParams<Time>) => {
      setDataPoint(
        param.seriesData.get(candleSeries) as {
          time: Time;
          value: number;
        },
      );
    });

    const resizeChart = () => {
      if (!chart || !chartContainerRef.current) return;
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth - 32,
        height: chartContainerRef.current.clientHeight - 8,
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
    if (!chart) return;
    if (nonPriceRelatedIndicators.length === 0) {
      chart.applyOptions({
        timeScale: {
          barSpacing: 10,
          tickMarkFormatter: (time: number) => {
            return new Intl.DateTimeFormat('en-US', {
              timeZone: 'UTC',
              ...timeFormatOptions[timeframe],
            }).format(time * 1000);
          },
          fixRightEdge: true,
          lockVisibleTimeRangeOnResize: true,
          visible: true,
        },
      });
    }
    if (nonPriceRelatedIndicators.length > 0) {
      chart.applyOptions({
        timeScale: {
          visible: false,
        },
      });
    }
  }, [nonPriceRelatedIndicators, timeframe]);
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
    <Flex
      vertical
      gap="small"
      style={{
        padding: '8px',
        background: '#17171c',
      }}
      flex="1"
    >
      <Title level={4}>Chart</Title>
      <Divider />
      <Flex ref={timeframeTourRef}>
        <Tooltip
          open={!!timeframeIndicator?.timeframe}
          title={`${timeframeIndicator?.name} only support on ${timeframeIndicator?.timeframe} timeframe`}
        >
          <Segmented
            options={options}
            onChange={(value) => {
              if (
                timeframeIndicator?.timeframe &&
                !(timeframeIndicator.timeframe === value)
              )
                return;
              setPage(1); //after onchange, reset page to 1 but setpage is too slow
              changeTimeframe(value as string);
            }}
            // value={timeframe}
          />
        </Tooltip>
      </Flex>
      <Flex vertical>
        <Text
          style={{
            fontSize: '10px',
          }}
        >
          {priceRelatedIndicators?.length > 0 &&
            priceRelatedIndicators
              ?.flatMap((i) => i.indicators)
              .flatMap((i) => {
                const displayName = i.displayName || i.name;
                let params = '';
                Object.entries(i.params).forEach(([key, value]) => {
                  if (!paramsSetting.includes(key)) return;
                  if (params === '') {
                    params += ` (${value}`;
                  } else {
                    params += `, ${value}`;
                  }
                });
                params += `)`;

                return displayName + params;
              })
              .join(', ')}
        </Text>
        <Flex
          style={{
            position: 'relative',
            width: '100%',
            minWidth: '300px',
            padding: '4px',
            height: '450px',
            minHeight: '400px',
          }}
          ref={chartContainerRef}
        >
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
            }}
            id="chart"
          />
        </Flex>
        {nonPriceRelatedIndicators.length > 0 &&
          chart &&
          logicalRange &&
          nonPriceRelatedIndicators.map((indicator, i) => {
            const id = indicator.indicators.reduce((acc, cur) => {
              return acc + cur.id;
            }, '');
            return (
              <Flex vertical key={id}>
                <Text
                  style={{
                    fontSize: '10px',
                  }}
                >
                  {indicator?.indicators
                    ?.map((i) => {
                      const displayName = i.displayName || i.name;
                      let params = '';
                      Object.entries(i.params).forEach(([key, value]) => {
                        if (!paramsSetting.includes(key)) return;
                        if (params === '') {
                          params += ` (${value}`;
                        } else {
                          params += `, ${value}`;
                        }
                      });
                      params += `)`;

                      return displayName + params;
                    })
                    .join(', ')}
                </Text>
                {data?.candles ? (
                  <IndicatorChart
                    id={id}
                    indicator={indicator}
                    data={data}
                    timeframe={timeframe}
                    logicalRange={logicalRange}
                    dataPoint={dataPoint}
                    showTimeScaleId={
                      nonPriceRelatedIndicators.length === i + 1 ? id : ''
                    }
                  />
                ) : (
                  <div
                    key={i}
                    style={{
                      width: '100%',
                      height: '100px',
                      minHeight: '100px',
                      position: 'relative',
                    }}
                  />
                )}
              </Flex>
            );
          })}
      </Flex>
    </Flex>
  );
});

export default Chart;
