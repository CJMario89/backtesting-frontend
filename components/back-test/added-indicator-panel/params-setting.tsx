/* eslint-disable react/no-children-prop */
import React from 'react';
import { BaseIndicatorExtended } from '../store/indicator.type';
import { useIndicatorStore } from '../store/indicator-store';

import { paramsMaxMap } from '../store/constants';
import { Flex, InputNumber, Slider, Text } from ' /styled-antd';

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
    <Flex
      style={{
        width: '100%',
      }}
      align="center"
      gap="small"
    >
      <Text
        style={{
          fontSize: '14px',
          color: '#DCDCDE',
        }}
      >
        {name}
      </Text>
      <Slider
        style={{
          flex: 1,
        }}
        min={1}
        max={max}
        onChange={(value) => setParams(value.toString())}
        value={Number(params)}
        disabled={isValueFixed}
      />
      <InputNumber
        min={1}
        max={max}
        style={{ margin: '0' }}
        value={Number(params)}
        onChange={(value) => {
          if (value) {
            setParams(value.toString());
          }
        }}
      />
      <Text style={{ fontSize: '14px', color: '#DCDCDE' }}>Bars</Text>
    </Flex>
  );
};

export default ParamsSetting;
