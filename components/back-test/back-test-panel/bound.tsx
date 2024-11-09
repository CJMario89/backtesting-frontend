import { BackTestSignal, useBackTestStore } from '../store/back-test-store';
import { useIndicatorStore } from '../store/indicator-store';
import { Flex, Input, Select } from ' /styled-antd';
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

  const boundOptions: {
    value: string;
    label: string;
    indicatorId?: string;
    baseIndicatorId?: string;
  }[] = [
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
    <Flex vertical gap="small">
      <Select
        defaultValue={boundOptions[0].value}
        onChange={(value) => {
          const option = boundOptions.find((option) => option.value === value);
          if (!option) return;
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
        options={boundOptions}
      />
      {/* <MenuSelect
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
          <Flex gap="small">
            {option?.label}
            <Text color={isSelected ? 'neutral.50' : 'neutral.200'}>
              {option?.label}
            </Text>
          </Flex>
        )}
        menuButtonProps={{
          fontSize: 'sm',
          rightIcon: <DownOutlined />,
          // isDisabled: !currentIndicator?.id,
        }}
        defaultValue={signal[side].name}
      /> */}
      {signal[side].name === 'number' && (
        <Input
          type="number"
          style={{
            maxWidth: '134px',
          }}
          name={side}
          defaultValue={numberDefaultValue?.toString()}
          {...(typeof signal[side].value === 'number'
            ? { value: signal[side].value as number }
            : {})}
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
      )}
    </Flex>
  );
};

export default Bound;
