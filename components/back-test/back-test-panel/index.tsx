import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import usePostBackTest from ' /hooks/use-post-back-test';
import { BackTestSignal, useBackTestStore } from '../store/back-test-store';
import { useIndicatorStore } from '../store/indicator-store';
import ConditionText from './condition-text';
import getCurrentIndicatorFromSignal from ' /hooks/get-current-indicator-from-signal';
import SettingModal from './setting-modal';
import { RadioToggle } from ' /components/common';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Input, Text, Title } from ' /styled-antd';
import { RadioChangeEvent } from 'antd/es/radio';
import { InputRef } from 'antd';
import { capitalize } from ' /utils';

const logicOperatorOptions = [
  { value: 'and', label: 'and' },
  { value: 'or', label: 'or' },
];

const LogicSelector = ({ signal }: { signal: BackTestSignal }) => {
  const { changeBackTestSignal } = useBackTestStore();

  return (
    <RadioToggle
      options={logicOperatorOptions}
      value={signal.logicOperator}
      onChange={(e: RadioChangeEvent) => {
        changeBackTestSignal({
          ...signal,
          logicOperator: e.target.value as 'and' | 'or',
        });
      }}
      // isDisabled={!!timeframeIndicator?.timeframe}
    />
  );
};

const Signals = ({ action }: { action: 'buy' | 'sell' }) => {
  const { backTestSignals, removeBackTestSignal, changeTempSignal } =
    useBackTestStore();
  const { allIndicator } = useIndicatorStore();
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const signals = backTestSignals.filter(
    (signal: BackTestSignal) => signal.action === action,
  );

  return (
    <Flex
      style={{
        borderBottom: '0.1px solid',
        borderColor: '#727274',
        flex: '1',
        gap: '2',
        padding: '32px 8px',
      }}
      flex="1"
      vertical
      gap="small"
    >
      <Flex justify="space-between">
        <Title level={5}>
          {action === 'buy' ? 'Buy Signal' : 'Sell Signal'}
        </Title>
        <Button
          style={{
            alignSelf: 'self-start',
          }}
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
            setIsSettingOpen(true);
          }}
        >
          Add Signal
          <PlusOutlined />
        </Button>
      </Flex>

      {signals.length > 0 && (
        <Flex vertical gap="middle">
          <Text
            style={{
              fontWeight: 600,
            }}
          >
            {capitalize(action)} when{' '}
          </Text>
          {signals.map((signal, i) => {
            const currentIndicator = allIndicator[signal.indicatorId];
            return (
              <Flex key={currentIndicator?.name} vertical gap="middle">
                <Flex
                  justify="space-between"
                  align="center"
                  gap="2"
                  style={{
                    background: '#27272c',
                    padding: '8px',
                  }}
                >
                  <ConditionText signal={signal} />
                  <Button
                    aria-label="close button"
                    icon={<CloseOutlined />}
                    style={{
                      flexShrink: 0,
                    }}
                    onClick={() => {
                      removeBackTestSignal(signal.id);
                    }}
                  />
                </Flex>
                {signals.length - 1 !== i && (
                  <Flex justify="space-between" align="center">
                    <Text
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      {signal.logicOperator}
                    </Text>
                    <LogicSelector signal={signal} />
                  </Flex>
                )}
              </Flex>
            );
          })}
        </Flex>
      )}
      <SettingModal
        action={action}
        isOpen={isSettingOpen}
        onClose={() => {
          setIsSettingOpen(false);
        }}
      />
    </Flex>
  );
};

// eslint-disable-next-line no-empty-pattern
const BackTestPanel = forwardRef(function BackTestPanel({}, ref) {
  const addSignalTourRef = useRef<HTMLElement>(null);
  const settingTourRef = useRef<HTMLElement>(null);
  const submitTourRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(ref, () => ({
    getAddSignalTourRef: () => addSignalTourRef.current,
    getSettingTourRef: () => settingTourRef.current,
    getSubmitTourRef: () => submitTourRef.current,
  }));

  const { timeframe } = useIndicatorStore();

  const startRef = useRef<InputRef>(null);
  const endRef = useRef<InputRef>(null);
  const takeProfitRef = useRef<InputRef>(null);
  const StopLossRef = useRef<InputRef>(null);
  const capitalRef = useRef<InputRef>(null);
  const { backTestSignals } = useBackTestStore();
  const { allIndicator } = useIndicatorStore();
  const { mutate: postBackTest, isPending } = usePostBackTest();

  return (
    <Flex
      flex="1"
      vertical
      style={{
        width: '100%',
        background: '#17171c',
        padding: '8px',
      }}
      gap="middle"
    >
      <Flex vertical gap="small">
        <Title level={4}>Back Testing</Title>
        <Divider />
      </Flex>

      <Flex
        style={{
          width: '100%',
        }}
        gap="small"
        vertical
        ref={addSignalTourRef}
      >
        <Signals action="buy" />
        <Signals action="sell" />
      </Flex>
      <Flex ref={settingTourRef} vertical gap="middle">
        <Flex gap="middle" align="center">
          <Text
            style={{
              fontWeight: 600,
            }}
          >
            Take Profit
          </Text>
          <Flex gap="small" align="center">
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
        <Flex gap="middle" align="center">
          <Text
            style={{
              fontWeight: 600,
            }}
          >
            Stop Loss
          </Text>
          <Flex gap="small" align="center">
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
        <Flex gap="middle">
          <Flex flex="1" gap="small" align="center">
            <Text
              style={{
                fontWeight: 600,
              }}
            >
              Start
            </Text>
            <Input type="date" ref={startRef} defaultValue="2023-09-01" />
          </Flex>
          <Flex flex="1" gap="small" align="center">
            <Text
              style={{
                fontWeight: 600,
              }}
            >
              End
            </Text>
            <Input type="date" ref={endRef} defaultValue={'2024-03-31'} />
          </Flex>
        </Flex>
        <Flex gap="middle" align="center">
          <Text
            style={{
              fontWeight: 600,
              flexShrink: '0',
            }}
          >
            Initial Capital
          </Text>
          <Input
            style={{
              maxWidth: '96px',
            }}
            type="number"
            ref={capitalRef}
            defaultValue="10000"
          />
          <Text>USD</Text>
        </Flex>
      </Flex>

      <Button
        style={{
          alignSelf: 'center',
        }}
        onClick={() => {
          postBackTest({
            symbol: 'btcusdt',
            interval: timeframe,
            start: new Date(startRef.current?.input?.value ?? '')
              .getTime()
              .toString(),
            end: new Date(endRef.current?.input?.value ?? '')
              .getTime()
              .toString(),
            capital: Number(capitalRef.current?.input?.value),
            takeProfit: Number(takeProfitRef.current?.input?.value),
            stopLoss: -Number(StopLossRef.current?.input?.value),
            signals: backTestSignals.map((signal) => ({
              ...signal,
              indicator: getCurrentIndicatorFromSignal({ signal, allIndicator })
                .baseIndicator,
            })),
          });
        }}
        loading={isPending}
        ref={submitTourRef}
      >
        Run Back Test
      </Button>
    </Flex>
  );
});

export default BackTestPanel;
