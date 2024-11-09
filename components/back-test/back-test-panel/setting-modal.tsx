import { BackTestSignal, useBackTestStore } from '../store/back-test-store';
import { useIndicatorStore } from '../store/indicator-store';
import Bound from './bound';
import { capitalize } from ' /utils';
import ConditionText, { getBoundValue } from './condition-text';
import {
  BaseIndicatorExtended,
  IndicatorExtended,
} from '../store/indicator.type';

import { v4 as uuid } from 'uuid';
import {
  Button,
  Flex,
  Modal,
  Select,
  Text,
  Title,
  Tooltip,
} from ' /styled-antd';

const IndicatorSelector = ({
  action,
  signal,
}: {
  action: 'buy' | 'sell';
  signal?: BackTestSignal;
}) => {
  const { changeTempSignal } = useBackTestStore();
  const { allIndicator } = useIndicatorStore();
  const indicatorOptions: {
    value: string;
    label: string;
    indicatorId?: string;
    baseIndicator?: BaseIndicatorExtended;
  }[] = [
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
  const hasIndicator = Object.keys(allIndicator).length > 0;
  return (
    <Tooltip
      title={
        hasIndicator ? '' : 'Please add an indicator from the indicator panel'
      }
      placement="top"
      open={false}
    >
      <Select
        options={indicatorOptions}
        style={{
          width: '100%',
        }}
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
        onChange={(option: any) => {
          const indicatorOption = indicatorOptions.find(
            (indicatorOption) => indicatorOption.value === option,
          );
          if (!indicatorOption) return;
          changeTempSignal({
            id: uuid(),
            action,
            logicOperator: 'and',
            baseIndicatorId: indicatorOption.value,
            baseIndicator: indicatorOption?.baseIndicator,
            indicatorId: indicatorOption.indicatorId ?? '',
            upperBound: {
              name: 'max',
            },
            lowerBound: {
              name: 'min',
            },
          });
        }}
      />
    </Tooltip>
  );
};

const SettingModal = ({
  action,
  isOpen = false,
  onClose = () => {},
}: {
  action: 'buy' | 'sell';
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { tempSignal, addBackTestSignal } = useBackTestStore();
  const signal = tempSignal;

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        onClose();
      }}
      title={<Title level={3}>Add {capitalize(action)} Signal</Title>}
      footer={
        <Button
          onClick={() => {
            if (signal && signal.baseIndicator) {
              const upperBoundValue = getBoundValue({
                side: 'upperBound',
                signal,
              });
              const lowerBoundValue = getBoundValue({
                side: 'lowerBound',
                signal,
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
          Confirm
        </Button>
      }
    >
      <form
        style={{
          minHeight: '400px',
        }}
        onSubmit={(e) => {
          e.preventDefault();
          if (signal && signal.baseIndicator) {
            const upperBoundValue = getBoundValue({
              side: 'upperBound',
              signal,
            });
            const lowerBoundValue = getBoundValue({
              side: 'lowerBound',
              signal,
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
        <Flex gap="middle" vertical>
          <Title level={5}>Select an indicator to add a {action} signal:</Title>
          <IndicatorSelector action={action} signal={signal} />
          {signal?.indicatorId && (
            <Flex vertical gap="middle">
              <Flex vertical gap="small">
                <Text>{capitalize(action)} when signal is above:</Text>
                <Bound signal={signal} side="lowerBound" />
              </Flex>
              <Flex vertical gap="small">
                <Text>{capitalize(action)} when signal is below:</Text>
                <Bound signal={signal} side="upperBound" />
              </Flex>
              <ConditionText signal={signal} />
            </Flex>
          )}
        </Flex>
      </form>
    </Modal>
    // <Modal isOpen={isOpen} onClose={() => {}}>
    //   <ModalOverlay />
    //   <form
    //     onSubmit={(e) => {
    //       e.preventDefault();
    //       if (signal && signal.baseIndicator) {
    //         const upperBoundValue = getBoundValue({
    //           side: 'upperBound',
    //           signal,
    //           baseIndicator: signal.baseIndicator,
    //         });
    //         const lowerBoundValue = getBoundValue({
    //           side: 'lowerBound',
    //           signal,
    //           baseIndicator: signal.baseIndicator,
    //         });
    //         if (
    //           typeof upperBoundValue !== 'undefined' ||
    //           typeof lowerBoundValue !== 'undefined'
    //         ) {
    //           addBackTestSignal(signal);
    //         }
    //       }
    //       onClose();
    //     }}
    //   >
    //     <ModalContent bgColor="darkTheme.900" p="6">
    //       {/* <ModalHeader>{currentIndicator?.name}</ModalHeader> */}
    //       <ModalBody>
    //         <Flex gap="4" flexDirection="column">
    //           <Heading as="h3">{capitalize(action)}</Heading>
    //           <Flex alignItems="center" gap="4">
    //             <Text>when</Text>
    //             <IndicatorSelector action={action} signal={signal} />
    //             <Text>is</Text>
    //           </Flex>
    //           {signal?.indicatorId && (
    //             <Flex gap="4" flexDirection="column">
    //               <Flex alignItems="center" gap="4">
    //                 <Text>above</Text>
    //                 <Bound signal={signal} side="lowerBound" />
    //               </Flex>
    //               <Flex alignItems="center" gap="4">
    //                 <Text>below</Text>
    //                 <Bound signal={signal} side="upperBound" />
    //               </Flex>
    //               <Divider />
    //               <Text>{capitalize(action)} when </Text>
    //               <ConditionText signal={signal} />
    //             </Flex>
    //           )}
    //         </Flex>
    //       </ModalBody>
    //       <ModalFooter>
    //         <Button size="md" type="submit">
    //           Confirm
    //         </Button>
    //       </ModalFooter>
    //     </ModalContent>
    //   </form>
    // </Modal>
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
