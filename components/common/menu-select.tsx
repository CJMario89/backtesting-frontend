/* eslint-disable no-unused-vars */
import {
  Button,
  ButtonProps,
  chakra,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuItemOptionProps,
  MenuList,
  MenuListProps,
  MenuOptionGroup,
  MenuOptionGroupProps,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import IconCheck from '../icon/check';
import IconChevronDown from '../icon/chevron-down';
import React from 'react';

type MenuSelectProps<T> = {
  defaultValue: string;
  options: T[];
  onChange: (arg1: any) => void;
  value: T;
  renderOption?: (option: T, isSelected: boolean) => React.ReactNode;
  renderButtonText?: (option: T, isSelected: boolean) => React.ReactNode;
  renderButtonIcon?: (isSelected: boolean) => React.ReactElement;
  menuButtonProps?: ButtonProps;
  menuListProps?: MenuListProps;
  menuOptionGroupProps?: MenuOptionGroupProps;
  menuItemOptionProps?: MenuItemOptionProps;
  menuDrawerEnabled?: boolean;
  renderDrawerHeader?: () => React.ReactNode;
};

type MenuSelectOptionType = {
  value: any;
  label?: string;
};

const MenuSelect = ({
  defaultValue,
  options = [],
  onChange,
  value,
  renderOption,
  renderButtonText,
  renderButtonIcon,
  menuButtonProps,
  menuListProps,
  menuOptionGroupProps,
  menuItemOptionProps,
  menuDrawerEnabled = false,
  renderDrawerHeader,
  ...restProps
}: MenuSelectProps<MenuSelectOptionType>) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const getButtonProps = (isOpen: boolean): ButtonProps =>
    typeof renderButtonIcon === 'function'
      ? { ...menuButtonProps, rightIcon: renderButtonIcon(isOpen) }
      : { ...menuButtonProps };

  const _renderOption = (
    option: MenuSelectOptionType,
    isSelected?: boolean,
  ) => {
    if (typeof renderOption === 'function') {
      return renderOption(option, isSelected || option.value === value?.value);
    }

    return option.label ?? option.value;
  };

  const _renderButtonText = (option: MenuSelectOptionType) => {
    if (typeof renderButtonText === 'function') {
      return renderButtonText(option, true);
    }

    return _renderOption(option, true);
  };

  return (
    <>
      {/* mobile menu button & drawer */}
      {menuDrawerEnabled && (
        <>
          <Button
            onClick={onOpen}
            rightIcon={<IconChevronDown />}
            justifyContent="space-between"
            display={{
              base: menuDrawerEnabled ? 'inline-flex' : 'none',
              md: 'none',
            }}
            {...menuButtonProps}
          >
            {_renderButtonText(value)}
          </Button>
          <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay backdropFilter="blur(0px)" />
            <DrawerContent
              borderTop="1px solid"
              borderColor="neutral.50"
              borderTopRightRadius="md"
              borderTopLeftRadius="md"
            >
              <DrawerCloseButton
                right="2"
                top={typeof renderDrawerHeader === 'function' ? '4' : '2'}
              />
              <DrawerHeader px="4">{renderDrawerHeader?.()}</DrawerHeader>
              <DrawerBody maxH="100dvh" px="0" pt="0" pb="4">
                <VStack spacing="0">
                  {options.map((option) => (
                    <chakra.button
                      key={option.value.toString()}
                      variant="ghost"
                      px="4"
                      justifyContent="space-between"
                      borderRadius="md"
                      alignSelf="stretch"
                      isActive={option.value === value?.value}
                      rightIcon={
                        option.value === value?.value ? (
                          <IconCheck />
                        ) : undefined
                      }
                      onClick={() => {
                        onChange(option);
                        onClose();
                      }}
                      {...menuItemOptionProps}
                    >
                      {_renderOption(option)}
                    </chakra.button>
                  ))}
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}

      {/* desktop menu */}
      <Menu {...restProps}>
        {({ isOpen }) => (
          <>
            <MenuButton
              isActive={isOpen}
              as={Button}
              textAlign="left"
              display={{
                base: menuDrawerEnabled ? 'none' : 'inline-flex',
                md: 'inline-flex',
              }}
              {...getButtonProps(isOpen)}
            >
              {_renderButtonText(value)}
            </MenuButton>
            <MenuList
              bg="darkTheme.800"
              display={{
                base: menuDrawerEnabled ? 'none' : 'block',
                md: 'block',
              }}
              {...menuListProps}
            >
              <MenuOptionGroup
                defaultValue={defaultValue}
                type="radio"
                onChange={(value) => {
                  const selectedOption = options.find(
                    (option) => option.value.toString() === value,
                  );
                  onChange(selectedOption);
                }}
                value={value.value.toString()}
                {...menuOptionGroupProps}
              >
                {options.map((option) => {
                  return (
                    <MenuItemOption
                      bg="darkTheme.800"
                      _hover={{ bg: 'darkTheme.700' }}
                      key={option.value.toString()}
                      value={option.value.toString()}
                      icon={<IconCheck />}
                      flexDirection="row-reverse"
                      sx={{
                        '& > .chakra-menu__icon-wrapper': {
                          marginRight: 0,
                          marginLeft: 2,
                        },
                      }}
                      {...menuItemOptionProps}
                    >
                      {_renderOption(option)}
                    </MenuItemOption>
                  );
                })}
              </MenuOptionGroup>
            </MenuList>
          </>
        )}
      </Menu>
    </>
  );
};

export default MenuSelect;
