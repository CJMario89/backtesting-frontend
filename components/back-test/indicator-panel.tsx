import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  UseDisclosureProps,
} from '@chakra-ui/react';
import IconAdd from '../icon/add';
import { useIndicatorStore } from './store/indicator-store';
import { supoortedIndicators } from ' /constants';

const IndicatorPanel = ({
  indicatorPanelDisclosure: { onClose = () => {}, isOpen = false },
}: {
  indicatorPanelDisclosure: UseDisclosureProps;
}) => {
  const { addIndicator } = useIndicatorStore();

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent p="2" bgColor="darkTheme.900">
        <DrawerCloseButton />
        <DrawerBody p="0">
          <Flex w="full" flex="1" gap="6" flexDirection="column">
            <Heading as="h2">Indicators</Heading>
            <Flex flexDirection="column" gap="2">
              {Object.entries(supoortedIndicators).map(
                ([indicator, params]) => {
                  const onClick = () => {
                    addIndicator({
                      name: indicator,
                      params,
                      displayName: `${indicator}${params?.period ? ` ${params?.period}` : ''} `,
                    });
                    onClose();
                  };
                  return (
                    <Flex
                      key={indicator}
                      alignItems="center"
                      justifyContent="space-between"
                      p="2"
                      borderRadius="md"
                      // onClick={onClick}
                      // cursor="pointer"
                      // _hover={{
                      //   bgColor: 'darkTheme.500',
                      // }}
                    >
                      <Heading as="h4">{indicator}</Heading>
                      <IconButton
                        aria-label=""
                        variant="ghost"
                        icon={<IconAdd w="4" h="4" />}
                        onClick={onClick}
                      />
                    </Flex>
                  );
                },
              )}
            </Flex>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
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
