export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const debounce = (
  // eslint-disable-next-line no-unused-vars
  callback: (...args: any[]) => void,
  delay?: number,
) => {
  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timeout;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(), delay ?? 500);
  };
};
