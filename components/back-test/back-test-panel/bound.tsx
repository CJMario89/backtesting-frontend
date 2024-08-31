import {
  Flex,
  HStack,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import { BackTestSignal, useBackTestStore } from '../store/back-test-store';
import { useIndicatorStore } from '../store/indicator-store';
import MenuSelect from ' /components/common/menu-select';
import IconChevronDown from ' /components/icon/chevron-down';
import getCurrentIndicatorFromSignal from ' /hooks/get-current-indicator-from-signal';

const Bound = ({
  signal,
  side,
}: {
  signal: BackTestSignal;
  side: 'upperBound' | 'lowerBound';
}) => {
  const oppositeSide = side === 'upperBound' ? 'lowerBound' : 'upperBound';
  const { changeTempSignal } = useBackTestStore();
  const { allIndicator } = useIndicatorStore();
  const currentIndicator = getCurrentIndicatorFromSignal({
    signal,
    allIndicator,
  }).baseIndicator;
  const max = currentIndicator?.params?.max ?? undefined;
  const min = currentIndicator?.params?.min ?? undefined;
  const isPriceRelated = currentIndicator?.params?.isPriceRelated;
  const priceIndicators = Object.entries(allIndicator)
    .flatMap(([, indicator]) => indicator.indicators)
    .filter((indicator) => indicator.params.isPriceRelated)
    .filter((indicator) => indicator.baseId !== currentIndicator?.baseId)
    .filter((indicator) => indicator.baseId !== signal[oppositeSide].name)
    .map((indicator) => ({
      value: indicator.baseId,
      label: indicator.displayName,
      indicatorId: indicator.id,
      baseIndicatorId: indicator.baseId,
    }));

  const boundOptions = [
    side === 'upperBound'
      ? { value: 'max', label: `Max${max ? ` (${max})` : ''}` }
      : { value: 'min', label: `Min${!isNaN(Number(min)) ? ` (${min})` : ''}` },
    { value: 'number', label: 'Number' },
    ...(isPriceRelated &&
    signal[oppositeSide].name !== 'price' &&
    currentIndicator.name !== 'price'
      ? [{ value: 'price', label: 'Current Price' }]
      : []),
    ...(signal[oppositeSide].name !== 'previous'
      ? [
          {
            value: 'previous',
            label: `Previous Candle`,
          },
        ]
      : []),
    ...(isPriceRelated ? priceIndicators : []),
  ];
  const numberDefaultValue = side === 'lowerBound' ? min : max;
  return (
    <Flex flexDirection="column" gap="2">
      <MenuSelect
        options={boundOptions}
        value={
          boundOptions.find((option) => option.value === signal[side].name) ||
          boundOptions[0]
        }
        onChange={(option) => {
          changeTempSignal({
            ...signal,
            [side]: {
              name: option.value,
              ...(option.value === 'number'
                ? { value: numberDefaultValue }
                : {}),
              ...(option.indicatorId && option.baseIndicatorId
                ? {
                    value: allIndicator[option.indicatorId]?.indicators?.find(
                      (baseIndicator) =>
                        baseIndicator.baseId === option.baseIndicatorId,
                    ),
                  }
                : {}),
            },
          });
        }}
        renderButtonText={(option) => option?.label}
        renderOption={(option, isSelected) => (
          <HStack>
            {option?.label}
            <Text
              fontSize="sm"
              color={isSelected ? 'neutral.50' : 'neutral.200'}
            >
              {option?.label}
            </Text>
          </HStack>
        )}
        menuButtonProps={{
          fontSize: 'sm',
          rightIcon: <IconChevronDown />,
          // isDisabled: !currentIndicator?.id,
        }}
        defaultValue={signal[side].name}
      />
      {signal[side].name === 'number' && (
        <NumberInput
          name={side}
          defaultValue={numberDefaultValue?.toString()}
          {...(typeof signal[side].value === 'number'
            ? { value: signal[side].value as number }
            : {})}
          maxW="134px"
        >
          <NumberInputField
            onChange={(e) => {
              changeTempSignal({
                ...signal,
                [side]: {
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

export default Bound;
