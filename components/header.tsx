'use client';
import useAuth from ' /hooks/use-auth';
import useSignOut from ' /hooks/use-sign-out';
import useGetSubscriptionLink from ' /hooks/use-get-subscription-links';
import { Button, Flex, Text, Title } from ' /styled-antd';
import { GoogleOutlined } from '@ant-design/icons';

const Header = () => {
  const { name } = useAuth();
  const { mutateAsync, isPending: isGettingSubscription } =
    useGetSubscriptionLink();

  const { mutate: signout } = useSignOut();
  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        width: '100%',
        height: '64px',
        padding: '0px 16px',
      }}
    >
      <Title level={2}>BackTest</Title>
      <Button
        disabled={!name}
        loading={isGettingSubscription}
        onClick={async () => {
          const data = await mutateAsync();
          window.open(data, '_blank');
        }}
      >
        Subscribe
      </Button>
      {!!name && (
        <Flex align="center" gap="small">
          <Text>{name}</Text>
          <Button
            onClick={() => {
              signout();
            }}
          >
            Sign Out
          </Button>
        </Flex>
      )}
      {!name && (
        <Button href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`}>
          <GoogleOutlined />
          <Text
            style={{
              marginLeft: '8px',
            }}
          >
            Sign In
          </Text>
        </Button>
      )}
    </Flex>
  );
};

export default Header;
