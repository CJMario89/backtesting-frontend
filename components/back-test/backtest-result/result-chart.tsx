import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  ITimeScaleApi,
  MouseEventParams,
  SeriesMarker,
  SeriesType,
  Time,
} from 'lightweight-charts';
import { useIndicatorStore } from '../store/indicator-store';
import { getIndicatorData } from ' /application/indicator';
import { timeFormatOptions } from '../chart';
import {
  Button,
  Col,
  Divider,
  Flex,
  Modal,
  Row,
  Statistic,
  Tag,
  Text,
  Title,
} from ' /styled-antd';
import BackTestResult from ' /app/indexDB/backtest-result';
import ConditionText from '../back-test-panel/condition-text';
import { Signal, Trade } from ' /type';
import CountUp from 'react-countup';
import useGetTime from ' /hooks/use-get-time';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

type TradeAction = {
  index: number;
} & Trade;

const green = 'rgba(0, 150, 130, 1)';
const red = 'rgba(200, 50, 50, 1)';

const SignalCard = ({
  signals,
  action,
}: {
  signals?: Signal[];
  action: 'Buy' | 'Sell';
}) => {
  return (
    <Flex vertical gap="small" flex="1">
      <Title level={5}>{action} Signal</Title>
      <Flex
        vertical
        gap="small"
        style={{
          minHeight: '100px',
          height: '100%',
          padding: '8px',
          background: '#27272c',
        }}
      >
        <div />
        {signals
          ?.flatMap((a) => a)
          ?.map((signal, i) => {
            return (
              <Flex key={i} gap="small" vertical>
                <ConditionText
                  signal={signal}
                  name={signal?.indicator?.displayName}
                />
                {signals && signals?.flatMap((a) => a).length - 1 !== i && (
                  <Tag
                    style={{
                      alignSelf: 'self-start',
                    }}
                  >
                    {signal.logicOperator}
                  </Tag>
                )}
              </Flex>
            );
          })}
      </Flex>
    </Flex>
  );
};

