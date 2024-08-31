import { getProfile } from ' /service/auth';
import { useQuery } from '@tanstack/react-query';

type Auth = {
  email: string;
  name: string;
};

const useAuth = () => {
  const query = useQuery<void, Error, Auth>({
    queryKey: ['auth'],
    queryFn: async () => {
      const response = await getProfile();
      const data = await response.json();

      console.log(data);
      return data;
    },
  });
  return {
    name: query.data?.name,
    email: query.data?.email,
    ...query,
  };
};

export default useAuth;
