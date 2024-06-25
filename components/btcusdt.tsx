import { Container, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import { BackTestPanel, Chart, IndicatorPanel } from './back-test';
import AddedIndicatorPanel from './back-test/added-indicator-panel';
import BackTestResult from './back-test/back-test-result';

const Btcusdt = () => {
  const indicatorPanelDisclosure = useDisclosure();
  return (
    <Container minH="100vh" maxW="container.2xl">
      <Heading as="h1">BTC/USDT</Heading>
      <Flex flexDirection="column" gap="8">
        <Flex gap="4">
          <AddedIndicatorPanel
            indicatorPanelDisclosure={indicatorPanelDisclosure}
          />
          <Chart symbol={'BTCUSDT'} />
        </Flex>
        <Flex gap="4" zIndex={2}>
          <BackTestPanel />
          <BackTestResult />
        </Flex>
      </Flex>
      <IndicatorPanel indicatorPanelDisclosure={indicatorPanelDisclosure} />
    </Container>
  );
};

export default Btcusdt;
