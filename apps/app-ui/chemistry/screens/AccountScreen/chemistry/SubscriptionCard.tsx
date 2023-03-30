import React, { useMemo } from 'react';
import { Box, Heading, SimpleGrid, Stack } from '@chakra-ui/react';
import { Card } from '../../../molecules/Card';
import { UpgradeToPremiumButton } from './UpgradeToPremiumButton';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { SubscriptionStatus } from '@dm/models';
import moment from 'moment-timezone';
import Script from 'next/script';
import { fetchUserPreferences } from '../../../../store/actions/users.actions';
import { actions as accountScreenActions } from '../../../../store/slices/screens/account';
import { getPaddle } from '../../../../services/PaddleService';
import { ManageSubscriptionButton } from './ManageSubscriptionButton';

export const SubscriptionCard = () => {
  const { userPreferences, isUserSubscribed } = useAppSelector(
    (state) => state.preferences,
  );
  const dispatcher = useAppDispatch();

  const messageContent = useMemo(() => {
    if (userPreferences.subscription != null) {
      switch (userPreferences.subscription.status) {
        case SubscriptionStatus.ACTIVE:
          return `You're currently subscribed to Daily Moments Premium. Your access will renew automatically on ${moment(
            userPreferences.subscription.expiration,
          ).format('MMMM D, YYYY')}.`;
        case SubscriptionStatus.CANCELLED:
          if (
            moment
              .tz(userPreferences.subscription.expiration, userPreferences.timezone)
              .isAfter(moment().tz(userPreferences.timezone), 'day')
          )
            return `You've cancelled your subscription. Your access to premium features will expire on ${moment(
              userPreferences.subscription.expiration,
            ).format('MMMM D, YYYY')}.`;
          break;
        case SubscriptionStatus.PAUSED:
          return `Your subscription is paused, and as a result, your access to premium features is also currently paused.`;
        case SubscriptionStatus.PAST_DUE:
          return `Your subscription payment is past due, and as a result, your access to premium features is paused.`;
        case SubscriptionStatus.TRIAL:
          return `You are currently on a trial of Daily Moments Premium.`;
      }
    }
    return "You're not currently subscribed to Premium. For just $9 per year, upgrade to get more out of Daily Moments.";
  }, [userPreferences]);

  return (
    <>
      <Card>
        <Box px={6} pt={6}>
          <Heading as={'h2'} fontSize={'xl'}>
            Subscription
          </Heading>
          <Box as={'p'} pb={6} color={'gray.500'} fontSize={'sm'}>
            Manage your premium subscription.
          </Box>
        </Box>
        <Stack px={6} pb={6} spacing={5}>
          <SimpleGrid gap={3} columns={1}>
            <Box as={'p'}>{messageContent}</Box>
            {isUserSubscribed ? <ManageSubscriptionButton /> : <UpgradeToPremiumButton />}
          </SimpleGrid>
        </Stack>
      </Card>

      <Script
        src={'https://cdn.paddle.com/paddle/paddle.js'}
        onLoad={() => {
          if (process.env.NEXT_PUBLIC_PADDLE_ENV) {
            getPaddle().Environment.set(process.env.NEXT_PUBLIC_PADDLE_ENV);
          }
          getPaddle().Setup({
            vendor: Number.parseFloat(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID),
            eventCallback: function (data) {
              switch (data.event) {
                case 'Checkout.Complete':
                case 'Checkout.Close':
                  dispatcher(fetchUserPreferences());
                  break;
              }
            },
          });
          dispatcher(accountScreenActions.setPaddleLoaded(true));
        }}
      />
    </>
  );
};
