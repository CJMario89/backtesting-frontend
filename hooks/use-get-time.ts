const useGetTime = ({ time }: { time: string | number }) => {
  const value = Number(time);
  const days = Math.floor(value / (1000 * 60 * 60 * 24));
  const hours = Math.floor((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((value % (1000 * 60 * 60)) / (1000 * 60));

  return {
    days,
    hours,
    minutes,
  };
};

export default useGetTime;
