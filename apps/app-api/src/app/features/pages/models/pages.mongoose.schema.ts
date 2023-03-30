import * as mongoose from 'mongoose';
import { Connection, Document } from 'mongoose';
import { InjectedPageModelName } from './constants';
import { InjectedDatabaseConnectionName } from '../../../database/contants';

export class PageEntity extends Document {
  userId: string;
  enabled: boolean;
  slug: string;
}

export const PageSchema = new mongoose.Schema(
  {
    userId: String,
    enabled: Boolean,
    slug: String,
  },
  {
    collection: 'pages',
  },
);

export const pagesDatabaseProviders = [
  {
    provide: InjectedPageModelName,
    useFactory: (connection: Connection) => connection.model('Pages', PageSchema),
    inject: [InjectedDatabaseConnectionName],
  },
];
