import {
  Button,
  Flex,
  FlexProps,
  HStack,
  Heading,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { BackTestSignal, useBackTestStore } from './store/back-test-store';
import IconClose from '../icon/close';
import MenuSelect from '../common/menu-select';
import IconChevronDown from '../icon/chevron-down';
import IconAdd from '../icon/add';
import { useIndicatorStore } from './store/indicator-store';
import { useRef } from 'react';
import usePostBackTest from ' /hooks/use-post-back-test';

const backTestBlockProps = {
  border: '1px solid',
  borderColor: 'neutral.50',
  borderRadius: 'md',
  flex: '1',
  flexDirection: 'column',
  gap: '4',
  p: '4',
} as FlexProps;

const logicOptions = [
  { value: 'and', label: 'and' },
  { value: 'or', label: 'or' },
];

const UpperBound = ({ signal }: { signal: BackTestSignal }) => {
  const { changeBackTestSignal } = useBackTestStore();
  const { indicators } = useIndicatorStore();
  const currentIndicator = indicators[signal.indicatorId];
  const max = currentIndicator?.params?.max ?? undefined;
  const upperBoundOptions = [
    { value: 'max', label: `Max${max ? ` (${max})` : ''}` },
    { value: 'number', label: 'Number' },
    { value: 'previous', label: `Previous ${currentIndicator?.displayName}` },
    ...Object.entries(indicators).map(([, indicator]) => ({
      value: indicator.id,
      label: indicator.displayName,
    })),
  ];
  return (
    <Flex flexDirection="column" gap="2">
      <MenuSelect
        options={upperBoundOptions}
        value={
          upperBoundOptions.find(
            (option) => option.value === signal.upperBound.name,
          ) || upperBoundOptions[0]
        }
        onChange={(option) => {
          changeBackTestSignal({
            ...signal,
            upperBound: {
              name: option.value,
            },
          });
        }}
        renderButtonText={(option) => option?.label}
        renderOption={(option, isSelected) => (
          <HStack>
            {option?.label}
            <Text fontSize="md" fontWeight={isSelected ? 600 : 500}>
              {option?.label}
            </Text>
          </HStack>
        )}
        menuButtonProps={{
          fontSize: 'md',
          rightIcon: <IconChevronDown />,
          isDisabled: !currentIndicator?.id,
        }}
        defaultValue={signal.upperBound.name}
      />
      {signal.upperBound.name === 'number' && (
        <NumberInput name="upper-bound" defaultValue="100" maxW="134px">
          <NumberInputField
            {...(signal.upperBound.value
              ? { value: signal.upperBound.value as number }
              : {})}
            onChange={(e) => {
              changeBackTestSignal({
                ...signal,
                upperBound: {
                  name: 'number',
                  value: Number(e.target.value),
                },
              });
            }}
          />
        </NumberInput>
      )}
    </Flex>
  );
};

const LowerBound = ({ signal }: { signal: BackTestSignal }) => {
  const { changeBackTestSignal } = useBackTestStore();
  const { indicators } = useIndicatorStore();
  const currentIndicator = indicators[signal.indicatorId];
  const min = currentIndicator?.params?.min ?? undefined;
  const lowerBoundOptions = [
    { value: 'min', label: `Min${!isNaN(Number(min)) ? ` (${min})` : ''}` },
    { value: 'number', label: 'Number' },
    ...(!signal.upperBound.name
      ? [
          {
            value: 'previous',
            label: `Previous ${currentIndicator?.displayName}`,
          },
        ]
      : []),
    ...Object.entries(indicators)
      .map(([, indicator]) => ({
        value: indicator.id,
        label: indicator.displayName,
      }))
      .filter((indicator) => indicator.value !== currentIndicator?.id)
      .filter((indicator) => indicator.label !== signal.upperBound.name),
  ];
  console.log(signal);
  return (
    <Flex flexDirection="column" gap="2">
      <MenuSelect
        options={lowerBoundOptions}
        value={
          lowerBoundOptions.find(
            (option) => option.value === signal.lowerBound.name,
          ) || lowerBoundOptions[0]
        }
        onChange={(option) =>
          changeBackTestSignal({
            ...signal,
            lowerBound: {
              name: option.value,
            },
          })
        }
        renderButtonText={(option) => option?.label}
        renderOption={(option, isSelected) => (
          <HStack>
            {option?.label}
            <Text fontSize="md" fontWeight={isSelected ? 600 : 500}>
              {option?.label}
            </Text>
          </HStack>
        )}
        menuButtonProps={{
          fontSize: 'md',
          rightIcon: <IconChevronDown />,
          isDisabled: !currentIndicator?.id,
        }}
        defaultValue={signal.lowerBound.name}
      />
      {signal.lowerBound.name === 'number' && (
        <NumberInput
          name="lower-bound"
          defaultValue={0}
          {...(signal.lowerBound.value
            ? { value: signal.lowerBound.value as number }
            : {})}
          maxW="134px"
        >
          <NumberInputField
            onChange={(e) => {
              changeBackTestSignal({
                ...signal,
                lowerBound: {
                  name: 'number',
                  value: Number(e.target.value),
                },
              });
            }}
          />
        </NumberInput>
      )}
    </Flex>
  );
};

const IndicatorSelector = ({ signal }: { signal: BackTestSignal }) => {
  const { changeBackTestSignal } = useBackTestStore();
  const { indicators } = useIndicatorStore();

  const indicatorOptions = [
    ...Object.entries(indicators).map(([, indicator]) => ({
      value: indicator.id,
      label: indicator.displayName,
    })),
  ];
  const hasIndicator = Object.keys(indicators).length > 0;
  return (
    <Tooltip
      label={
        hasIndicator ? '' : 'Please add an indicator from the indicator panel'
      }
      isDisabled={hasIndicator}
      shouldWrapChildren
    >
      <MenuSelect
        options={indicatorOptions}
        value={
          indicatorOptions.find(
            (option) => option.value === signal?.indicatorId,
          ) || {
            value: '',
            label: 'Select Indicator',
          }
        }
        onChange={(option) => {
          console.log({ ...signal, indicator: option.value });
          changeBackTestSignal({ ...signal, indicatorId: option.value });
        }}
        renderButtonText={(option) => option?.label}
        renderOption={(option, isSelected) => (
          <HStack>
            {option?.label}
            <Text fontSize="md" fontWeight={isSelected ? 600 : 500}>
              {option?.label}
            </Text>
          </HStack>
        )}
        menuButtonProps={{
          isDisabled: !hasIndicator,
          fontSize: 'md',
          rightIcon: <IconChevronDown />,
        }}
        defaultValue=""
      />
    </Tooltip>
  );
};

const LogicOperator = ({ signal }: { signal: BackTestSignal }) => {
  const { changeBackTestSignal } = useBackTestStore();
  return (
    <MenuSelect
      options={logicOptions}
      value={
        logicOptions.find(
          (option) => option.value === signal.logicOperator,
        ) || { value: 'and', label: 'and' }
      }
      onChange={(option) =>
        changeBackTestSignal({ ...signal, logicOperator: option.value })
      }
      renderButtonText={(option) => option?.label}
      renderOption={(option, isSelected) => (
        <HStack>
          {option?.label}
          <Text fontSize="md" fontWeight={isSelected ? 600 : 500}>
            {option?.label}
          </Text>
        </HStack>
      )}
      menuButtonProps={{
        fontSize: 'md',
        rightIcon: <IconChevronDown />,
        alignSelf: 'flex-start',
      }}
      defaultValue={signal.logicOperator}
    />
  );
};

const Signal = ({ signal }: { signal: BackTestSignal }) => {
  const { removeBackTestSignal } = useBackTestStore();

  return (
    <Flex flexDirection="column" gap="4">
      <Flex alignItems="center" gap="4" justifyContent="space-between">
        <Flex gap="2" alignItems="center">
          <UpperBound signal={signal} />
          <Text>{'>'}</Text>
          <IndicatorSelector signal={signal} />
          <Text>{'>'}</Text>
          <LowerBound signal={signal} />
        </Flex>

        <IconButton
          variant="outline"
          aria-label="close button"
          icon={<IconClose w="4" h="4" />}
          onClick={() => {
            removeBackTestSignal(signal.id);
          }}
        />
      </Flex>
      <LogicOperator signal={signal} />
    </Flex>
  );
};

const BackTestPanel = () => {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const { backTestSignals, addBackTestSignal } = useBackTestStore();
  const { indicators } = useIndicatorStore();
  const { mutate, isPending } = usePostBackTest({
    symbol: 'btcusdt',
    interval: '1h',
    start: new Date(startRef.current?.value ?? '').getTime().toString(),
    end: new Date(endRef.current?.value ?? '').getTime().toString(),
    signals: backTestSignals.map((signal) => ({
      ...signal,
      indicator: indicators[signal.indicatorId],
    })),
  });
  return (
    <Flex flex="1" flexDirection="column" w="full" gap="4">
      <Heading as="h2">Back Testing</Heading>
      <Flex w="full" gap="8" flexDirection="column">
        <Flex {...backTestBlockProps}>
          <Heading as="h3">Buy signal</Heading>

          {backTestSignals
            .filter((signal: BackTestSignal) => signal.action === 'buy')
            .map((signal: BackTestSignal) => {
              return <Signal key={signal.id} signal={signal} />;
            })}
          <Button
            alignSelf="self-start"
            size="sm"
            rightIcon={<IconAdd />}
            onClick={() => {
              addBackTestSignal({
                id: Date.now().toString(),
                action: 'buy',
                lowerBound: { name: 'min' },
                upperBound: { name: 'max' },
                logicOperator: 'and',
                indicatorId: '',
              });
            }}
          >
            Add Signal
          </Button>
        </Flex>
        <Flex w="full" gap="8" flexDirection="column">
          <Flex {...backTestBlockProps}>
            <Heading as="h3">Sell signal</Heading>

            {backTestSignals
              .filter((signal: BackTestSignal) => signal.action === 'sell')
              .map((signal: BackTestSignal) => {
                return <Signal key={signal.id} signal={signal} />;
              })}
            <Button
              alignSelf="self-start"
              size="sm"
              rightIcon={<IconAdd />}
              onClick={() => {
                addBackTestSignal({
                  id: Date.now().toString(),
                  action: 'sell',
                  lowerBound: { name: 'min' },
                  upperBound: { name: 'max' },
                  logicOperator: 'and',
                  indicatorId: '',
                });
              }}
            >
              Add Signal
            </Button>
          </Flex>
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
      <Button
        alignSelf="center"
        size="md"
        onClick={() => {
          console.log(
            backTestSignals.map((signal) => ({
              ...signal,
              indicator: indicators[signal.indicatorId],
            })),
          );
          mutate();
          console.log(startRef.current?.value);
          console.log(endRef.current?.value);
        }}
        isLoading={isPending}
      >
        Run Back Test
      </Button>
    </Flex>
  );
};

export default BackTestPanel;
