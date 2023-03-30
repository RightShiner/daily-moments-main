import React, { useCallback } from 'react';
import { PageWithSession, ProtectedContentProps } from '../../molecules/PageWithSession';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchUserPreferences } from '../../../store/actions/users.actions';
import { AsyncStatus } from '../../../store/types';
import { Heading, VStack } from '@chakra-ui/react';
import { GeneralInformationCard } from './chemistry/GeneralInformationCard';
import { SubscriptionCard } from './chemistry/SubscriptionCard';
import { PublicPageCard } from './chemistry/PublicPageCard';

export const Screen = () => {
  const { fetchUserPreferencesStatus, userPreferences } = useAppSelector(
    (state) => state.preferences,
  );
  const dispatch = useAppDispatch();
  const onUserLoaded = useCallback(() => {
    dispatch(fetchUserPreferences());
  }, [dispatch]);

  return (
    <PageWithSession
      isPageLoading={
        userPreferences == null ||
        fetchUserPreferencesStatus === AsyncStatus.INACTIVE ||
        fetchUserPreferencesStatus === AsyncStatus.PENDING
      }
      onUserLoaded={onUserLoaded}
      contentRenderer={AuthenticatedScreen}
    />
  );
};

const AuthenticatedScreen = (props: ProtectedContentProps) => (
  <VStack
    maxW={{ md: '3xl' }}
    mx={'auto'}
    px={{ base: 4, md: 8 }}
    py={4}
    w={'100%'}
    spacing={{ base: 6, md: 10 }}
  >
    <Heading as={'h1'}>Account</Heading>
    <GeneralInformationCard />
    <PublicPageCard />
    <SubscriptionCard />
    {/*<YourDataCard />*/}
  </VStack>
);
