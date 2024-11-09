import {
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  LogicalRange,
  SeriesType,
  Time,
} from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { timeFormatOptions } from './index';
import { getIndicatorData } from ' /application/indicator';
import { IndicatorExtended } from '../store/indicator.type';
import { Flex } from ' /styled-antd';
const IndicatorChart = ({
  id,
  timeframe,
  data,
  indicator,
  dataPoint,
  logicalRange,
  showTimeScaleId,
}: {
  id: string;
  timeframe: string;
  data?: any;
  indicator?: IndicatorExtended;
  dataPoint?: { time: Time; value: number };
  logicalRange: LogicalRange | null;
  showTimeScaleId: string;
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const seriesArr = useRef<ISeriesApi<SeriesType>[]>([]);

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
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: {
          color: '#17171c',
        },
        textColor: '#727274',
        attributionLogo: false,
      },
      grid: {
        vertLines: {
          visible: false,
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

    const resizeChart = () => {
      if (!chart || !chartContainerRef.current) return;
      chart.current?.applyOptions({
        width: chartContainerRef.current.clientWidth - 32,
        height: chartContainerRef.current.clientHeight,
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
    if (!data) return;
    if (!chart.current) return;
    if (!indicator) return;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.candles, indicator]);

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
    if (showTimeScaleId === id) {
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
          visible: true,
        },
      });
    }
    if (showTimeScaleId !== id) {
      chart.current?.applyOptions({
        timeScale: {
          visible: false,
        },
      });
    }
  }, [data, timeframe, seriesArr, showTimeScaleId, id]);

  useEffect(() => {
    if (!dataPoint) return;
    if (!chart.current) return;
    if (seriesArr.current.length === 0) return;
    seriesArr.current.forEach((series) => {
      if (!chart.current) return;
      chart.current.setCrosshairPosition(
        dataPoint.value,
        dataPoint.time,
        series,
      );
    });
  }, [dataPoint]);
  return (
    <Flex
      style={{
        width: '100%',
        height: '100px',
        minHeight: '100px',
        position: 'relative',
      }}
      ref={chartContainerRef}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
        id={id}
      />
    </Flex>
  );
};

export default IndicatorChart;
