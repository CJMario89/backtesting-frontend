import { googleLogin } from ' /service/auth';
import { useMutation } from '@tanstack/react-query';

const useSignIn = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await googleLogin();
      console.log(response);
      const data = await response.json();
      console.log(data);
      return data;
    },
  });
};

export default useSignIn;
