import * as mongoose from 'mongoose';
import { Connection, Document } from 'mongoose';
import { InjectedEntryModelName } from './constants';
import { InjectedDatabaseConnectionName } from '../../../database/contants';

export enum SortableEntryFields {
  DATE = 'date',
}

export class EntryEntity extends Document {
  readonly date: Date;
  readonly content: string;
  readonly userId: string;
  readonly isPublic: boolean;
  readonly fromDate: Date;
}

export const EntryEntitySchema = new mongoose.Schema(
  {
    date: Date,
    content: String,
    userId: String,
    isPublic: Boolean,
    fromDate: Date,
  },
  {
    collection: 'entries',
  },
);

export const entriesDatabaseProviders = [
  {
    provide: InjectedEntryModelName,
    useFactory: (connection: Connection) =>
      connection.model('Entries', EntryEntitySchema),
    inject: [InjectedDatabaseConnectionName],
  },
];
