import { Text, Flex, Row, Col, Statistic } from ' /styled-antd';
import CountUp from 'react-countup';
import ResultChart from './result-chart';
import useGetTime from ' /hooks/use-get-time';
import { FormatDateOptions, useIntl } from 'react-intl';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import BackTestResult from ' /app/indexDB/backtest-result';

const green = 'rgba(0, 150, 130, 1)';
const red = 'rgba(200, 50, 50, 1)';

const formatTimeOption = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: undefined,
  minute: undefined,
} as FormatDateOptions;

const Result = ({
  backTestResult,
  index,
}: {
  backTestResult: BackTestResult;
  index: number;
}) => {
  const { days, hours } = useGetTime({
    time: backTestResult?.totalDuration,
  });

  const { formatTime } = useIntl();

  const startTime = formatTime(
    Number(backTestResult.startTime),
    formatTimeOption,
  );
  const endTime = formatTime(Number(backTestResult.endTime), formatTimeOption);

  const Arrow = ({ value }: { value: number | undefined }) => {
    if (typeof value === 'undefined' || value == 0) return null;
    return value > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  };

  const backTestPeriod = [
    {
      title: 'Start Time',
      value: backTestResult.startTime ? startTime.split(',')[0] : '--',
    },
    {
      title: 'End Time',
      value: backTestResult.endTime ? endTime.split(',')[0] : '--',
    },
    {
      title: 'Total Duration',
      value:
        days || hours ? `${days} days${hours ? ` ${hours} hours` : ''}` : '--',
    },
  ];
  const backTestResults = [
    {
      title: 'Initial Capital',
      value: backTestResult.initialCapital,
      decimals: 0,
      suffix: '',
      prefix: backTestResult.initialCapital ? '$' : '',
    },
    {
      title: 'Final Capital',
      value: backTestResult.capital,
      decimals: 0,
      suffix: '',
      prefix: backTestResult.capital ? '$' : '',
    },
    {
      title: 'Total Profit',
      value: backTestResult.totalProfit,
      decimals: 0,
      suffix: '',
      prefix: backTestResult.totalProfit ? '$' : '',
      ...(backTestResult.totalProfit
        ? {
            color: Number(backTestResult.totalProfit) > 0 ? green : red,
          }
        : {}),
    },
    {
      title: 'Profit Rate',
      value: backTestResult.profitRate,
      decimals: 2,
      suffix: '%',
      prefix: <Arrow value={backTestResult.profitRate} />,
      ...(backTestResult.profitRate
        ? {
            color: Number(backTestResult.profitRate) > 0 ? green : red,
          }
        : {}),
    },

    {
      title: 'Max Drawdown',
      value: backTestResult.totalMaxDrawdown,
      decimals: 2,
      suffix: '%',
      prefix: <Arrow value={backTestResult.totalMaxDrawdown} />,
      ...(backTestResult.totalMaxDrawdown
        ? {
            color: Number(backTestResult.totalMaxDrawdown) > 0 ? green : red,
          }
        : {}),
    },
    {
      title: 'Annualized Return',
      value: backTestResult.annualizedReturn,
      decimals: 2,
      suffix: '%',
      prefix: <Arrow value={backTestResult.annualizedReturn} />,
      ...(backTestResult.annualizedReturn
        ? {
            color: Number(backTestResult.annualizedReturn) > 0 ? green : red,
          }
        : {}),
    },
  ];
  return (
    <Flex
      vertical
      gap="small"
      flex="1"
      style={{
        padding: '8px',
        background: '#17171c',
      }}
    >
      <ResultChart backTestResult={backTestResult} index={index} />
      <Flex
        flex="1"
        vertical
        gap="large"
        style={{
          padding: '8px',
        }}
      >
        <Row gutter={[8, 24]}>
          {backTestResults.map((result, i) => (
            <Col span={8} key={i}>
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
            </Col>
          ))}
        </Row>

        <Row gutter={8}>
          {backTestPeriod.map((result) => (
            <Col span={8} key={result.title}>
              <Flex key={result.title} vertical gap="small">
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.45)',
                    textAlign: 'center',
                  }}
                >
                  {result.title}
                </Text>
                <Text
                  style={{
                    fontSize: '20px',
                    textAlign: 'center',
                  }}
                >
                  {result.value}
                </Text>
              </Flex>
            </Col>
          ))}
        </Row>
      </Flex>
    </Flex>
  );
};

export default Result;
