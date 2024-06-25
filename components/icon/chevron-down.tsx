import { createIcon } from '@chakra-ui/react';

const IconChevronDown = createIcon({
  displayName: 'chevron-down',
  viewBox: '0 0 24 24',
  path: (
    <path
      fill="currentColor"
      d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"
    />
  ),
  defaultProps: {
    width: '4',
    height: '4',
  },
});

export default IconChevronDown;
