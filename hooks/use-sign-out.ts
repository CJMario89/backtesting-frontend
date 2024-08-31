import { googleLogout } from ' /service/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const useSignOut = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await googleLogout();
      console.log(response);
      const data = await response.json();
      console.log(data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['auth'],
      });
      router.push('/');
    },
  });
};

export default useSignOut;
