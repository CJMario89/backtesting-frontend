import { BackTestPanel, Chart, IndicatorPanel } from './back-test';
import AddedIndicatorPanel from './back-test/added-indicator-panel';
import { useRef, useState } from 'react';
import BackTestResult from './back-test/backtest-result';
import { Flex, Title } from ' /styled-antd';

const Btcusdt = () => {
  // const [tourOpen, setTourOpen] = useState(false);
  const [indicatorPanelOpen, setIndicatorPanelOpen] = useState(false);

  //tour
  const tradePairRef = useRef<HTMLElement | null>(null);
  const addedIndicatorPanelRef = useRef<{
    getEntireTourRef: () => HTMLElement;
    getAddButtonTourRef: () => HTMLElement;
  }>();

  const chartRef = useRef<{
    getTimeframeTourRef: () => HTMLElement;
  }>();

  const backTestPanelRef = useRef<{
    getAddSignalTourRef: () => HTMLElement;
    getSettingTourRef: () => HTMLElement;
    getSubmitTourRef: () => HTMLElement;
  }>();

  // const steps: TourProps['steps'] = [
  //   {
  //     title: 'Welcome to the backtest page!',
  //     description: 'This is the trading pair you are currently viewing.',
  //     // @ts-ignore
  //     target: () => tradePairRef.current,
  //   },
  //   {
  //     title: 'Indicators',
  //     description: 'You can set up the parameters of indicators here.',
  //     // @ts-ignore
  //     target: () => {
  //       const ref = addedIndicatorPanelRef.current?.getEntireTourRef();
  //       return ref || null;
  //     },
  //     placement: 'right',
  //   },
  //   {
  //     title: 'Add Indicator',
  //     description: 'Click to add an indicator.',
  //     // @ts-ignore
  //     target: () => {
  //       const ref = addedIndicatorPanelRef.current?.getAddButtonTourRef();
  //       return ref || null;
  //     },
  //   },
  //   {
  //     title: 'Timeframe',
  //     description: 'You can change the timeframe of the chart here.',
  //     // @ts-ignore
  //     target: () => {
  //       const ref = chartRef.current?.getTimeframeTourRef();
  //       return ref || null;
  //     },
  //   },
  //   {
  //     title: 'Backtest Signals',
  //     description: 'You can add signals to buy and sell here.',
  //     // @ts-ignore
  //     target: () => {
  //       const ref = backTestPanelRef.current?.getAddSignalTourRef();
  //       return ref || null;
  //     },
  //   },
  //   {
  //     title: 'Backtest Settings',
  //     description: 'You can set up the backtest settings here.',
  //     // @ts-ignore
  //     target: () => {
  //       const ref = backTestPanelRef.current?.getSettingTourRef();
  //       return ref || null;
  //     },
  //   },
  //   {
  //     title: 'Submit Backtest',
  //     description: 'After setting up the backtest, click here to run.',
  //     // @ts-ignore
  //     target: () => {
  //       const ref = backTestPanelRef.current?.getSubmitTourRef();
  //       return ref || null;
  //     },
  //   },
  // ];

  // useEffect(() => {
  //   setTourOpen(true);
  //   document.documentElement.style.overflow = 'hidden';
  // }, []);

  return (
    <>
      {/* <Tour
        disabledInteraction={true}
        open={tourOpen}
        onClose={() => {
          setTourOpen(false);
          document.documentElement.style.overflow = '';
        }}
        steps={steps}
      /> */}
      <Flex
        vertical
        align="center"
        style={{
          padding: '16px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <Title
          style={{
            alignSelf: 'flex-start',
          }}
          level={3}
          id="trading-pair"
          ref={tradePairRef}
        >
          BTC/USDT
        </Title>
        <Flex
          vertical
          gap="small"
          style={{
            width: '100%',
          }}
        >
          <Flex gap="small">
            <AddedIndicatorPanel
              ref={addedIndicatorPanelRef}
              onOpen={() => setIndicatorPanelOpen(true)}
            />
            <Chart ref={chartRef} symbol={'BTCUSDT'} />
          </Flex>
          <Flex
            gap="small"
            style={{
              zIndex: 2,
            }}
          >
            <BackTestPanel ref={backTestPanelRef} />
            <BackTestResult />
          </Flex>
        </Flex>
        <IndicatorPanel
          onClose={() => {
            setIndicatorPanelOpen(false);
          }}
          isOpen={indicatorPanelOpen}
        />
      </Flex>
    </>
  );
};

export default Btcusdt;
