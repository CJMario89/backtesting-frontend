import { createIcon } from '@chakra-ui/react';

const IconClose = createIcon({
  displayName: 'Close',
  viewBox: '0 0 16 16',
  path: (
    <>
      <path
        fill="currentColor"
        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
      />
    </>
  ),
  defaultProps: {
    width: '4',
    height: '4',
  },
});

export default IconClose;