const ResultChart = ({
  backTestResult,
  index,
}: {
  backTestResult: BackTestResult;
  index: number;
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { allIndicator } = useIndicatorStore();
  const indicatorsArr = Object.values(allIndicator);

  const [currentTradeIndex, setCurrentTradeIndex] = useState<number>();
  const [tradeAction, setTradeAction] = useState<TradeAction>();
  const [modalTradeAction, setModalTradeAction] = useState<TradeAction>();
  const [isSignalModalOpen, setIsSignalModalOpen] = useState(false);
  const init = useRef(false);
  const candleSeries = useRef<ISeriesApi<SeriesType>>();
  const chart = useRef<IChartApi>();
  const seriesArr = useRef<ISeriesApi<SeriesType>[]>([]);

  const trades = backTestResult.buySellCandlesPairs;
  const allActions = trades.map((trade, index) => ({
    index,
    ...trade,
  }));
  //
  //
  //
  // render chart indicators
  useEffect(() => {
    if (!backTestResult?.candles) return;
    if (!chart.current) return;
    if (Array.isArray(seriesArr) && seriesArr.length > 0) {
      while (seriesArr.length > 0) {
        chart.current.removeSeries(seriesArr[0]);
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
            series = chart.current?.addHistogramSeries({
              priceScaleId: name,
              priceLineVisible: false,
            });
            series?.setData(value);
          } else {
            series = chart.current?.addLineSeries({
              priceScaleId: params.isPriceRelated ? 'right' : name,
              lineWidth: 1,
              priceLineVisible: false,
            });
            series?.setData(value);
          }
          if (series) {
            seriesArr.current.push(series);
          }
        });

        if (!positioned.includes(name) && !params.isPriceRelated) {
          chart.current?.priceScale(name).applyOptions({
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
    if (!candleSeries.current) return;
    candleSeries.current.setData(backTestResult?.candles);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backTestResult]);
  //
  //
  //
  // render chart
  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (init.current) return;
    const chartDom = document.querySelector(
      '#result-chart-' + CSS.escape(index.toString()),
    );
    if (!chartDom) return;
    chart.current = createChart((chartDom as HTMLElement) ?? '', {
      width: chartContainerRef.current.clientWidth,
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
    });
    chart.current.applyOptions({
      timeScale: {
        tickMarkFormatter: (time: number) => {
          return new Intl.DateTimeFormat('en-US', {
            timeZone: 'UTC',
            ...timeFormatOptions[backTestResult.timeframe],
          }).format(time * 1000);
        },

        fixRightEdge: true,
        lockVisibleTimeRangeOnResize: true,
      },
    });
    candleSeries.current = chart.current.addCandlestickSeries({});
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

    chart.current.subscribeCrosshairMove((param: MouseEventParams<Time>) => {
      if (param.time === null) return;
      const action = allActions.find((action) => {
        return (
          Number(action.buy.time) <= Number(param.time) * 1000 &&
          Number(action.sell.time) >= Number(param.time) * 1000
        );
      });

      const chartDom = document.getElementById(
        `result-chart-${index}`,
      ) as HTMLElement;
      if (action) {
        chartDom?.style.setProperty('cursor', 'pointer');
        setTradeAction(action);
        setCurrentTradeIndex(action.index);
      } else {
        chartDom?.style.setProperty('cursor', 'default');
        setTradeAction(undefined);
      }
    });

    chart.current?.timeScale().subscribeVisibleTimeRangeChange((time) => {
      for (const trade of allActions) {
        if (time === null) continue;
        if (Number(trade.buy.time) >= Number(time.from) * 1000) {
          setCurrentTradeIndex(trade.index);
          return;
        }
      }
    });

    const resizeChart = () => {
      if (!chart || !chartContainerRef.current) return;
      if (chartContainerRef.current.clientHeight - 32 < 0) return;
      chart.current?.applyOptions({
        width: chartContainerRef.current.clientWidth,
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
    init.current = true;

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      chart.current?.unsubscribeCrosshairMove(() => {});
      resizeObserver.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartContainerRef.current, backTestResult]);
  //
  //
  //
  // render trade markers
  useEffect(() => {
    if (!chart.current) return;
    if (!candleSeries.current) return;
    if (!backTestResult.buySellCandlesPairs) return;

    const trades = backTestResult.buySellCandlesPairs;
    if (trades.length === 0) return;
    const tradeMarkers = trades
      .flatMap((trade, i) => {
        return [
          {
            time: Number(trade.buy.time) / 1000,
            position: 'belowBar',
            color: green,
            shape: 'arrowUp',
            text: 'Buy@' + (i + 1),
          },
          {
            time: Number(trade.sell.time) / 1000,
            position: 'aboveBar',
            color: red,
            shape: 'arrowDown',
            text: 'Sell@' + (i + 1),
          },
        ] as SeriesMarker<Time>[];
      })
      .sort((a, b) => (Number(a.time) - Number(b.time) > 0 ? 1 : -1));
    candleSeries.current.setMarkers(tradeMarkers);
    chart.current.timeScale().fitContent();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backTestResult]);

  // const tradeResult = backTestResult.buySellCandlesPairs.map((trade) => {
  //   const buyPrice = trade.buy.close;
  //   const sellPrice = trade.sell.close;
  //   const profit = trade.profit;
  //   const profitRate = trade.percentProfit;
  //   const capital = trade.capital;
  //   const duration = trade.duration;
  //   const maxDrawdown = trade.maxDrawdown;

  //   return {
  //     buyPrice,
  //     sellPrice,
  //     profit,
  //     profitRate,
  //     capital,
  //     duration,
  //     maxDrawdown,
  //   };
  // });

  const { days, hours, minutes } = useGetTime({
    time: modalTradeAction?.duration ?? 0,
  });

  const tradeResult = [
    {
      title: 'Buy Price',
      value: modalTradeAction?.buy.close,
      decimals: 2,
      suffix: '',
      prefix: modalTradeAction?.buy.close ? '$' : '',
      countUp: false,
    },
    {
      title: 'Sell Price',
      value: modalTradeAction?.sell.close,
      decimals: 2,
      suffix: '',
      prefix: modalTradeAction?.sell.close ? '$' : '',
      countUp: false,
    },
    {
      title: 'Profit',
      value: modalTradeAction?.profit,
      decimals: 2,
      suffix: '',
      prefix: modalTradeAction?.profit ? '$' : '',
      color:
        modalTradeAction?.profit && modalTradeAction?.profit > 0 ? green : red,
      countUp: true,
    },
    {
      title: 'Profit Rate',
      value: modalTradeAction?.percentProfit,
      decimals: 2,
      suffix: '%',
      prefix: modalTradeAction?.percentProfit ? '' : '',
      countUp: true,
    },
    {
      title: 'Capital',
      value: modalTradeAction?.capital,
      decimals: 2,
      suffix: '',
      prefix: modalTradeAction?.capital ? '$' : '',
      countUp: true,
    },
    {
      title: 'Max Drawdown',
      value: modalTradeAction?.maxDrawdown,
      decimals: 2,
      suffix: '',
      prefix: '',
      countUp: true,
    },
  ];
  // console.log(modalSignal);
  return (
    <Flex
      vertical
      gap="middle"
      flex="1"
      style={{
        background: '#17171c',
      }}
    >
      {/* <Title level={4}>Chart</Title> */}
      <Divider />
      <Flex
        style={{
          width: '100%',
          minWidth: '300px',
          position: 'relative',
          height: '400px',
          minHeight: '400px',
        }}
        ref={chartContainerRef}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
          id={`result-chart-${index}`}
          onClick={() => {
            if (tradeAction) {
              setIsSignalModalOpen(true);
              setModalTradeAction(tradeAction);
            }
          }}
        />
      </Flex>
      <Flex gap="small">
        <Button
          onClick={() => {
            chart.current?.timeScale().fitContent();
          }}
          size="small"
        >
          {/* Room out to max */}
          Reset
        </Button>
        <Button
          onClick={() => {
            const trades = backTestResult.buySellCandlesPairs;
            console.log(Number(trades[0].buy.time) / 1000);
            // //timestamp to yyyy-mm-dd without T
            // const timeString = new Date(
            //   Number(trades[0].buy.time),
            // ).toISOString();
            if (!chart.current) return;
            scrollToTime(
              Number(trades[0].buy.time) / 1000,
              chart.current.timeScale(),
            );
            setCurrentTradeIndex(0);
          }}
          size="small"
          disabled={!backTestResult.buySellCandlesPairs.length}
        >
          First
        </Button>
        <Button
          style={{
            width: '24px',
            height: '24px',
            padding: 0,
          }}
          onClick={() => {
            const trades = backTestResult.buySellCandlesPairs;
            if (!chart.current) return;
            if (!currentTradeIndex) return;
            scrollToTime(
              Number(trades[currentTradeIndex - 1].buy.time) / 1000,
              chart.current.timeScale(),
            );
            setCurrentTradeIndex(currentTradeIndex - 1);
          }}
        >
          <ArrowLeftOutlined />
        </Button>
        {currentTradeIndex !== undefined ? (
          <Button
            size="small"
            type="text"
            onClick={() => {
              setModalTradeAction(allActions[currentTradeIndex]);
              setIsSignalModalOpen(true);
            }}
          >{`Trade ${currentTradeIndex + 1}`}</Button>
        ) : (
          <Text>No Trade</Text>
        )}
        <Button
          style={{
            width: '24px',
            height: '24px',
            padding: 0,
          }}
          onClick={() => {
            const trades = backTestResult.buySellCandlesPairs;
            if (!chart.current) return;
            if (typeof currentTradeIndex !== 'number') return;
            if (currentTradeIndex === trades.length - 1) return;
            scrollToTime(
              Number(trades[currentTradeIndex + 1].buy.time) / 1000,
              chart.current.timeScale(),
            );
            setCurrentTradeIndex(currentTradeIndex + 1);
          }}
        >
          <ArrowRightOutlined />
        </Button>
        <Button
          onClick={() => {
            const trades = backTestResult.buySellCandlesPairs;
            if (!chart.current) return;
            scrollToTime(
              Number(trades[trades.length - 1].buy.time) / 1000,
              chart.current.timeScale(),
            );
            setCurrentTradeIndex(trades.length - 1);
          }}
          size="small"
          disabled={!backTestResult.buySellCandlesPairs.length}
        >
          Last
        </Button>
      </Flex>
      <Divider />
      <Modal
        open={isSignalModalOpen}
        onCancel={() => setIsSignalModalOpen(false)}
        title={
          <Title level={4}>
            Trade {modalTradeAction?.index ? modalTradeAction.index + 1 : 1}th
          </Title>
        }
        footer={null}
      >
        <Flex vertical gap="middle">
          <Flex gap="small">
            <SignalCard signals={modalTradeAction?.buySignals} action="Buy" />
            <SignalCard signals={modalTradeAction?.sellSignals} action="Sell" />
          </Flex>
          <Text>
            Duration: {days ? `${days} days` : ''}{' '}
            {hours ? `${hours} hours` : ''}{' '}
            {minutes ? `${minutes} minutes` : ''}
          </Text>
          <Divider />
          <Row gutter={[8, 24]}>
            {tradeResult?.map((result, i) => {
              return (
                <Col span={8} key={i}>
                  {result.countUp ? (
                    <Statistic
                      style={{
                        textAlign: 'center',
                      }}
                      title={result.title}
                      value={Number(result.value)}
                      formatter={(value) => (
                        <CountUp
                          end={value as number}
                          separator=","
                          decimals={result.decimals}
                        />
                      )}
                      suffix={result?.suffix}
                      prefix={result?.prefix}
                      valueStyle={{ color: result.color }}
                      precision={2}
                    />
                  ) : (
                    <Statistic
                      style={{
                        textAlign: 'center',
                      }}
                      title={result.title}
                      value={result.value}
                      suffix={result?.suffix}
                      prefix={result?.prefix}
                      valueStyle={{ color: result.color }}
                      precision={2}
                    />
                  )}
                </Col>
              );
            })}
          </Row>
        </Flex>
      </Modal>
    </Flex>
  );
};

function scrollToTime(time: Time | number, timeScale: ITimeScaleApi<Time>) {
  const currentPosition = timeScale.scrollPosition();
  const currentVisibleLogicalRange = timeScale.getVisibleLogicalRange();

  //@ts-ignore
  const coordinate = timeScale.timeToCoordinate(time);
  if (coordinate === null || currentVisibleLogicalRange === null) {
    return;
  }
  const logicalIndex = timeScale.coordinateToLogical(coordinate);

  if (logicalIndex === null) {
    return;
  }
  const targetPosition =
    currentPosition - currentVisibleLogicalRange.from + logicalIndex;
  timeScale.scrollToPosition(targetPosition, true);
}

export default ResultChart;
