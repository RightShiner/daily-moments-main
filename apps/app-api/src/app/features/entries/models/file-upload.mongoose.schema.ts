import * as mongoose from 'mongoose';
import { Connection, Document } from 'mongoose';
import { InjectedFileUploadModelName } from './constants';
import { InjectedDatabaseConnectionName } from '../../../database/contants';

export enum FileStatus {
  PENDING = 'PENDING',
  FINISHED = 'FINISHED',
}

export class FileUploadEntity extends Document {
  readonly entryId: string;
  readonly size: number;
  readonly fileType: string;
  readonly s3Key: string;
  readonly uploaderId: string;
  readonly width: number;
  readonly height: number;
  readonly status: string;
}

export const FileUploadEntitySchema = new mongoose.Schema(
  {
    entryId: String,
    size: Number,
    fileType: String,
    s3Key: String,
    uploaderId: String,
    width: Number,
    height: Number,
    status: String,
  },
  {
    collection: 'fileUploads',
  },
);

export const fileUploadsDatabaseProviders = [
  {
    provide: InjectedFileUploadModelName,
    useFactory: (connection: Connection) =>
      connection.model('FileUploads', FileUploadEntitySchema),
    inject: [InjectedDatabaseConnectionName],
  },
];
