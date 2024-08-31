import { Flex, Text } from '@chakra-ui/react';
import { BaseIndicatorExtended } from '../store/indicator.type';
import { BackTestSignal } from '../store/back-test-store';
import getCurrentIndicatorFromSignal from ' /hooks/get-current-indicator-from-signal';
import { useIndicatorStore } from '../store/indicator-store';

const BoundText = ({
  side,
  signal,
}: {
  side: 'upperBound' | 'lowerBound';
  signal: BackTestSignal;
}) => {
  const baseIndicator = signal.baseIndicator;
  const boundValue = getBoundValue({ side, signal, baseIndicator });
  if (!boundValue && typeof boundValue !== 'number') {
    return null;
  }
  return (
    <Flex gap="2" flexWrap="wrap">
      <Text fontWeight="bold" whiteSpace="nowrap">
        {baseIndicator?.displayName}
      </Text>
      <Text>{side === 'upperBound' ? 'below' : 'above'}</Text>
      <Text fontWeight="bold" whiteSpace="nowrap">
        {boundValue.toString()}
      </Text>
    </Flex>
  );
};

const ConditionText = ({ signal }: { signal: BackTestSignal }) => {
  const { allIndicator } = useIndicatorStore();
  const { baseIndicator } = getCurrentIndicatorFromSignal({
    signal,
    allIndicator,
  });

  const UpperBoundText = <BoundText side="upperBound" signal={signal} />;
  const LowerBoundText = <BoundText side="lowerBound" signal={signal} />;
  const upperBoundValue = getBoundValue({
    side: 'upperBound',
    signal,
    baseIndicator,
  });
  const lowerBoundValue = getBoundValue({
    side: 'lowerBound',
    signal,
    baseIndicator,
  });
  return (
    <Flex alignItems="center" gap="2" flexWrap="wrap" flex="1">
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
  signal: BackTestSignal;
  baseIndicator?: BaseIndicatorExtended;
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
