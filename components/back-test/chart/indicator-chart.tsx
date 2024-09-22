import { Box } from '@chakra-ui/react';
import {
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  LogicalRange,
  SeriesType,
} from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { timeFormatOptions } from './index';
import { useIndicatorStore } from '../store/indicator-store';
import { getIndicatorData } from ' /application/indicator';
import { IndicatorExtended } from '../store/indicator.type';
const IndicatorChart = ({
  id,
  timeframe,
  data,
  indicator,
  logicalRange,
  showTimeScale,
}: {
  id: string;
  timeframe: string;
  data?: any;
  indicator?: IndicatorExtended;
  logicalRange: LogicalRange | null;
  showTimeScale: boolean;
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const seriesArr = useRef<ISeriesApi<SeriesType>[]>([]);
  const { allIndicator } = useIndicatorStore();
  const indicatorsArr = Object.values(allIndicator);

  useEffect(() => {
    if (!data) return;
    if (!chartContainerRef.current) return;
    const chartDom = document.querySelector('#' + CSS.escape(id));
    if (!chartDom) return;
    if (chart.current) return;
    chart.current = createChart((chartDom as HTMLElement) ?? '', {
      handleScale: false,
      handleScroll: false,
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
      rightPriceScale: {
        visible: true,
        minimumWidth: 80,
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
      },
    });

    if (!data?.candles) return;
    if (!chart.current) return;
    if (Array.isArray(seriesArr.current) && seriesArr.current.length > 0) {
      while (seriesArr.current.length > 0) {
        try {
          chart.current.removeSeries(seriesArr.current[0]);
        } catch (e) {
          console.log(e);
        }
        seriesArr.current.shift();
      }
    }
    if (!(Array.isArray(indicatorsArr) && indicatorsArr.length > 0)) return;

    indicator?.indicators?.forEach((baseIndicator) => {
      const { name, params, color } = baseIndicator;

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
          series = chart.current?.addHistogramSeries({
            priceLineVisible: false,
          });
          series?.setData(value);
        } else {
          series = chart.current?.addLineSeries({
            lineWidth: 1,
            priceLineVisible: false,
          });
          series?.setData(value);
        }
        if (!series) return;
        seriesArr.current?.push(series);
      });
    });

    const resizeChart = () => {
      if (!chart || !chartContainerRef.current) return;
      chart.current?.applyOptions({
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

    resizeObserver.observe(chartContainerRef.current);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartContainerRef.current, data]);

  useEffect(() => {
    if (!logicalRange) return;
    if (!chart) return;
    if (!data) return;
    const timeScale = chart.current?.timeScale();
    timeScale?.fitContent();
    timeScale?.setVisibleLogicalRange(logicalRange);
  }, [logicalRange, data]);

  // render chart time scale
  useEffect(() => {
    if (!data) return;
    if (!chart) return;
    if (seriesArr.current.length === 0) return;
    if (showTimeScale) {
      chart.current?.applyOptions({
        timeScale: {
          barSpacing: 10,
          tickMarkFormatter: (time: number) => {
            return new Intl.DateTimeFormat('en-US', {
              timeZone: 'UTC',
              ...timeFormatOptions[timeframe as string],
            }).format(time * 1000);
          },
          fixRightEdge: true,
          lockVisibleTimeRangeOnResize: true,
        },
      });
    }
    if (!showTimeScale) {
      chart.current?.applyOptions({
        timeScale: {
          visible: false,
        },
      });
    }
  }, [data, showTimeScale, timeframe, seriesArr]);

  return (
    <Box
      w="full"
      minW="300px"
      position="relative"
      p="4"
      h="100px"
      minH="100px"
      ref={chartContainerRef}
    >
      <Box position="absolute" w="full" h="full" id={id} />
    </Box>
  );
};

export default IndicatorChart;
