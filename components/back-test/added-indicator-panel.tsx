/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
  UseDisclosureProps,
} from '@chakra-ui/react';
import IconClose from '../icon/close';
import IconAddToChart from '../icon/add-to-chart';
import { useIndicatorStore } from './store/indicator-store';
import IconRemoveFromChart from '../icon/remove-from-chart';
import IconAdd from '../icon/add';
import { Indicator } from './store/indicator.type';
import IconChart from '../icon/chart';
import IconChartOff from '../icon/chart-off';

const PeriodSetting = ({ indicator }: { indicator: Indicator }) => {
  const { setIndicatorParams, setIndicatorColor } = useIndicatorStore();
  const period = indicator.params.period;
  const setPeriod = (value: string) => {
    setIndicatorParams({
      id: indicator.id || '',
      params: { ...indicator.params, period: value },
    });
  };
  const color = indicator.color;
  const setColor = (value: string) => {
    setIndicatorColor({
      id: indicator.id || '',
      color: value,
    });
  };
  return (
    <Flex w="full" alignItems="center" gap="4">
      <Input
        w="9"
        px="1"
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <Heading as="h4">Period</Heading>
      <NumberInput
        maxW="100px"
        mr="2rem"
        value={period}
        onChange={(value) => setPeriod(value)}
        min={1}
        max={300}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Slider
        flex="1"
        focusThumbOnChange={false}
        value={Number(period)}
        onChange={(value) => setPeriod(value.toString())}
        min={1}
        max={300}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize="sm" boxSize="6" children={period} />
      </Slider>
      <Text>Bars</Text>
    </Flex>
  );
};

const IndicatorOptions = ({ indicator }: { indicator: Indicator }) => {
  const { toggleChart, removeIndicator } = useIndicatorStore();
  return (
    <Flex gap="2">
      <Tooltip
        label={indicator.isShowInChart ? 'Remove from Chart' : 'Add to Chart'}
        aria-label={
          indicator.isShowInChart ? 'Remove from Chart' : 'Add to Chart'
        }
      >
        <IconButton
          h="8"
          minW="8"
          variant="ghost"
          icon={
            indicator.isShowInChart ? (
              <IconChart w="4" h="4" />
            ) : (
              <IconChartOff w="4" h="4" />
            )
          }
          aria-label=""
          onClick={() => {
            toggleChart({ id: indicator.id || '' });
          }}
        />
      </Tooltip>
      <Tooltip label="Remove Indicator" aria-label="Remove">
        <IconButton
          h="8"
          minW="8"
          variant="ghost"
          icon={<IconClose w="4" h="4" />}
          aria-label=""
          onClick={() => {
            removeIndicator({ id: indicator.id || '' });
          }}
        />
      </Tooltip>
    </Flex>
  );
};

// const SignalSetting = ({ indicator }: { indicator: Indicator }) => {
//   const { addBackTestSignal } = useBackTestStore();
//   const minInputRef = useRef<HTMLInputElement>(null);
//   const maxInputRef = useRef<HTMLInputElement>(null);

//   return (
//     <Flex flexDirection="column" gap="4">
//       <Flex w="full" alignItems="center" justifyContent="flex-end" gap="4">
//         <NumberInput name="min" defaultValue="0" min={0} max={100} flex="2">
//           <NumberInputField ref={minInputRef} />
//         </NumberInput>
//         <Flex flex="1" gap="2" justifyContent="center" alignItems="center">
//           <Text textAlign="center">{'<'}</Text>
//           <Text textAlign="center" whiteSpace="nowrap">
//             {indicator.name} {indicator.params.period}
//           </Text>
//           <Text textAlign="center">{'<'}</Text>
//         </Flex>
//         <NumberInput name="max" defaultValue="100" flex="2" min={0} max={100}>
//           <NumberInputField ref={maxInputRef} />
//         </NumberInput>
//         <Flex gap="2">
//           <Button
//             variant="ghost"
//             onClick={() => {
//               const min = minInputRef.current?.value;
//               const max = maxInputRef.current?.value;
//               addBackTestSignal({
//                 id: Date.now().toString(),
//                 name: indicator.name,
//                 action: 'buy',
//                 low: min ? Number(min) : 0,
//                 high: max ? Number(max) : 100,
//                 logicOperator: 'and',
//                 params: indicator.params,
//               });
//             }}
//           >
//             Add Buy Signal
//           </Button>
//           <Button
//             variant="ghost"
//             onClick={() => {
//               console.log(maxInputRef.current);
//               console.log(maxInputRef.current?.value);
//               const min = minInputRef.current?.value;
//               const max = maxInputRef.current?.value;
//               addBackTestSignal({
//                 id: Date.now().toString(),
//                 name: indicator.name,
//                 action: 'sell',
//                 low: min ? Number(min) : 0,
//                 high: max ? Number(max) : 100,
//                 logicOperator: 'and',
//                 params: indicator.params,
//               });
//             }}
//           >
//             Add Sell Signal
//           </Button>
//         </Flex>
//       </Flex>
//     </Flex>
//   );
// };

const IndicatorSettings = ({ indicator }: { indicator: Indicator }) => {
  return (
    <Flex
      gap="4"
      p="4"
      flexDirection="column"
      borderRadius="md"
      border="1px solid"
      borderColor="neutral.50"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3">{indicator.displayName}</Heading>
        <IndicatorOptions indicator={indicator} />
      </Flex>
      <PeriodSetting indicator={indicator} />
      {/* <SignalSetting indicator={indicator} /> */}
    </Flex>
  );
};

const AddedIndicatorPanel = ({
  indicatorPanelDisclosure: { onOpen },
}: {
  indicatorPanelDisclosure: UseDisclosureProps;
}) => {
  const { indicators } = useIndicatorStore();
  const indicatorsArr = Object.values(indicators);
  return (
    <Box flex="1" h="620px" pr="4" overflowY="auto">
      <Flex flexDirection="column" gap="4" position="relative">
        <Heading as="h2" position="sticky" top="0" bg="black" zIndex="3">
          Indicators
        </Heading>
        {indicatorsArr.map((indicator) => (
          <IndicatorSettings key={indicator.id} indicator={indicator} />
        ))}
        <Box flex="1" alignSelf="center">
          <Button
            size="md"
            rightIcon={<IconAdd />}
            onClick={() => {
              if (onOpen) {
                onOpen();
              }
            }}
          >
            Add Indicator
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default AddedIndicatorPanel;
