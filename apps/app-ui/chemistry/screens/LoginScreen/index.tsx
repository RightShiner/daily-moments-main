import React, { useEffect } from 'react';
import { Box, Button, Heading, Spacer, VisuallyHidden, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { FaApple, FaGoogle } from 'react-icons/fa';
import { useUser } from '../../../hooks/useUser';

export const Screen = () => {
  const user = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user != null) {
      router.replace('/');
    }
  }, [user]);

  return (
    <Box
      maxW={'md'}
      py={{ base: 8, sm: 12, md: 16 }}
      px={{ base: 4, sm: 2, md: 0 }}
      mx={'auto'}
    >
      <Heading textAlign={'center'} size={'xl'} fontWeight={'extrabold'}>
        Sign in to your account
      </Heading>
      <Spacer />
      <VStack py={{ base: 8, md: 12 }} spacing={4}>
        <LoginButton
          icon={<Box as={FaGoogle} color={'red.500'} />}
          description={'Login with Google'}
          onClick={() => signIn('google')}
        />
        <LoginButton
          icon={<FaApple />}
          description={'Login with Apple'}
          onClick={() => signIn('apple')}
        />
      </VStack>
    </Box>
  );
};

interface LoginButtonProps {
  description: string;
  icon: React.ReactElement;
  onClick: () => void;
}

const LoginButton = ({ description, icon, onClick }: LoginButtonProps) => (
  <Button variant={'outline'} w={'100%'} leftIcon={icon} onClick={onClick} py={6}>
    <VisuallyHidden>{description}</VisuallyHidden>
    {description}
  </Button>
);
