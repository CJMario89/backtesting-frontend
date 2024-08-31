'use client';
import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import IconGoogle from './icon/google';
import useAuth from ' /hooks/use-auth';
import Link from 'next/link';
import useSignOut from ' /hooks/use-sign-out';
import useGetSubscriptionLink from ' /hooks/use-get-subscription-links';

const Header = () => {
  const { name } = useAuth();
  const { mutateAsync, isPending: isGettingSubscription } =
    useGetSubscriptionLink();

  const { mutate: signout } = useSignOut();
  return (
    <Flex
      w="full"
      bgColor="darkTheme.900"
      h="100px"
      alignItems="center"
      justifyContent="space-between"
      p="4"
      px="8"
    >
      <Heading as="h1" color="neutral.50">
        BackTest
      </Heading>
      <Button
        isDisabled={!name}
        isLoading={isGettingSubscription}
        onClick={async () => {
          const data = await mutateAsync();
          window.open(data, '_blank');
        }}
      >
        Subscribe
      </Button>
      {!!name && (
        <Flex alignItems="center">
          <Text color="neutral.50" mr="4">
            {name}
          </Text>
          <Button
            size="md"
            p="5"
            colorScheme="primary"
            variant="outline"
            onClick={() => {
              signout();
            }}
          >
            Sign Out
          </Button>
        </Flex>
      )}
      {!name && (
        <Button
          size="md"
          p="5"
          colorScheme="primary"
          variant="outline"
          as={Link}
          href={'http://localhost:3000/auth/google'}
        >
          <IconGoogle boxSize="6" />
          <Text ml="2">Sign In With Google</Text>
        </Button>
      )}
    </Flex>
  );
};

export default Header;
