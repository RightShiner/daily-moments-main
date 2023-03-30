import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getToken } from 'next-auth/jwt';
import { SubscriptionStatus, UserPreferences } from '@dm/models';
import { UpdateUserPreferencesPayload } from './models/users.payload';
import moment from 'moment-timezone';
import { Model } from 'mongoose';
import { UserPreferencesEntity } from './models/users.mongoose.schema';
import { InjectedUserPreferencesModelName } from './models/constants';
import { AddRemoveFollowPayload } from './models/follows.payload';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @Inject(InjectedUserPreferencesModelName)
    private userPreferencesModel: Model<UserPreferencesEntity>,
  ) {}

  async currentUser() {
    const token = await getToken({
      req: this.request as any,
      secret: process.env.NEXTAUTH_SECRET,
    });
    return token ?? null;
  }

  async currentUserId() {
    return this.currentUser().then((cu) =>
      cu != null ? `${cu.provider}:${cu.sub}` : null,
    );
  }

  async currentUserPreferences(): Promise<UserPreferences> {
    const userId = await this.currentUserId();
    return this.getUserPreferencesByUserId(userId);
  }

  async getUserPreferencesByUserId(userId: string): Promise<UserPreferences> {
    const currentPreferences = await this.userPreferencesModel.findOne({ userId }).exec();
    return currentPreferences != null
      ? convertEntity(userId, currentPreferences)
      : getDefaultUserPreferences(userId);
  }

  async updateUserPreferences(
    payload: UpdateUserPreferencesPayload,
  ): Promise<UserPreferences> {
    if (moment.tz.zone(payload.timezone) == null) {
      throw new BadRequestException(`Invalid timezone submitted`);
    }
    return this.genericUpdateUserPreferences((preferences) => {
      Object.keys(payload).forEach((key) => {
        preferences[key] = payload[key];
      });
    });
  }

  async addNewFollow(payload: AddRemoveFollowPayload) {
    return this.genericUpdateUserPreferences((preferences) => {
      const currentFollowList = preferences.following ?? [];
      if (currentFollowList.includes(payload.userId)) {
        throw new BadRequestException('User is already following this user');
      }
      preferences.following = [...currentFollowList, payload.userId];
    });
  }

  async removeFollow(payload: AddRemoveFollowPayload) {
    return this.genericUpdateUserPreferences((preferences) => {
      const currentFollowList = preferences.following ?? [];
      preferences.following = currentFollowList.filter((f) => f !== payload.userId);
    });
  }

  private async genericUpdateUserPreferences(
    updater: (preferences: UserPreferencesEntity) => void,
  ): Promise<UserPreferences> {
    const userId = await this.currentUserId();
    const currentPreferences = await this.userPreferencesModel.findOne({ userId }).exec();
    const toBeSaved =
      currentPreferences != null
        ? currentPreferences
        : await this.createNewUserPreferences(userId);
    updater(toBeSaved);
    const savedEntity = await toBeSaved.save();
    return convertEntity(userId, savedEntity);
  }

  private async createNewUserPreferences(
    userId: string,
    overrideContent: Partial<UserPreferencesEntity> = {},
  ) {
    return new this.userPreferencesModel({
      userId,
      name: '',
      timezone: 'America/Chicago',
      ...overrideContent,
    });
  }

  async getManageSubscriptionUrls() {
    const userId = await this.currentUserId();
    const currentPreferences = await this.userPreferencesModel.findOne({ userId }).exec();
    if (currentPreferences?.subscription == null) {
      throw new NotFoundException('No active subscription found');
    }
    return {
      update: currentPreferences.subscription.update,
      cancel: currentPreferences.subscription.cancel,
    };
  }

  async handlePaddleWebhook(payload: any) {
    switch (payload.alert_name) {
      case 'subscription_created':
      case 'subscription_updated':
        await this.handlePaddleSubscriptionCreatedOrUpdated(payload);
        break;
      case 'subscription_cancelled':
        await this.handlePaddleSubscriptionCancelled(payload);
        break;
      case 'subscription_payment_succeeded':
        await this.handlePaddleSubscriptionPaymentSucceeded(payload);
        break;
      case 'subscription_payment_refunded':
        await this.handlePaddleSubscriptionPaymentRefunded(payload);
        break;
    }
  }

  private handlePaddleSubscriptionCreatedOrUpdated(payload: any) {
    return this.handleSubscriptionUpdate(payload, () => ({
      id: payload.subscription_id,
      planId: payload.subscription_plan_id,
      expiration: payload.next_bill_date,
      status: UsersService.parsePaddleSubscriptionStatusFromPaddlePayload(payload),
      update: payload.update_url,
      cancel: payload.cancel_url,
    }));
  }

  private handlePaddleSubscriptionCancelled(payload: any) {
    return this.handleSubscriptionUpdate(payload, () => ({
      id: payload.subscription_id,
      planId: payload.subscription_plan_id,
      expiration: payload.cancellation_effective_date,
      status: SubscriptionStatus.CANCELLED,
      update: null,
      cancel: null,
    }));
  }

  private handlePaddleSubscriptionPaymentSucceeded(payload: any) {
    return this.handleSubscriptionUpdate(payload, (currentUserPreferences) => {
      if (currentUserPreferences?.subscription == null) {
        throw new BadRequestException('No record of subscription for this user');
      }
      return {
        ...currentUserPreferences.subscription,
        expiration: payload.next_bill_date,
        status: UsersService.parsePaddleSubscriptionStatusFromPaddlePayload(payload),
      };
    });
  }

  private handlePaddleSubscriptionPaymentRefunded(payload: any) {
    return this.handleSubscriptionUpdate(payload, (currentUserPreferences) => {
      if (currentUserPreferences?.subscription == null) {
        throw new BadRequestException('No record of subscription for this user');
      }
      return {
        ...currentUserPreferences.subscription,
        expiration: moment().tz(currentUserPreferences.timezone).format('YYYY-MM-DD'),
        status: SubscriptionStatus.CANCELLED,
      };
    });
  }

  private async handleSubscriptionUpdate(
    payload: any,
    performUpdate: (currentPreferences: UserPreferencesEntity) => SubscriptionInDatabase,
  ) {
    const userId =
      JSON.parse(
        payload.passthrough != null && payload.passthrough.length > 0
          ? payload.passthrough
          : '{}',
      ).userId ?? null;
    const currentPreferences =
      userId != null
        ? await this.userPreferencesModel.findOne({ userId }).exec()
        : await this.userPreferencesModel
            .findOne({ paddleUserId: payload.user_id })
            .exec();

    const subscription = performUpdate(currentPreferences);

    let toBeSaved;
    if (currentPreferences != null) {
      toBeSaved = currentPreferences;
      toBeSaved['subscription'] = subscription;
      toBeSaved['paddleUserId'] = payload.user_id;
    } else {
      if (userId == null) {
        throw new BadRequestException('No userId provided in passthrough payload');
      }
      toBeSaved = await this.createNewUserPreferences(userId, {
        subscription,
        paddleUserId: payload.user_id,
      });
    }
    await toBeSaved.save();
  }

  private static parsePaddleSubscriptionStatusFromPaddlePayload(payload: any) {
    let status;
    switch (payload.status) {
      // See https://developer.paddle.com/reference/ZG9jOjI1MzU0MDI2-subscription-status-reference
      case 'active':
        status = SubscriptionStatus.ACTIVE;
        break;
      case 'trialing':
        status = SubscriptionStatus.TRIAL;
        break;
      case 'past_due':
        status = SubscriptionStatus.PAST_DUE;
        break;
      case 'paused':
        status = SubscriptionStatus.PAUSED;
        break;
      case 'deleted':
        status = SubscriptionStatus.CANCELLED;
        break;
      default:
        status = SubscriptionStatus.UNKNOWN;
    }
    return status;
  }
}

interface SubscriptionInDatabase {
  id: string;
  planId: string;
  expiration: string;
  status: SubscriptionStatus;
  update: string | null;
  cancel: string | null;
}

const getDefaultUserPreferences: (string) => UserPreferences = (userId: string) => ({
  userId,
  name: '',
  timezone: 'America/Chicago',
  following: [],
  subscription: null,
});

const convertEntity = (userId: string, ent: UserPreferencesEntity): UserPreferences => ({
  userId,
  name: ent.name ?? '',
  timezone: ent.timezone,
  following: ent.following ?? [],
  subscription:
    ent.subscription != null
      ? {
          expiration: ent.subscription.expiration,
          status: ent.subscription.status,
        }
      : null,
});
