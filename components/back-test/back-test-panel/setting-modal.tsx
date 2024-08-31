import {
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  Tooltip,
  UseDisclosureProps,
} from '@chakra-ui/react';
import { BackTestSignal, useBackTestStore } from '../store/back-test-store';
import { useIndicatorStore } from '../store/indicator-store';
import Bound from './bound';
import { capitalize } from ' /utils';
import ConditionText, { getBoundValue } from './condition-text';
import MenuSelect from ' /components/common/menu-select';
import IconChevronDown from ' /components/icon/chevron-down';
import {
  BaseIndicatorExtended,
  IndicatorExtended,
} from '../store/indicator.type';

import { v4 as uuid } from 'uuid';

const IndicatorSelector = ({
  action,
  signal,
}: {
  action: 'buy' | 'sell';
  signal?: BackTestSignal;
}) => {
  const { changeTempSignal } = useBackTestStore();
  const { allIndicator } = useIndicatorStore();
  const indicatorOptions = [
    {
      value: 'price',
      label: 'Current Price',
      indicatorId: 'price',
    },
    ...Object.values(allIndicator)
      .flatMap((indicator) => flatMultiResult(indicator))
      .map((baseIndicator) => ({
        value: baseIndicator.baseId,
        label: baseIndicator.displayName,
        indicatorId: baseIndicator.id,
        baseIndicator,
      })),
  ];
  console.log(allIndicator);
  const hasIndicator = Object.keys(allIndicator).length > 0;
  return (
    <Tooltip
      label={
        hasIndicator ? '' : 'Please add an indicator from the indicator panel'
      }
      placement="top"
      isDisabled={false}
      shouldWrapChildren
    >
      <MenuSelect
        options={indicatorOptions}
        value={
          indicatorOptions.find((option) => {
            if (signal?.baseIndicatorId === option.value) {
              return true;
            }
            return option.label === signal?.baseIndicator?.displayName;
          }) || {
            value: '',
            label: 'Select Indicator',
          }
        }
        onChange={(option) => {
          changeTempSignal({
            id: uuid(),
            action,
            logicOperator: 'and',
            baseIndicatorId: option.value,
            baseIndicator: option.baseIndicator,
            indicatorId: option.indicatorId,
            upperBound: {
              name: 'max',
            },
            lowerBound: {
              name: 'min',
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
          isDisabled: !hasIndicator,
          fontSize: 'sm',
          rightIcon: <IconChevronDown />,
        }}
        defaultValue=""
      />
    </Tooltip>
  );
};

const SettingModal = ({
  action,
  isOpen = false,
  onClose = () => {},
}: { action: 'buy' | 'sell' } & UseDisclosureProps) => {
  const { tempSignal, addBackTestSignal } = useBackTestStore();
  const signal = tempSignal;

  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (signal && signal.baseIndicator) {
            const upperBoundValue = getBoundValue({
              side: 'upperBound',
              signal,
              baseIndicator: signal.baseIndicator,
            });
            const lowerBoundValue = getBoundValue({
              side: 'lowerBound',
              signal,
              baseIndicator: signal.baseIndicator,
            });
            if (
              typeof upperBoundValue !== 'undefined' ||
              typeof lowerBoundValue !== 'undefined'
            ) {
              addBackTestSignal(signal);
            }
          }
          onClose();
        }}
      >
        <ModalContent bgColor="darkTheme.900" p="6">
          {/* <ModalHeader>{currentIndicator?.name}</ModalHeader> */}
          <ModalBody>
            <Flex gap="4" flexDirection="column">
              <Heading as="h3">{capitalize(action)}</Heading>
              <Flex alignItems="center" gap="4">
                <Text>when</Text>
                <IndicatorSelector action={action} signal={signal} />
                <Text>is</Text>
              </Flex>
              {signal?.indicatorId && (
                <Flex gap="4" flexDirection="column">
                  <Flex alignItems="center" gap="4">
                    <Text>above</Text>
                    <Bound signal={signal} side="lowerBound" />
                  </Flex>
                  <Flex alignItems="center" gap="4">
                    <Text>below</Text>
                    <Bound signal={signal} side="upperBound" />
                  </Flex>
                  <Divider />
                  <Text>{capitalize(action)} when </Text>
                  <ConditionText signal={signal} />
                </Flex>
              )}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button size="md" type="submit">
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

function flatMultiResult(
  indicator: IndicatorExtended,
): BaseIndicatorExtended[] {
  return indicator.multiResult
    ? Object.entries(indicator.multiResult)
        .filter(([, enabled]) => {
          return enabled;
        })
        .flatMap(([resultOption]) => {
          return [
            {
              ...indicator.indicators[0],
              baseId: `${indicator.indicators[0].baseId}-${resultOption}`,
              displayName: `${indicator.indicators[0].displayName} (${resultOption})`,
              params: {
                ...indicator.indicators[0].params,
                resultOption: resultOption,
              },
            },
          ];
        })
    : indicator.indicators;
}

export default SettingModal;
