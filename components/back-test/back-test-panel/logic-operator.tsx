import { BackTestSignal, useBackTestStore } from '../store/back-test-store';
import { Select } from ' /styled-antd';
const logicOptions = [
  { value: 'and', label: 'and' },
  { value: 'or', label: 'or' },
];
const LogicOperator = ({ signal }: { signal: BackTestSignal }) => {
  const { changeBackTestSignal } = useBackTestStore();
  return (
    <Select
      options={logicOptions}
      value={
        logicOptions.find(
          (option) => option.value === signal.logicOperator,
        ) || { value: 'and', label: 'and' }
      }
      onChange={(option: any) =>
        changeBackTestSignal({ ...signal, logicOperator: option?.value })
      }
    />
  );
};

export default LogicOperator;
