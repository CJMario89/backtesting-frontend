import { Container, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import { BackTestPanel, Chart, IndicatorPanel } from './back-test';
import AddedIndicatorPanel from './back-test/added-indicator-panel';
import { useState } from 'react';
import BackTestResult from './back-test/backtest-result';

const Btcusdt = () => {
  const indicatorPanelDisclosure = useDisclosure();
  const [timeframe, setTimeframe] = useState('1d');
  return (
    <Container minH="100vh" maxW="container.xl" bgColor="darkTheme.900">
      <Heading as="h2">BTC/USDT</Heading>
      <Flex flexDirection="column" gap="2">
        <Flex gap="2">
          <AddedIndicatorPanel
            indicatorPanelDisclosure={indicatorPanelDisclosure}
          />
          <Chart
            symbol={'BTCUSDT'}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
        </Flex>
        <Flex gap="2" zIndex={2}>
          <BackTestPanel timeframe={timeframe} />
          <BackTestResult />
        </Flex>
      </Flex>
      <IndicatorPanel indicatorPanelDisclosure={indicatorPanelDisclosure} />
    </Container>
  );
};

export default Btcusdt;
