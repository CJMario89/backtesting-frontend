import {
  Button,
  Divider,
  Flex,
  FlexProps,
  Heading,
  IconButton,
  Input,
  Text,
  useDisclosure,
  useRadioGroup,
} from '@chakra-ui/react';

import { useRef } from 'react';
import usePostBackTest from ' /hooks/use-post-back-test';
import { BackTestSignal, useBackTestStore } from '../store/back-test-store';
import { useIndicatorStore } from '../store/indicator-store';
import IconAdd from ' /components/icon/add';
import ConditionText from './condition-text';
import getCurrentIndicatorFromSignal from ' /hooks/get-current-indicator-from-signal';
import SettingModal from './setting-modal';
import IconClose from ' /components/icon/close';
import { RadioToggle } from ' /components/common';

const backTestBlockProps = {
  borderBottom: '0.1px solid',
  borderColor: 'neutral.500',
  flex: '1',
  flexDirection: 'column',
  gap: '2',
  p: '2',
  py: '8',
} as FlexProps;

const logicOperatorOptions = [
  { value: 'and', label: 'and' },
  { value: 'or', label: 'or' },
];

const LogicSelector = ({ signal }: { signal: BackTestSignal }) => {
  const { changeBackTestSignal } = useBackTestStore();
  const radioGroupProps = useRadioGroup({
    defaultValue: signal.logicOperator,
    onChange: (value: string) => {
      changeBackTestSignal({
        ...signal,
        logicOperator: value as 'and' | 'or',
      });
    },
  });

  return (
    <RadioToggle
      variant="text"
      options={logicOperatorOptions}
      {...radioGroupProps}
      // isDisabled={!!timeframeIndicator?.timeframe}
    />
  );
};

const Signals = ({ action }: { action: 'buy' | 'sell' }) => {
  const { backTestSignals, removeBackTestSignal, changeTempSignal } =
    useBackTestStore();
  const { allIndicator } = useIndicatorStore();
  const settingDisclosure = useDisclosure();

  const signals = backTestSignals.filter(
    (signal: BackTestSignal) => signal.action === action,
  );

  return (
    <Flex {...backTestBlockProps}>
      <Flex justifyContent="space-between">
        <Heading as="h6">
          {action === 'buy' ? 'Buy Signal' : 'Sell Signal'}
        </Heading>
        <Button
          alignSelf="self-start"
          size="sm"
          rightIcon={<IconAdd />}
          onClick={() => {
            changeTempSignal({
              id: Date.now().toString(),
              action,
              lowerBound: { name: 'min' },
              upperBound: { name: 'max' },
              logicOperator: 'and',
              baseIndicatorId: '',
              indicatorId: '',
            });
            settingDisclosure.onOpen();
          }}
        >
          Add Signal
        </Button>
      </Flex>

      {signals.length > 0 && (
        <Flex flexDirection="column" gap="4">
          When{' '}
          {signals.map((signal, i) => {
            const currentIndicator = allIndicator[signal.indicatorId];
            return (
              <Flex key={currentIndicator?.name} flexDirection="column" gap="4">
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  gap="2"
                >
                  <ConditionText signal={signal} />
                  <IconButton
                    variant="outline"
                    aria-label="close button"
                    icon={<IconClose boxSize="4" />}
                    onClick={() => {
                      removeBackTestSignal(signal.id);
                    }}
                  />
                </Flex>
                {signals.length - 1 !== i && (
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text>{signal.logicOperator}</Text>
                    <LogicSelector signal={signal} />
                  </Flex>
                )}
              </Flex>
            );
          })}
        </Flex>
      )}
      <SettingModal action={action} {...settingDisclosure} />
    </Flex>
  );
};

const BackTestPanel = ({ timeframe }: { timeframe: string }) => {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const takeProfitRef = useRef<HTMLInputElement>(null);
  const StopLossRef = useRef<HTMLInputElement>(null);
  const capitalRef = useRef<HTMLInputElement>(null);
  const { backTestSignals } = useBackTestStore();
  console.log(backTestSignals);
  const { allIndicator } = useIndicatorStore();
  const { mutate, isPending } = usePostBackTest({
    symbol: 'btcusdt',
    interval: timeframe,
    start: new Date(startRef.current?.value ?? '').getTime().toString(),
    end: new Date(endRef.current?.value ?? '').getTime().toString(),
    capital: Number(capitalRef.current?.value),
    takeProfit: Number(takeProfitRef.current?.value),
    stopLoss: -Number(StopLossRef.current?.value),
    signals: backTestSignals.map((signal) => ({
      ...signal,
      indicator: getCurrentIndicatorFromSignal({ signal, allIndicator })
        .baseIndicator,
    })),
  });

  return (
    <Flex
      flex="1"
      flexDirection="column"
      w="full"
      gap="4"
      bg="darkTheme.800"
      p="2"
    >
      <Heading as="h4">Back Testing</Heading>
      <Divider />

      <Flex w="full" gap="8" flexDirection="column">
        <Flex w="full" gap="2" flexDirection="column">
          <Signals action="buy" />
          <Signals action="sell" />
        </Flex>
      </Flex>
      <Flex gap="4" alignItems="center">
        <Text fontWeight="semibold">Take Profit</Text>
        <Flex gap="2" alignItems="center">
          <Input
            type="number"
            min={0}
            max={100}
            ref={takeProfitRef}
            defaultValue="1"
          />
          <Text>%</Text>
        </Flex>
      </Flex>
      <Flex gap="4" alignItems="center">
        <Text fontWeight="semibold">Stop Loss</Text>
        <Flex gap="2" alignItems="center">
          <Input
            type="number"
            min={0}
            max={100}
            ref={StopLossRef}
            defaultValue="1"
          />
          <Text>%</Text>
        </Flex>
      </Flex>
      <Flex gap="4">
        <Flex flex="1" gap="2" alignItems="center">
          <Text fontWeight="semibold">Start</Text>
          <Input type="date" ref={startRef} defaultValue="2023-09-01" />
        </Flex>
        <Flex flex="1" gap="2" alignItems="center">
          <Text fontWeight="semibold">End</Text>
          <Input type="date" ref={endRef} defaultValue={'2024-03-31'} />
        </Flex>
      </Flex>
      <Flex gap="4" alignItems="center">
        <Text fontWeight="semibold" flexShrink="0">
          Initial Capital
        </Text>
        <Input maxW="24" type="number" ref={capitalRef} defaultValue="10000" />
        <Text>USDT</Text>
      </Flex>
      <Button
        alignSelf="center"
        size="md"
        onClick={() => {
          mutate();
        }}
        isLoading={isPending}
      >
        Run Back Test
      </Button>
    </Flex>
  );
};

export default BackTestPanel;
