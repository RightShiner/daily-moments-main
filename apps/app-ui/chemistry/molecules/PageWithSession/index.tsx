import React, { useEffect, useRef } from 'react';
import { useRequireUser } from '../../../hooks/useRequireUser';
import { SimpleGrid, Spinner } from '@chakra-ui/react';
import { useUser } from '../../../hooks/useUser';

export interface ProtectedContentProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface Props {
  isPageLoading?: boolean;
  onUserLoaded?: () => void;
  contentRenderer: React.ComponentType<ProtectedContentProps>;
}

export const PageWithSession = ({
  isPageLoading = false,
  onUserLoaded,
  ...props
}: Props) => {
  useRequireUser();
  const user = useUser();

  const onUserCalled = useRef(false);
  /**
   * Run this useEffect on first render only if the user already exists (intentionally empty deps array)
   */
  useEffect(() => {
    if (user != null && onUserLoaded != null) {
      onUserLoaded();
      onUserCalled.current = true;
    }
  }, []);
  /**
   * Run this useEffect instead if the user had to be loaded and now it is present
   */
  useEffect(() => {
    if (!onUserCalled.current && user != null && onUserLoaded != null) {
      onUserLoaded();
      onUserCalled.current = true;
    }
  }, [user, onUserLoaded]);

  return user == null || isPageLoading ? (
    <SimpleGrid py={8} justifyItems={'center'}>
      <Spinner size='xl' />
    </SimpleGrid>
  ) : (
    <props.contentRenderer user={user} />
  );
};
