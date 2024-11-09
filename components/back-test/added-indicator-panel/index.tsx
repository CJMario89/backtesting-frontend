import { useIndicatorStore } from '../store/indicator-store';
import {
  BaseIndicatorExtended,
  IndicatorExtended,
} from '../store/indicator.type';
import IconChart from ' /components/icon/chart.svg';
import IconChartOff from ' /components/icon/chart-off.svg';
import IconClose from ' /components/icon/close.svg';
import ParamsSetting from './params-setting';
import { paramsSetting } from '../store/constants';
import { useBackTestStore } from '../store/back-test-store';
import {
  Button,
  Divider,
  Flex,
  Input,
  Text,
  Title,
  Tooltip,
} from ' /styled-antd';
import { PlusOutlined } from '@ant-design/icons';
import { forwardRef, useImperativeHandle, useRef } from 'react';

const IndicatorOptions = ({
  baseIndicator,
}: {
  baseIndicator: BaseIndicatorExtended;
}) => {
  const { toggleChart, removeIndicator, setIndicatorColor } =
    useIndicatorStore();
  const { backTestSignals } = useBackTestStore();
  const color = baseIndicator.color;
  const setColor = (value: string) => {
    setIndicatorColor({
      id: baseIndicator.id || '',
      baseId: baseIndicator.baseId,
      color: value,
    });
  };

  const isInUse = backTestSignals.some(
    (signal) => signal.indicatorId === baseIndicator.id,
  );
  return (
    <Flex gap="small">
      {!baseIndicator.isColorFixed && (
        <Input
          style={{
            width: '36px',
            padding: '0 4px',
          }}
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      )}
      <Tooltip
        title={
          baseIndicator.isShowInChart ? 'Remove from Chart' : 'Add to Chart'
        }
        aria-label={
          baseIndicator.isShowInChart ? 'Remove from Chart' : 'Add to Chart'
        }
      >
        <Button
          style={{
            height: '32px',
          }}
          icon={
            baseIndicator.isShowInChart ? (
              <IconChart w="4" h="4" />
            ) : (
              <IconChartOff w="4" h="4" />
            )
          }
          aria-label=""
          onClick={() => {
            toggleChart({
              id: baseIndicator.id || '',
              baseId: baseIndicator.baseId,
            });
          }}
        />
      </Tooltip>
      <Tooltip
        title={isInUse ? 'This indicator is in used' : 'Remove Indicator'}
        aria-label="Remove"
      >
        <Button
          style={{
            height: '32px',
            minWidth: '32px',
          }}
          icon={<IconClose />}
          aria-label=""
          disabled={isInUse}
          onClick={() => {
            if (!isInUse) {
              removeIndicator({
                id: baseIndicator.id || '',
              });
            }
          }}
        />
      </Tooltip>
    </Flex>
  );
};

const IndicatorSettings = ({ indicator }: { indicator: IndicatorExtended }) => {
  return (
    <Flex
      gap="small"
      style={{
        padding: '16px 8px',
        borderBottom: '0.1px solid',
        borderColor: '#727274',
        width: '100%',
      }}
      vertical
    >
      <Title level={5}>{indicator.name}</Title>
      {indicator.indicators.map((baseIndicator) => (
        <Flex key={baseIndicator.name} vertical gap="middle">
          <Flex justify="space-between" align="center">
            <Text>{baseIndicator.displayName}</Text>
            <IndicatorOptions baseIndicator={baseIndicator} />
          </Flex>
          {Object.keys(baseIndicator.params)
            .filter((params) => paramsSetting.includes(params))
            .map((params) => {
              return (
                <ParamsSetting
                  key={params}
                  baseIndicator={baseIndicator}
                  name={params as keyof typeof baseIndicator.params}
                />
              );
            })}
        </Flex>
      ))}
    </Flex>
  );
};

const AddedIndicatorPanel = forwardRef(function AddedIndicatorPanel(
  { onOpen }: { onOpen?: () => void },
  ref,
) {
  const { allIndicator } = useIndicatorStore();
  const indicatorsArr = Object.values(allIndicator);

  //tour ref
  const entireTourRef = useRef<HTMLDivElement>(null);
  const addButtonTourRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(ref, () => ({
    getEntireTourRef: () => {
      return entireTourRef.current;
    },
    getAddButtonTourRef: () => {
      return addButtonTourRef.current;
    },
  }));

  return (
    <Flex
      flex="1"
      style={{
        padding: '8px',
        maxWidth: '400px',
        background: '#17171c',
      }}
      vertical
      gap="small"
      ref={entireTourRef}
    >
      <Title
        level={4}
        style={{
          position: 'sticky',
          top: '0',
          zIndex: 3,
        }}
      >
        Indicators
      </Title>
      <Divider />

      <Flex
        style={{
          overflowY: 'auto',
          height: '588px',
        }}
      >
        <Flex
          vertical
          style={{
            position: 'relative',
            width: '100%',
          }}
        >
          {indicatorsArr.map((indicator) => (
            <IndicatorSettings key={indicator.name} indicator={indicator} />
          ))}
        </Flex>
      </Flex>
      <Flex
        flex="1"
        style={{
          padding: '8px',
        }}
        align="center"
      >
        <Button
          onClick={() => {
            if (onOpen) {
              onOpen();
            }
          }}
          ref={addButtonTourRef}
        >
          <PlusOutlined />
          Add Indicator
        </Button>
      </Flex>
    </Flex>
  );
});

export default AddedIndicatorPanel;
