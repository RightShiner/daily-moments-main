import moment from 'moment-timezone';

export interface UserPreferences {
  userId: string;
  name: string;
  timezone: string;
  following: string[];
  subscription: UserSubscription | null;
}

export const isUserSubscribed = (userPreferences: UserPreferences): boolean =>
  userPreferences.subscription?.status === SubscriptionStatus.ACTIVE ||
  userPreferences.subscription?.status === SubscriptionStatus.TRIAL ||
  (userPreferences.subscription?.status === SubscriptionStatus.CANCELLED &&
    moment
      .tz(userPreferences.subscription.expiration, userPreferences.timezone)
      .isAfter(moment().tz(userPreferences.timezone), 'day'));

export interface UserSubscription {
  expiration: string;
  status: SubscriptionStatus;
}

export enum SubscriptionStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  PAUSED = 'PAUSED',
  PAST_DUE = 'PAST_DUE',
  UNKNOWN = 'UNKNOWN',
}
