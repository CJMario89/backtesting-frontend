import { Flex, Heading, Text } from '@chakra-ui/react';
import { useBackTestStore } from './store/back-test-store';
import { FormatDateOptions, FormatNumberOptions, useIntl } from 'react-intl';
import useGetTime from ' /hooks/use-get-time';

const formatTimeOption = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
} as FormatDateOptions;

const formatCurrencyOption = {
  style: 'currency',
  currency: 'USD',
} as FormatNumberOptions;

const formatPercentOption = {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as FormatNumberOptions;

const BackTestResult = () => {
  const { backTestResult } = useBackTestStore();
  const { formatTime, formatNumber } = useIntl();
  console.log(backTestResult?.totalDuration);
  const { days, hours, minutes } = useGetTime({
    time: backTestResult?.totalDuration,
  });
  return (
    <Flex flexDirection="column" gap="4" flex="1">
      <Heading as="h2">Back Test Result</Heading>
      <Flex
        border="1px solid"
        borderColor="neutral.50"
        borderRadius="md"
        flex="1"
        flexDirection="column"
        gap="4"
        p="4"
      >
        <Flex flexDirection="column" gap="2">
          <Text>Start Time</Text>
          <Text>
            {backTestResult.startTime
              ? formatTime(Number(backTestResult.startTime), formatTimeOption)
              : '--'}
          </Text>
        </Flex>
        <Flex flexDirection="column" gap="2">
          <Text>End Time</Text>
          <Text>
            {backTestResult.endTime
              ? formatTime(Number(backTestResult.endTime), formatTimeOption)
              : '--'}
          </Text>
        </Flex>
        <Flex flexDirection="column" gap="2">
          <Text>Initial Capital</Text>
          <Text>
            {backTestResult.initailCaptial
              ? formatNumber(
                  backTestResult.initailCaptial,
                  formatCurrencyOption,
                )
              : '--'}
          </Text>
        </Flex>
        <Flex flexDirection="column" gap="2">
          <Text>Final Capital</Text>
          <Text>
            {backTestResult.capital
              ? formatNumber(backTestResult.capital, formatCurrencyOption)
              : '--'}
          </Text>
        </Flex>
        <Flex flexDirection="column" gap="2">
          <Text>Total Profit</Text>
          <Text>
            {backTestResult.totalProfit
              ? formatNumber(backTestResult.totalProfit, formatCurrencyOption)
              : '--'}
          </Text>
        </Flex>
        <Flex flexDirection="column" gap="2">
          <Text>Profit Rate</Text>
          <Text>
            {backTestResult.profitRate
              ? formatNumber(backTestResult.profitRate, formatPercentOption)
              : '--'}
          </Text>
        </Flex>
        <Flex flexDirection="column" gap="2">
          <Text>Total Duration</Text>
          <Text>
            {!!days && `${days} days `}
            {!!hours && `${hours} hours `}
            {!!minutes && `${minutes} minutes `}
            {!minutes && !hours && !days && '--'}
          </Text>
        </Flex>
        <Flex flexDirection="column" gap="2">
          <Text>Total Max Drawdown</Text>
          <Text>{backTestResult.totalMaxDrawdown ?? '--'} %</Text>
        </Flex>
        <Flex flexDirection="column" gap="2">
          <Text>Annualized Return</Text>
          <Text>
            {backTestResult.annualizedReturn
              ? formatNumber(
                  backTestResult.annualizedReturn,
                  formatPercentOption,
                )
              : '--'}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default BackTestResult;
