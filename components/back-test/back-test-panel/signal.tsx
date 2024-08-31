import { Flex, IconButton } from '@chakra-ui/react';
import { BackTestSignal, useBackTestStore } from '../store/back-test-store';
import IconClose from ' /components/icon/close';

const Signal = ({ signal }: { signal: BackTestSignal }) => {
  const { removeBackTestSignal } = useBackTestStore();
  return (
    <Flex alignItems="center" gap="4" justifyContent="space-between">
      <Flex gap="2" alignItems="center">
        {/* <IndicatorSelector signal={signal} /> */}
        {/* <Bound signal={signal} side="lowerBound" /> */}
        {/* <Button
          size="md"
          isDisabled={
            !signal.baseIndicator?.name && signal.baseIndicatorId !== 'price'
          }
          onClick={() => {
          }}
        >
          setting
        </Button> */}
      </Flex>
      <IconButton
        variant="outline"
        aria-label="close button"
        icon={<IconClose boxSize="4" />}
        onClick={() => {
          removeBackTestSignal(signal.id);
        }}
      />
    </Flex>
  );
};

export default Signal;
