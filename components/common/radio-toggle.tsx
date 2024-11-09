import { Radio } from ' /styled-antd';
import { RadioChangeEvent } from 'antd';

const RadioToggle = ({
  onChange,
  value,
  options,
}: {
  // eslint-disable-next-line no-unused-vars
  onChange: (e: RadioChangeEvent) => void;
  value: string;
  options: { value: string; label: string }[];
}) => {
  return (
    <Radio.Group
      value={value}
      onChange={onChange}
      optionType="button"
      buttonStyle="outline"
      style={{
        borderRadius: '0px',
      }}
    >
      {options.map((option) => (
        <Radio key={option.value} value={option.value} onChange={onChange}>
          {option.label}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default RadioToggle;
