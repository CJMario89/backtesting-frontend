import {
  Divider,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  UseDisclosureProps,
} from '@chakra-ui/react';
import IconAdd from '../icon/add';
import { useIndicatorStore } from './store/indicator-store';
import { indicators } from ' /components/back-test/store/constants';
import { useEffect } from 'react';
import { defaultAllIndicators } from './store/default-indicators';

const IndicatorPanel = ({
  indicatorPanelDisclosure: { onClose = () => {}, isOpen = false },
}: {
  indicatorPanelDisclosure: UseDisclosureProps;
}) => {
  const { addIndicator } = useIndicatorStore();

  useEffect(() => {
    const isInited = localStorage.getItem('init-indicators');
    if (!isInited) {
      defaultAllIndicators.forEach((indicator) => {
        addIndicator(indicator);
      });
      localStorage.setItem('init-indicators', 'true');
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="8" bgColor="darkTheme.900">
        <ModalCloseButton />
        <ModalBody p="0">
          <Flex w="full" flex="1" gap="6" flexDirection="column">
            <Heading as="h3">Indicators</Heading>
            <Divider />
            <Flex flexDirection="column" gap="8">
              {indicators.map((indicator) => {
                const onClick = () => {
                  addIndicator(indicator);
                  onClose();
                };
                return (
                  <Flex
                    key={indicator.name}
                    alignItems="center"
                    justifyContent="space-between"
                    borderRadius="md"
                    // onClick={onClick}
                    // cursor="pointer"
                    // _hover={{
                    //   bgColor: 'darkTheme.500',
                    // }}
                  >
                    <Heading as="h6">{indicator.name}</Heading>
                    <IconButton
                      aria-label="add indicator"
                      variant="ghost"
                      icon={<IconAdd w="4" h="4" />}
                      onClick={onClick}
                    />
                  </Flex>
                );
              })}
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const unsupportedIndicators = [
  'MACD',
  'SMA',
  'EMA',
  'Bollinger Bands',
  'Stochastic Oscillator',
  'Volume',
  'OBV',
  'Ichimoku Cloud',
  'ADX',
  'ATR',
  'CCI',
  'Parabolic SAR',
  'Chaikin Money Flow',
  'Keltner Channel',
  'Donchian Channel',
  'Williams %R',
  'Aroon',
  'Aroon Oscillator',
  'Elder Ray',
  'Force Index',
  'Klinger Volume Oscillator',
  'Money Flow Index',
  'On Balance Volume',
  'Price Volume Trend',
  'Rate of Change',
  'Relative Vigor Index',
  'True Strength Index',
  'Ultimate Oscillator',
  'Volume Oscillator',
  'Volume Rate of Change',
  'Accumulation/Distribution',
  'Chaikin Oscillator',
  'Ease of Movement',
  'Negative Volume Index',
  'Positive Volume Index',
  'Vortex Indicator',
  'Average True Range',
  'Average Directional Index',
  'Commodity Channel Index',
  'Detrended Price Oscillator',
  'Directional Movement Index',
  'Moving Average Convergence Divergence',
  'Percentage Price Oscillator',
  'Percentage Volume Oscillator',
  'Price Volume Trend',
  'Triangular Moving Average',
  'Weighted Moving Average',
  "Wilder's Smoothing",
  'Hull Moving Average',
  "Kaufman's Adaptive Moving Average",
  'Exponential Moving Average',
  'Simple Moving Average',
  'Volume Weighted Moving Average',
];

export default IndicatorPanel;
