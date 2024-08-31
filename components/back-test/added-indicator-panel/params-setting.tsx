/* eslint-disable react/no-children-prop */
import React from 'react';
import { BaseIndicatorExtended } from '../store/indicator.type';
import { useIndicatorStore } from '../store/indicator-store';
import {
  Flex,
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
} from '@chakra-ui/react';
import { capitalize } from ' /utils';
import { paramsMaxMap } from '../store/constants';

const ParamsSetting = ({
  baseIndicator,
  name,
}: {
  baseIndicator: BaseIndicatorExtended;
  name: keyof typeof baseIndicator.params;
}) => {
  const { setIndicatorParams } = useIndicatorStore();
  const params = baseIndicator.params[name];
  const setParams = (value: string) => {
    setIndicatorParams({
      id: baseIndicator.id || '',
      baseId: baseIndicator.baseId,
      params: { ...baseIndicator.params, [name]: value },
    });
  };

  const isValueFixed = baseIndicator.params.isValueFixed;
  const max = paramsMaxMap[name];
  return (
    <Flex w="full" alignItems="center" gap="4">
      <Text fontSize="sm" color="neutral.200">
        {capitalize(name)}
      </Text>
      <NumberInput
        maxW="100px"
        mr="2rem"
        fontSize="sm"
        color="neutral.400"
        value={Number(params)}
        onChange={(value) => setParams(value)}
        min={1}
        max={max ?? 100}
        isReadOnly={isValueFixed}
        isDisabled={isValueFixed}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Slider
        isReadOnly={isValueFixed}
        flex="1"
        focusThumbOnChange={false}
        value={Number(params)}
        onChange={(value) => setParams(value.toString())}
        min={1}
        max={max ?? 100}
        isDisabled={isValueFixed}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize="sm" boxSize="4" />
      </Slider>
      <Text color="neutral.400" fontSize="sm">
        Bars
      </Text>
    </Flex>
  );
};

export default ParamsSetting;
