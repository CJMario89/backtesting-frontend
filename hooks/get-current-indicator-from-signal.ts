import { BackTestSignal } from ' /components/back-test/store/back-test-store';
import { signalIndicators } from ' /components/back-test/store/constants';
import { IndicatorExtended } from ' /components/back-test/store/indicator.type';

const getCurrentIndicatorFromSignal = ({
  signal,
  allIndicator,
}: {
  signal: BackTestSignal;
  allIndicator: Record<string, IndicatorExtended>;
}) => {
  const indicator =
    allIndicator[signal.indicatorId] ?? signalIndicators[signal?.indicatorId];

  const baseIndicator = signal.baseIndicator;

  return {
    indicator,
    baseIndicator,
  };
};

export default getCurrentIndicatorFromSignal;
