import * as mongoose from 'mongoose';
import { Connection, Document } from 'mongoose';
import { InjectedDatabaseConnectionName } from '../../../database/contants';
import { InjectedStatsModelName } from './constants';

export class StatsEntity extends Document {
  readonly streak: {
    range: [Date, Date] | null;
  };
  readonly userId: String;
}

export const StatsEntitySchema = new mongoose.Schema(
  {
    streak: {
      range: [Date, Date],
    },
    userId: String,
  },
  {
    collection: 'stats',
  },
);

export const statsDatabaseProviders = [
  {
    provide: InjectedStatsModelName,
    useFactory: (connection: Connection) => connection.model('Stats', StatsEntitySchema),
    inject: [InjectedDatabaseConnectionName],
  },
];
