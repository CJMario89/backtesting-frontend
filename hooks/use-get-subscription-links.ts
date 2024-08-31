import { getSubscriptionLinks } from ' /service/payment';
import { useMutation } from '@tanstack/react-query';
import useAuth from './use-auth';

const useGetSubscriptionLink = () => {
  const { name, email } = useAuth();
  return useMutation({
    mutationFn: async () => {
      if (!name || !email) {
        throw new Error('Name and email are required');
      }
      const response = await getSubscriptionLinks({
        name,
        email,
      });

      const result = await response.json();
      return result;
    },
  });
};

export default useGetSubscriptionLink;
