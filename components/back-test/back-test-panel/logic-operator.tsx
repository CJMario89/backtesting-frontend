import MenuSelect from ' /components/common/menu-select';
import { HStack, Text } from '@chakra-ui/react';
import { BackTestSignal, useBackTestStore } from '../store/back-test-store';
import IconChevronDown from ' /components/icon/chevron-down';
const logicOptions = [
  { value: 'and', label: 'and' },
  { value: 'or', label: 'or' },
];
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

export default LogicOperator;
