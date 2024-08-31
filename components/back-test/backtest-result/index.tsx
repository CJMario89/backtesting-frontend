import { Divider, Flex, Heading, Text } from '@chakra-ui/react';
import { FormatDateOptions, FormatNumberOptions, useIntl } from 'react-intl';
import useGetTime from ' /hooks/use-get-time';
import { useBackTestStore } from '../store/back-test-store';
import ResultChart from './result-chart';

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
  console.log(backTestResult);
  const { formatTime, formatNumber } = useIntl();
  const { days, hours, minutes } = useGetTime({
    time: backTestResult?.totalDuration,
  });
  const backTestResults = [
    {
      title: 'Start Time',
      value: backTestResult.startTime
        ? formatTime(Number(backTestResult.startTime), formatTimeOption)
        : '--',
    },
    {
      title: 'End Time',
      value: backTestResult.endTime
        ? formatTime(Number(backTestResult.endTime), formatTimeOption)
        : '--',
    },
    {
      title: 'Initial Capital',
      value: backTestResult.initailCaptial
        ? formatNumber(backTestResult.initailCaptial, formatCurrencyOption)
        : '--',
    },
    {
      title: 'Final Capital',
      value: backTestResult.capital
        ? formatNumber(backTestResult.capital, formatCurrencyOption)
        : '--',
    },
    {
      title: 'Total Profit',
      value: backTestResult.totalProfit
        ? formatNumber(backTestResult.totalProfit, formatCurrencyOption)
        : '--',
      ...(backTestResult.totalProfit
        ? {
            color: Number(backTestResult.totalProfit) > 0 ? 'green' : 'red',
          }
        : {}),
    },
    {
      title: 'Profit Rate',
      value: backTestResult.profitRate
        ? formatNumber(backTestResult.profitRate, formatPercentOption)
        : '--',
      ...(backTestResult.profitRate
        ? {
            color: Number(backTestResult.profitRate) > 0 ? 'green' : 'red',
          }
        : {}),
    },
    {
      title: 'Total Duration',
      value:
        days || hours || minutes
          ? `${days} days ${hours} hours ${minutes} minutes`
          : '--',
    },
    {
      title: 'Max Drawdown',
      value: backTestResult.totalMaxDrawdown
        ? Number(backTestResult.totalMaxDrawdown).toFixed(2) + '%'
        : '--',
      ...(backTestResult.totalMaxDrawdown
        ? {
            color:
              Number(backTestResult.totalMaxDrawdown) > 0 ? 'green' : 'red',
          }
        : {}),
    },
    {
      title: 'Annualized Return',
      value: backTestResult.annualizedReturn
        ? formatNumber(backTestResult.annualizedReturn, formatPercentOption)
        : '--',
      ...(backTestResult.annualizedReturn
        ? {
            color:
              Number(backTestResult.annualizedReturn) > 0 ? 'green' : 'red',
          }
        : {}),
    },
  ];
  return (
    <Flex flexDirection="column" gap="2" flex="1" p="2" bg="darkTheme.800">
      <Heading as="h4">Back Test Result</Heading>
      <Divider />

      <Flex flex="1" flexDirection="column" gap="6">
        {backTestResults.map((result) => (
          <Flex key={result.title} flexDirection="column" gap="2">
            <Text>{result.title}</Text>
            <Text color={result.color ?? 'neutral.400'}>{result.value}</Text>
          </Flex>
        ))}
      </Flex>
      <ResultChart />
    </Flex>
  );
};

export default BackTestResult;
