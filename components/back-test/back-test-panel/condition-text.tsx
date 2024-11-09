import { BackTestSignal } from '../store/back-test-store';
import getCurrentIndicatorFromSignal from ' /hooks/get-current-indicator-from-signal';
import { useIndicatorStore } from '../store/indicator-store';
import { Flex, Text } from ' /styled-antd';
import { Signal } from ' /type';

const BoundText = ({
  side,
  signal,
  displayName,
}: {
  side: 'upperBound' | 'lowerBound';
  signal: BackTestSignal | Signal;
  displayName?: string;
}) => {
  const boundValue = getBoundValue({ side, signal });
  if (!boundValue && typeof boundValue !== 'number') {
    return null;
  }
  return (
    <Flex
      gap="small"
      style={{
        flexWrap: 'wrap',
      }}
    >
      <Text
        style={{
          whiteSpace: 'nowrap',
          fontWeight: 600,
          color: '#1668dc',
        }}
      >
        {displayName ?? ''}
      </Text>
      <Text>{side === 'upperBound' ? 'below' : 'above'}</Text>
      <Text
        style={{
          whiteSpace: 'nowrap',
          fontWeight: '600',
          color: '#1668dc',
        }}
      >
        {boundValue.toString()}
      </Text>
    </Flex>
  );
};

const ConditionText = ({
  signal,
  name,
}: {
  signal: BackTestSignal | Signal;
  name?: string;
}) => {
  const { allIndicator } = useIndicatorStore();
  const displayName =
    name ??
    getCurrentIndicatorFromSignal({
      // @ts-ignore
      signal,
      allIndicator,
    })?.baseIndicator?.displayName;

  const UpperBoundText = (
    <BoundText side="upperBound" signal={signal} displayName={displayName} />
  );
  const LowerBoundText = (
    <BoundText side="lowerBound" signal={signal} displayName={displayName} />
  );
  const upperBoundValue = getBoundValue({
    side: 'upperBound',
    signal,
  });
  const lowerBoundValue = getBoundValue({
    side: 'lowerBound',
    signal,
  });
  return (
    <Flex
      align="center"
      gap="small"
      style={{
        flexWrap: 'wrap',
      }}
    >
      {typeof upperBoundValue !== 'undefined' && UpperBoundText}
      {typeof upperBoundValue !== 'undefined' &&
        typeof lowerBoundValue !== 'undefined' && <Text>and </Text>}
      {typeof lowerBoundValue !== 'undefined' && LowerBoundText}
    </Flex>
  );
};

export function getBoundValue({
  side,
  signal,
}: {
  side: 'upperBound' | 'lowerBound';
  signal: BackTestSignal | Signal;
}) {
  const boundNameMap = {
    // max: '',
    // min: '',
    number: signal[side].value as Number,
    previous: `Previous Candle`,
    price: 'Current Price',
  };
  const boundValueKey = signal[side].name as keyof typeof boundNameMap;
  return boundNameMap[boundValueKey];
}

export default ConditionText;
