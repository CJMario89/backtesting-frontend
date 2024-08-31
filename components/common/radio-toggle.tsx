// @ts-nocheck
import {
  Box,
  Center,
  Input,
  RadioProps,
  SimpleGrid,
  SimpleGridProps,
  Text,
  TextProps,
  UseRadioGroupReturn,
  chakra,
  useRadio,
} from '@chakra-ui/react';

type Option = {
  label: string;
  value: string;
  iconName?: string;
};

type OptionProps = Option & {
  variant: 'text' | 'icon';
  textProps?: TextProps;
};

type RadioToggleProps = {
  variant: 'text' | 'icon';
  options: Option[];
  textProps?: TextProps;
  containerProps?: SimpleGridProps;
} & Pick<UseRadioGroupReturn, 'getRootProps' | 'getRadioProps'>;

const transition = 'all 0.2s ease-in-out';

const Radio = ({ label, textProps = {}, ...radioProps }: OptionProps) => {
  const { state, getInputProps, getRadioProps } = useRadio(radioProps);

  const isSelected = state.isChecked;
  return (
    <chakra.label cursor={radioProps.cursor} zIndex="2" bg="darkTheme.900">
      <Input {...getInputProps()} />
      <Center
        position="relative"
        py="1"
        px="3"
        _hover={{
          bgColor: isSelected ? 'darkTheme.400' : 'darkTheme.900',
        }}
        {...getRadioProps()}
      >
        <Box
          w="full"
          h="full"
          zIndex="-1"
          position="absolute"
          bgColor={isSelected ? 'darkTheme.500' : 'darkTheme.900'}
          transition={transition}
        />
        <Text
          fontSize="sm"
          color={isSelected ? 'neutral.50' : 'neutral.100'}
          transition={transition}
          {...textProps}
        >
          {label}
        </Text>
      </Center>
    </chakra.label>
  );
};

const RadioToggle = ({
  variant = 'text',
  options,
  getRootProps,
  getRadioProps,
  textProps,
  containerProps,
  ...radioProps
}: RadioToggleProps | RadioProps) => {
  return (
    <SimpleGrid
      columns={options?.length}
      p="1"
      borderRadius="md"
      bg="darkTheme.900"
      {...containerProps}
      {...getRootProps()}
      // cursor={radioProps.isDisabled ? 'not-allowed' : 'pointer'}
    >
      {options.map((option) => {
        const radio = getRadioProps({ value: option?.value });
        return (
          <Radio
            key={option?.value}
            variant={variant}
            textProps={textProps}
            {...option}
            {...radio}
            cursor={radioProps.isDisabled ? 'not-allowed' : 'pointer'}
          />
        );
      })}
    </SimpleGrid>
  );
};

export default RadioToggle;
