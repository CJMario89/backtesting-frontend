import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  Text,
  Tooltip,
  UseDisclosureProps,
} from '@chakra-ui/react';

import { useIndicatorStore } from '../store/indicator-store';
import {
  BaseIndicatorExtended,
  IndicatorExtended,
} from '../store/indicator.type';
import IconAdd from ' /components/icon/add';
import IconChart from ' /components/icon/chart';
import IconChartOff from ' /components/icon/chart-off';
import IconClose from ' /components/icon/close';
import ParamsSetting from './params-setting';
import { paramsSetting } from '../store/constants';
import { useBackTestStore } from '../store/back-test-store';

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
    <Flex gap="2">
      {!baseIndicator.isColorFixed && (
        <Input
          w="9"
          px="1"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      )}
      <Tooltip
        label={
          baseIndicator.isShowInChart ? 'Remove from Chart' : 'Add to Chart'
        }
        aria-label={
          baseIndicator.isShowInChart ? 'Remove from Chart' : 'Add to Chart'
        }
      >
        <IconButton
          h="8"
          minW="8"
          variant="ghost"
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
        label={isInUse ? 'This indicator is in used' : 'Remove Indicator'}
        aria-label="Remove"
      >
        <IconButton
          h="8"
          minW="8"
          variant="ghost"
          icon={<IconClose w="4" h="4" />}
          aria-label=""
          isDisabled={isInUse}
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
      gap="2"
      p="2"
      py="4"
      flexDirection="column"
      borderBottom="0.1px solid"
      borderColor="neutral.500"
    >
      <Heading as="h6">{indicator.name}</Heading>
      {indicator.indicators.map((baseIndicator) => (
        <Flex key={baseIndicator.name} flexDirection="column" gap="4">
          <Flex justifyContent="space-between" alignItems="center">
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

const AddedIndicatorPanel = ({
  indicatorPanelDisclosure: { onOpen },
}: {
  indicatorPanelDisclosure: UseDisclosureProps;
}) => {
  const { allIndicator } = useIndicatorStore();
  const indicatorsArr = Object.values(allIndicator);
  return (
    <Flex
      flex="1"
      p="2"
      flexDirection="column"
      gap="2"
      maxW="400px"
      bgColor="darkTheme.800"
    >
      <Heading
        as="h4"
        position="sticky"
        top="0"
        zIndex="3"
        bgColor="darkTheme.800"
      >
        Indicators
      </Heading>
      <Divider />

      <Box overflowY="auto" h="588px">
        <Flex flexDirection="column" gap="2" position="relative">
          {indicatorsArr.map((indicator) => (
            <IndicatorSettings key={indicator.name} indicator={indicator} />
          ))}
        </Flex>
      </Box>
      <Box flex="1" py="2" alignSelf="center">
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
  );
};

export default AddedIndicatorPanel;
