import * as mongoose from 'mongoose';
import { Connection, Document } from 'mongoose';
import { InjectedUserPreferencesModelName } from './constants';
import { InjectedDatabaseConnectionName } from '../../../database/contants';
import { SubscriptionStatus } from '@dm/models';

export class UserPreferencesEntity extends Document {
  name?: string | null;
  timezone: string;
  userId: string;
  following: string[] | null;
  paddleUserId: string | null;
  readonly subscription: {
    id: string;
    planId: string;
    expiration: string;
    status: SubscriptionStatus;
    update: string | null;
    cancel: string | null;
  } | null;
}

export const UserPreferencesSchema = new mongoose.Schema(
  {
    name: String,
    timezone: String,
    userId: String,
    following: Array,
    paddleUserId: String,
    subscription: {
      id: String,
      planId: String,
      expiration: String,
      status: String,
      update: String,
      cancel: String,
    },
  },
  {
    collection: 'user_preferences',
  },
);

export const usersDatabaseProviders = [
  {
    provide: InjectedUserPreferencesModelName,
    useFactory: (connection: Connection) =>
      connection.model('UserPreferences', UserPreferencesSchema),
    inject: [InjectedDatabaseConnectionName],
  },
];
