import React from 'react';
import { PrimaryButton } from '@dm/chemistry';
import { useSession } from 'next-auth/react';
import { useAppSelector } from '../../../../store';
import { getPaddle } from '../../../../services/PaddleService';

export const UpgradeToPremiumButton = () => {
  const session = useSession();
  const { userPreferences } = useAppSelector((state) => state.preferences);
  const { paddleLoaded } = useAppSelector((state) => state.accountScreen);

  return (
    <PrimaryButton
      justifySelf={'end'}
      onClick={() => {
        getPaddle().Checkout.open({
          product: Number.parseFloat(process.env.NEXT_PUBLIC_PADDLE_SUBSCRIPTION_PLAN_ID),
          email: session.data.user.email,
          passthrough: JSON.stringify({
            userId: userPreferences.userId,
          }),
        });
      }}
      isLoading={!paddleLoaded}
      isDisabled={!paddleLoaded}
    >
      Upgrade to Premium
    </PrimaryButton>
  );
};
