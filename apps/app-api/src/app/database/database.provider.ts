import mongoose from 'mongoose';
import { InjectedDatabaseConnectionName } from './contants';

export const databaseProviders = [
  {
    provide: InjectedDatabaseConnectionName,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(process.env.DATABASE_URL),
  },
];
