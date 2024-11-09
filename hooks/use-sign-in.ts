import { googleLogin } from ' /service/auth';
import { useMutation } from '@tanstack/react-query';

const useSignIn = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await googleLogin();
      const data = await response.json();
      return data;
    },
  });
};

export default useSignIn;
